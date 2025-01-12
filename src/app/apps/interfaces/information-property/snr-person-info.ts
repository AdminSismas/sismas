import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

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

@Injectable({
    providedIn: 'root',
})
export class RegisDataPqrsfService {
    private dataSubject = new BehaviorSubject<DataPerson>(new DataPerson({}));
    data$ = this.dataSubject.asObservable();

    constructor() {}

    setData(data: DataPerson) {
        this.dataSubject.next(data);
    }

    getData() {
        return this.dataSubject.value;
    }
}
