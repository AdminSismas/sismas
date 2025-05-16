export interface RecognitionProperty {
  ccReconocimientoPredialId: number;
  descripcion?: string;
  docAportados?: string;
  docCatastrales?: string;
  observaciones?: string;
  thirdPartyAffected?:boolean;
  tag01?: string;
  tag02?: string;
  tag03?: string;
  tag04?: string;
  tag05?: string;
  tag06?: string;
  tag07?: string;
  tag08?: string;
  tag09?: string;
  tag10?: string;
  executionId: number;
  createdAt: Date;
  createdBy: string;
  hash?: string;
  updatedAt?: Date;
  updatedBy?: Date;
}

export interface RecognitionPropertyBasic {
  ccReconocimientoPredialId: number;
  descripcion: string;
  docAportados: string;
  docCatastrales: string;
  observaciones: string;
  thirdPartyAffected:boolean;
}

export interface TagsRecognition {
  tag01?: string;
  tag02?: string;
  tag03?: string;
  tag04?: string;
  tag05?: string;
  tag06?: string;
  tag07?: string;
  tag08?: string;
  tag09?: string;
  tag10?: string;
}

export class RecognitionPropertyMapper {
  static mapRecognitionProperty(item: RecognitionProperty): RecognitionPropertyBasic {
    return {
      ccReconocimientoPredialId: item.ccReconocimientoPredialId,
      descripcion: item.descripcion || '',
      docAportados: item.docAportados || '',
      docCatastrales: item.docCatastrales || '',
      observaciones: item.observaciones || '',
      thirdPartyAffected: item.thirdPartyAffected || false
    };
  }

  static mapRecognitionPropertyTags(item: RecognitionProperty): TagsRecognition {
    return {
      tag01: item.tag01 || '',
      tag02: item.tag02 || '',
      tag03: item.tag03 || '',
      tag04: item.tag04 || '',
      tag05: item.tag05 || '',
      tag06: item.tag06 || '',
      tag07: item.tag07 || '',
      tag08: item.tag08 || '',
      tag09: item.tag09 || '',
      tag10: item.tag10 || '',
    };
  }
}
