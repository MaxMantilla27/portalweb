const fs = require('fs');
const path = require('path');

const lineaAAgregar = '<!-- holax -->\n';
const directorioBase = path.join(__dirname, 'src');

// Función para agregar la línea si no está presente
function agregarLineaSiNoExiste(filePath) {
  const contenido = fs.readFileSync(filePath, 'utf8');
  if (!contenido.includes(lineaAAgregar.trim())) {
    const nuevoContenido = lineaAAgregar + contenido;
    fs.writeFileSync(filePath, nuevoContenido, 'utf8');
    console.log(`Línea agregada a ${filePath}`);
  }
}

// Función recursiva para recorrer directorios
function recorrerDirectorio(directorio) {
  const archivos = fs.readdirSync(directorio);

  archivos.forEach((archivo) => {
    const rutaCompleta = path.join(directorio, archivo);
    const estadisticas = fs.statSync(rutaCompleta);

    if (estadisticas.isDirectory()) {
      recorrerDirectorio(rutaCompleta);
    } else if (rutaCompleta.endsWith('.html')) {
      agregarLineaSiNoExiste(rutaCompleta);
    }
  });
}

// Inicia el recorrido desde el directorio base
recorrerDirectorio(directorioBase);
