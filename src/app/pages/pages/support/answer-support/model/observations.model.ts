/* eslint-disable @typescript-eslint/no-explicit-any */
export class ObservationsData {
    [x: string]: any;
    id: number;
    observacion: string;
    fecha_hora: string;

    constructor(data: any) {
        this.id = data.id;
        this.observacion = data.observacion;
        this.fecha_hora = data.fecha_hora;
    }
}
