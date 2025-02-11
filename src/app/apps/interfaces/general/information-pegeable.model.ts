import { Pegeable } from './pegeable.model';

export class InformationPegeable {
  totalPages: number | undefined;
  totalElements: number | undefined;
  last: boolean | undefined;
  size: number | undefined;
  numberOfElements: number | undefined;
  first: boolean | undefined;
  empty: boolean | undefined;
  content: any[];
  pageable: Pegeable | undefined;

  constructor(totalPages?: number, totalElements?: number, last?: boolean,
              size?: number, numberOfElements?: number, first?: boolean,
              empty?: boolean, content: any[] = [], pageable?:Pegeable) {
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.last = last;
    this.size = size;
    this.numberOfElements = numberOfElements;
    this.first = first;
    this.empty = empty;
    this.content = content;
    this.pageable = pageable;
  }


}
