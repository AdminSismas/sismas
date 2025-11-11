export class Pegeable {
  pageNumber: number | undefined;
  pageSize: number | undefined;
  offset: number | undefined;
  paged: boolean | undefined;
  unpaged: boolean | undefined;


  constructor(pageNumber?: number, pageSize?: number, offset?: number,
              paged?: boolean, unpaged?: boolean) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.offset = offset;
    this.paged = paged;
    this.unpaged = unpaged;
  }
}
