export class PageSortByData {
    page?: number;
    size?: number;
    sortBy?: string;


    constructor(page: number, size: number, sortBy: string) {
        this.page = page;
        this.size = size;
        this.sortBy = sortBy;
    }
}
