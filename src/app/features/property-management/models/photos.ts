export interface Photo {
    key: string;           // Ruta completa del archivo en el bucket
    lastModified: string;  // Fecha de última modificación en formato ISO
    size: number;          // Tamaño del archivo en bytes
    url: string;           // URL pública para acceder al archivo
  }
  