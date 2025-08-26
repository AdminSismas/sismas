/* eslint-disable @typescript-eslint/no-explicit-any */
export class VistaName {
    [x: string]: any;
    id: number;
    id_modulo: number;
    nombre_vista: string;

    constructor(data: any) {
        this.id = data.id;
        this.id_modulo = data.id_modulo;
        this.nombre_vista = data.nombre_vista;
    }
}
