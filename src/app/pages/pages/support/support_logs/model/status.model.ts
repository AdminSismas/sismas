export class StatusData {
    [x: string]: any;
    id: number;
    status: string;

    constructor(data: any) {
        this.id = data.id;
        this.status = data.status;
    }
}