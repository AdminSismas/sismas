const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Archivo que se debe ignorar
const IGNORED_FILES = require('./environments.constants').IGNORED_FILES;

// Ruta a la carpeta environments
const environmentsFolder = path.join(__dirname, '@environments');

// Función para leer y evaluar un archivo TypeScript
function evaluateTypeScriptFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Transpilar el archivo TypeScript a JavaScript
  const transpiled = ts.transpileModule(fileContent, {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  });

  // Evaluar el código JavaScript resultante
  const module = { exports: {} };
  const func = new Function('exports', 'module', transpiled.outputText);
  func(module.exports, module);

  return module.exports.environment; // Extraer el objeto `environment`
}

// Función para formatear un valor según su tipo
function formatValue(value, indent) {
  if (typeof value === 'string') {
    return `"${value}"`; // Strings entre comillas dobles
  } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // Si es un objeto, formatearlo recursivamente
    return formatObjectWithoutQuotes(value, indent + 2);
  } else if (Array.isArray(value)) {
    // Si es un array, formatearlo correctamente
    const items = value.map(item => formatValue(item, indent)).join(', ');
    return `[${items}]`;
  } else {
    // Números, booleanos, null, etc.
    return value;
  }
}

// Función para formatear un objeto sin comillas en las keys
function formatObjectWithoutQuotes(obj, indent = 2) {
  const entries = Object.entries(obj)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Ordenar las keys alfabéticamente
    .map(([key, value]) => {
      // Formatear el valor según su tipo
      const formattedValue = formatValue(value, indent);
      return `${' '.repeat(indent)}${key}: ${formattedValue}`;
    })
    .join(',\n');

  return `{\n${entries}\n${' '.repeat(indent - 2)}}`;
}

// Función para escribir un archivo TypeScript
function writeTypeScriptFile(filePath, data) {
  // Formatear el objeto sin comillas en las keys
  const formattedData = formatObjectWithoutQuotes(data);

  // Mantener la sintaxis original `export const environment`
  const content = `export const environment = ${formattedData};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

// Función para verificar si existe una propiedad anidada
function hasNestedProperty(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (!current || typeof current !== 'object' || !current.hasOwnProperty(key)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

// Función para crear un objeto anidado a partir de una ruta de puntos
function setNestedProperty(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Función para obtener los nuevos parámetros desde los argumentos de la línea de comandos
function getNewParameters() {
  const args = process.argv.slice(2); // Ignorar "node" y el nombre del script
  const newParameters = {};
  const originalKeys = []; // Mantener las keys originales para validación

  // Los argumentos deben estar en pares: [newParameter, newValue]
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    if (key && value) {
      originalKeys.push(key); // Guardar la key original
      // Si la key contiene puntos, crear estructura anidada
      if (key.includes('.')) {
        setNestedProperty(newParameters, key, value);
      } else {
        newParameters[key] = value;
      }
    } else {
      console.error(`Error: Falta un valor para el parámetro "${key}".`);
      process.exit(1); // Salir con error
    }
  }

  console.log('Nuevos parámetros:', newParameters);

  // Agregar las keys originales al objeto para su uso posterior
  newParameters._originalKeys = originalKeys;
  return newParameters;
}

// Función para fusionar objetos de forma profunda
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) &&
          typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
        // Si ambos son objetos, fusionar recursivamente
        result[key] = deepMerge(result[key], source[key]);
      } else {
        // Sobrescribir o agregar la propiedad
        result[key] = source[key];
      }
    }
  }
  
  return result;
}

// Función para aplicar las novedades a un objeto
function applyUpdates(obj, updates) {
  // Fusionar las novedades dentro del objeto usando fusión profunda
  return deepMerge(obj, updates);
}

// Función principal
function main() {
  // Obtener los nuevos parámetros desde los argumentos de la línea de comandos
  const newParameters = getNewParameters();

  if (Object.keys(newParameters).length === 0) {
    console.error('Error: No se proporcionaron nuevos parámetros.');
    console.log('Uso: node updateEnvironments.js [newParameter1 newValue1] [newParameter2 newValue2] ...');
    process.exit(1); // Salir con error
  }

  // Leer todos los archivos en la carpeta environments
  const files = fs.readdirSync(environmentsFolder);

  // Guardar las keys originales para reutilizar en cada archivo
  const originalKeys = newParameters._originalKeys || [];
  
  files.forEach(file => {
    // Ignorar el archivo especificado
    const isIgnoredFile = IGNORED_FILES.some(ignoredFile => ignoredFile === file);
    if (isIgnoredFile) {
      console.log('\x1b[1m\x1b[3m\x1b[31m'
        + `Ignoring ${file}`
        + '\x1b[0m'
      );
      return;
    }

    console.log(`\x1b[36mProcessing ${file}...\x1b[0m`);

    const filePath = path.join(environmentsFolder, file);

    try {
      // Leer y evaluar el archivo TypeScript
      const environment = evaluateTypeScriptFile(filePath);

      // Crear una copia limpia de newParameters sin la propiedad auxiliar
      const cleanParameters = { ...newParameters };
      delete cleanParameters._originalKeys;

      // Verificar que los parámetros no existan ya usando las keys originales
      const existingParameters = originalKeys.filter(
        key => {
          if (key.includes('.')) {
            // Para propiedades anidadas, verificar si la propiedad específica existe
            return hasNestedProperty(environment, key);
          } else {
            // Para propiedades de primer nivel, verificar si ya existe
            return environment.hasOwnProperty(key);
          }
        }
      );

      if (existingParameters.length > 0) {
        console.error(`\x1b[33mSkipping ${file}: Los siguientes parámetros ya existen: ${existingParameters.join(', ')}\x1b[0m`);
        console.log('Use updateEnvironments.js para actualizar parámetros existentes.');
        return; // Saltar este archivo y continuar con el siguiente
      }

      // Aplicar las novedades al objeto
      const updatedEnvironment = applyUpdates(environment, cleanParameters);

      // Escribir el archivo TypeScript actualizado
      writeTypeScriptFile(filePath, updatedEnvironment);

      // Mostrar qué parámetros se agregaron usando las keys originales
      originalKeys.forEach(key => {
        if (key.includes('.')) {
          console.log(`\x1b[32m✓ Added "${key}" to existing object in ${file}\x1b[0m`);
        } else {
          console.log(`\x1b[32m✓ Added new parameter "${key}" to ${file}\x1b[0m`);
        }
      });
    } catch (error) {
      console.error(`\x1b[31m✗ Error processing ${file}: ${error.message}\x1b[0m`);
    }
  });
}

// Ejecutar el script
main();