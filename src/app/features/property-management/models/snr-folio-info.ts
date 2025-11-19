export interface DataFolio {
  fid?: number;
  orip?: string;
  fmi?: string;
  fechaApertura?: string;
  estado?: string;
  matriculaMatriz?: string;
  matriculaSegregados?: string;
  direccion?: string;
  zona?: string;
}

export class InfoFolio {
  matriculaMatriz: string;
  matriculaSegregados: string;
  zona: string;
  direccion: string;
  fechaApertura: string;
  estado: string;

  constructor(obj: DataFolio) {
    this.matriculaMatriz = obj.matriculaMatriz as string;
    this.matriculaSegregados = obj.matriculaSegregados as string;
    this.zona = obj.zona as string;
    this.direccion = obj.direccion as string;
    this.fechaApertura = obj.fechaApertura as string;
    this.estado = obj.estado as string;
  }
}

