import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class DataFolio {

    fid?:                    number;
    orip?:                   string;
    fmi?:                    string;
    fechaApertura?:          string;
    estado?:                 string;
    matriculaMatriz?:        string;
    matriculaSegregados?:    string;
    direccion?:              string;
    zona?:                   string;


    constructor(DataFolio?: any) {
        this.fid = DataFolio.fid ?? 0;
        this.orip = DataFolio.orip ?? '';
        this.fmi = DataFolio.fmi ?? '';
        this.fechaApertura = DataFolio.fechaApertura ?? '';
        this.estado = DataFolio.estado ?? '';
        this.matriculaMatriz = DataFolio.matriculaMatriz ?? '';
        this.matriculaSegregados = DataFolio.matriculaSegregados ?? '';
        this.direccion = DataFolio.direccion ?? '';
        this.zona = DataFolio.zona ?? '';
    }
}


@Injectable({
    providedIn: 'root',
})
export class RegisDataPqrsfService {
    private dataSubject = new BehaviorSubject<DataFolio>(new DataFolio({}));
    data$ = this.dataSubject.asObservable();

    constructor() {}

    setData(data: DataFolio) {
    this.dataSubject.next(data);
    }

    getData() {
    return this.dataSubject.value;
    }
}


/* export interface DataFolio {
    fid?:                    number,
    orip?:                   string,
    fmi?:                    string,
    fechaApertura?:          string,
    estado?:                 string,
    matriculaMatriz?:        string,
    matriculaSegregados?:    string,
    direccion?:              string,
    zona?:                   string
} */

