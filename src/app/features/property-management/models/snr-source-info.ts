import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class DataSource {

    fid?: number;
    orip?: string;
    fmi?: string;
    anotacion?: number;
    fecha?: string;
    fuenteAdminTipo?: string;
    fuenteAdminDocNumero?: string;
    fuenteAdminDocFecha?: string;
    enteEmisor?: string;
    oficinaOrigen?: string;
    ciudadOrigen?: string;
    codigoNatuJuridica?: string;
    naturalezaJuridica?: string;
    valorTransaccion?: string;


    constructor(DataSource?: any) {
        this.fid = DataSource.fid ?? 0;
        this.orip = DataSource.orip ?? '';
        this.fmi = DataSource.fmi ?? '';
        this.anotacion = DataSource.anotacion ?? '';
        this.fecha = DataSource.fecha ?? '';
        this.fuenteAdminTipo = DataSource.fuenteAdminTipo ?? '';
        this.fuenteAdminDocNumero = DataSource.fuenteAdminDocNumero ?? '';
        this.fuenteAdminDocFecha = DataSource.fuenteAdminDocFecha ?? '';
        this.enteEmisor = DataSource.enteEmisor ?? '';
        this.oficinaOrigen = DataSource.oficinaOrigen ?? '';
        this.ciudadOrigen = DataSource.ciudadOrigen ?? '';
        this.codigoNatuJuridica = DataSource.codigoNatuJuridica ?? '';
        this.naturalezaJuridica = DataSource.naturalezaJuridica ?? '';
        this.valorTransaccion = DataSource.valorTransaccion ?? '';
    }
}


@Injectable({
    providedIn: 'root',
})
export class RegisDataPqrsfService {
    private dataSubject = new BehaviorSubject<DataSource>(new DataSource({}));
    data$ = this.dataSubject.asObservable();

    constructor() {}

    setData(data: DataSource) {
    this.dataSubject.next(data);
    }

    getData() {
    return this.dataSubject.value;
    }
}

