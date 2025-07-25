export class SupportLogs {
    [x: string]: any;
    id: number;
    id_soporte: number;
    id_status: number;
    id_empleado: number;
    respuesta: string;
    fecha_hora: string;
    
    constructor(data: any) {
        this.id = data.id;
        this.id_soporte = data.id_soporte;
        this.id_status = data.id_status;
        this.id_empleado = data.id_empleado;
        this.respuesta = data.respuesta;
        this.fecha_hora = data.fecha_hora;
    }
}