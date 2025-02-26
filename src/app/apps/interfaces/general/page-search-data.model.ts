export class PageSearchData {
  page?: number;
  size?: number;
  searchData: any;


  constructor(page: number, size: number, searchData: any) {
    this.page = page;
    this.size = size;
    this.searchData = searchData;
  }
}
