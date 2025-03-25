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

export interface TagsReconocimiento {
  tag01?: string;
  tag02?: string;
  tag03?: string;
  tag04?: string;
  tag05?: string;
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

  static mapReconocimientoTags(item: Reconocimiento): TagsReconocimiento {
    return {
      tag01: item.tag01 || '',
      tag02: item.tag02 || '',
      tag03: item.tag03 || '',
      tag04: item.tag04 || '',
      tag05: item.tag05 || '',
    };
  }
}
