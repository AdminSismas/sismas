const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Archivo que se debe ignorar
const IGNORED_FILES = require('./environments.constants').IGNORED_FILES;

// Ruta a la carpeta environments en Angular (src/environments)
const environmentsFolder = path.join(__dirname, '../src/environments');

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

// Función para eliminar una propiedad anidada
function deleteNestedProperty(obj, path) {
  const keys = path.split('.');
  
  if (keys.length === 1) {
    // Si es una propiedad de primer nivel
    delete obj[keys[0]];
    return true;
  }
  
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      return false; // No se puede eliminar si no existe la ruta
    }
    current = current[key];
  }
  
  delete current[keys[keys.length - 1]];
  return true;
}

// Función para obtener el parámetro a eliminar desde los argumentos de la línea de comandos
function getParameterToRemove() {
  const args = process.argv.slice(2); // Ignorar "node" y el nombre del script

  if (args.length === 0) {
    console.error('Error: No se proporcionó un parámetro para eliminar.');
    console.log('Uso: npm run removeParameter -- [parameterToRemove]');
    process.exit(1); // Salir con error
  }

  return args[0]; // El primer argumento es el parámetro a eliminar
}

// Función principal
function main() {
  // Obtener el parámetro a eliminar desde los argumentos de la línea de comandos
  const parameterToRemove = getParameterToRemove();

  // Leer todos los archivos en la carpeta environments
  const files = fs.readdirSync(environmentsFolder);

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

    const filePath = path.join(environmentsFolder, file);

    // Leer y evaluar el archivo TypeScript
    const environment = evaluateTypeScriptFile(filePath);

    // Eliminar el parámetro si existe
    let parameterExists = false;
    if (parameterToRemove.includes('.')) {
      parameterExists = hasNestedProperty(environment, parameterToRemove);
      if (parameterExists) {
        deleteNestedProperty(environment, parameterToRemove);
        console.log(`Removed "${parameterToRemove}" from ${file}`);
      }
    } else {
      parameterExists = environment.hasOwnProperty(parameterToRemove);
      if (parameterExists) {
        delete environment[parameterToRemove];
        console.log(`Removed "${parameterToRemove}" from ${file}`);
      }
    }
    
    if (!parameterExists) {
      console.log(`Parameter "${parameterToRemove}" not found in ${file}`);
    }

    // Escribir el archivo TypeScript actualizado
    writeTypeScriptFile(filePath, environment);
  });
}

// Ejecutar el script
main();