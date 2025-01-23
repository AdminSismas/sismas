export class Subvista {
    id: number;
    nombre_subvista: string;

    constructor(subvista: any) {
        this.id = subvista.id;
        this.nombre_subvista = subvista.nombre_subvista;
    }
  }
  
  export class Vista {

    id: number;
    nombre_vista: string;
    subvistas?: Subvista[]; 

    constructor(vista: any) {
        this.id = vista.id;
        this.nombre_vista = vista.nombre_vista;
        if (vista.subvistas) {
            this.subvistas = vista.subvistas.map((subvista: any) => new Subvista(subvista));
      
  }
}
}
  
  export class Modulo {
    id: number;
    modulo: string;
    vistas: Vista[];

    constructor(modulo: any) {
        this.id = modulo.id;
        this.modulo = modulo.modulo;
        this.vistas = modulo.vistas.map((vista: any) => new Vista(vista));
    }
  }
  