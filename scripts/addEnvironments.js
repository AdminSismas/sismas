const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Archivo que se debe ignorar
const IGNORED_FILES = require('./environments.constants').IGNORED_FILES;

// Ruta a la carpeta environments
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

// Función para obtener los nuevos parámetros desde los argumentos de la línea de comandos
function getNewParameters() {
  const args = process.argv.slice(2); // Ignorar "node" y el nombre del script
  const newParameters = {};

  // Los argumentos deben estar en pares: [newParameter, newValue]
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    if (key && value) {
      newParameters[key] = value;
    } else {
      console.error(`Error: Falta un valor para el parámetro "${key}".`);
      process.exit(1); // Salir con error
    }
  }

  console.log('Nuevos parámetros:', newParameters);

  return newParameters;
}

// Función para aplicar las novedades a un objeto
function applyUpdates(obj, updates) {
  // Fusionar las novedades dentro del objeto
  return { ...obj, ...updates };
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

    // Aplicar las novedades al objeto
    const updatedEnvironment = applyUpdates(environment, newParameters);

    // Escribir el archivo TypeScript actualizado
    writeTypeScriptFile(filePath, updatedEnvironment);

    console.log(`Updated ${file}`);
  });
}

// Ejecutar el script
main();