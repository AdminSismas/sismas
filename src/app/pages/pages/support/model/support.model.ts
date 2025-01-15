export class supportData {
    id?: number;
    nombre?: string;
    id_modulo?: string;
    id_vista?: string;
    observacion?: string;
  
    constructor(item: any){
      this.id = item.id;
      this.nombre = item.nombre;
      this.id_modulo = item.id_modulo;
      this.id_vista = item.id_vista;
      this.observacion = item.observacion;
    }
  }
  