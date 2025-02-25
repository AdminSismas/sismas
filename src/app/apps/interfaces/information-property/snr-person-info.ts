import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TypeInformation } from "../general/content-info";

export class DataPerson {
    fid?: number;
    orip?: string;
    fmi?: string;
    anotacion?: number;
    tipoPersona?: string;
    nroDocumento?: string;
    nombreCompleto?: string;
    infoComplementaria?: string;

    constructor(DataPerson?: any) {
        this.fid = DataPerson?.fid ?? 0;
        this.orip = DataPerson?.orip ?? '';
        this.fmi = DataPerson?.fmi ?? '';
        this.anotacion = DataPerson?.anotacion ?? 0;
        this.tipoPersona = DataPerson?.tipoPersona ?? '';
        this.nroDocumento = DataPerson?.nroDocumento ?? '';
        this.nombreCompleto = DataPerson?.nombreCompleto ?? '';
        this.infoComplementaria = DataPerson?.infoComplementaria ?? '';
    }
}

export interface DialogPersonData {
      propertyRegistryOffice: string | null | undefined;
      propertyRegistryNumber: string | null | undefined;
      anotacion: string | null | undefined;
      baunitId: string | null | undefined;
      schema: string;
      executionId: string | null | undefined;
      typeInformation: TypeInformation;
    }
