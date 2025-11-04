/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pegeable } from '@shared/interfaces';

export class InformationPegeable {
  content: any[];
  pageable?: Pegeable;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  size?: number;
  number?: number;
  sort?: Sort;
  numberOfElements?: number;
  first?: boolean;
  empty?: boolean;


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

interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}
