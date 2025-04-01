import { RecognitionPropertyService } from '../../services/bpm/recognition-property.service';

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
}

export class RecognitionPropertyMapper {
  static mapRecognitionProperty(item: RecognitionProperty): RecognitionPropertyBasic {
    return {
      ccReconocimientoPredialId: item.ccReconocimientoPredialId,
      descripcion: item.descripcion || '',
      docAportados: item.docAportados || '',
      docCatastrales: item.docCatastrales || '',
      observaciones: item.observaciones || '',
    };
  }

  static mapRecognitionPropertyTags(item: RecognitionProperty): TagsRecognition {
    return {
      tag01: item.tag01 || '',
      tag02: item.tag02 || '',
      tag03: item.tag03 || '',
      tag04: item.tag04 || '',
      tag05: item.tag05 || '',
    };
  }
}
