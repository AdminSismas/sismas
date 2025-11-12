export class Subvista {
  id: number;
  nombre_subvista: string;

  constructor(subvista: Partial<Subvista>) {
    this.id = subvista.id ?? 0;
    this.nombre_subvista = subvista.nombre_subvista ?? '';
  }
}

export class Vista {
  id: number;
  nombre_vista: string;
  subvistas?: Subvista[];

  constructor(vista: Partial<Vista>) {
    this.id = vista.id ?? 0;
    this.nombre_vista = vista.nombre_vista ?? '';
    if (vista.subvistas) {
      this.subvistas = vista.subvistas.map(
        (subvista) => new Subvista(subvista)
      );
    }
  }
}

export class Modulo {
  id: number;
  modulo: string;
  vistas: Vista[];

  constructor(modulo: Partial<Modulo>) {
    this.id = modulo.id ?? 0;
    this.modulo = modulo.modulo ?? '';
    this.vistas = modulo.vistas?.map((vista) => new Vista(vista)) ?? [];
  }
}
