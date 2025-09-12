/* eslint-disable @typescript-eslint/no-explicit-any */
export class ModuloName {
    [x: string]: any;
    id: number;
    modulo: string;

    constructor(data: any) {
        this.id = data.id;
        this.modulo = data.modulo;
    }
}
