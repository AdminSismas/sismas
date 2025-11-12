import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorIntlEs extends MatPaginatorIntl {
  itemsPerPageLabel = 'Elementos por página';
  nextPageLabel = 'Página siguiente';
  previousPageLabel = 'Página anterior';
  firstPageLabel = 'Primera página';
  lastPageLabel = 'Última página';

  getRangeLabel = (page: number, pageSize: number, length: number) => 
    `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, length)} de ${length}`;
}