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

// Función para obtener los parámetros y valores a actualizar desde los argumentos de la línea de comandos
function getParametersToUpdate() {
  const args = process.argv.slice(2); // Ignorar "node" y el nombre del script
  const parametersToUpdate = {};

  // Los argumentos deben estar en pares: [parameter, value]
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    if (key && value) {
      parametersToUpdate[key] = value;
    } else {
      console.error(`Error: Falta un valor para el parámetro "${key}".`);
      process.exit(1); // Salir con error
    }
  }

  return parametersToUpdate;
}

// Función principal
function main() {
  // Obtener los parámetros y valores a actualizar desde los argumentos de la línea de comandos
  const parametersToUpdate = getParametersToUpdate();

  if (Object.keys(parametersToUpdate).length === 0) {
    console.error('Error: No se proporcionaron parámetros para actualizar.');
    console.log('Uso: npm run updateParameterValues -- [parameter1 newValue1] [parameter2 newValue2] ...');
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

    // Verificar si todos los parámetros existen en el archivo
    const missingParameters = Object.keys(parametersToUpdate).filter(
      key => !environment.hasOwnProperty(key)
    );

    if (missingParameters.length > 0) {
      // Si faltan parámetros, mostrar un error y detener la ejecución para este archivo
      console.error(`Error en ${file}: Los siguientes parámetros no existen: ${missingParameters.join(', ')}`);
      return; // Saltar este archivo y continuar con el siguiente
    }

    // Actualizar los parámetros
    Object.entries(parametersToUpdate).forEach(([key, value]) => {
      environment[key] = value;
      console.log(`Updated "${key}" to "${value}" in ${file}`);
    });

    // Escribir el archivo TypeScript actualizado
    writeTypeScriptFile(filePath, environment);
  });
}

// Ejecutar el script
main();