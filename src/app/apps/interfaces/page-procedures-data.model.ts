export class PageProceduresData {
    page?: number;
    size?: number;
    beginAt?: string;
    beginAtE?: string;
    executionCode?: string;
    individualNumber?: string;

    constructor(page: number, size: number, beginAt: string, beginAtE: string, executionCode: string, individualNumber: string) {
        this.page = page;
        this.size = size;
        this.beginAt = beginAt;
        this.beginAtE = beginAtE;
        this.executionCode = executionCode;
        this.individualNumber = individualNumber;
    }
}
