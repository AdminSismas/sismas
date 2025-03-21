export interface Reconocimiento {
  ccReconocimientoPredialId: number;
  descripcion?: string;
  docAportados?: string;
  docCatastrales?: string;
  observaciones?: string;
  tag01?: string;
  tag02?: string;
  tag03?: string;
  tag04?: string;
  tag05?: string;
  executionId: number;
  createdAt: Date;
  createdBy: string;
  hash?: string;
  updatedAt?: Date;
  updatedBy?: Date;
}

export interface ReconocimientoPredial {
  ccReconocimientoPredialId: number;
  descripcion: string;
  docAportados: string;
  docCatastrales: string;
  observaciones: string;
}

export class ReconocimientoPredialMapper {
  static mapReconocimiento(item: Reconocimiento): ReconocimientoPredial {
    return {
      ccReconocimientoPredialId: item.ccReconocimientoPredialId,
      descripcion: item.descripcion || '',
      docAportados: item.docAportados || '',
      docCatastrales: item.docCatastrales || '',
      observaciones: item.observaciones || '',
    };
  }
}
