import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  constructor(private datePipe: DatePipe) {}

  format(date: Date | string, format: string = 'dd/MM/yyyy'): string {
    return this.datePipe.transform(date, format) || '';
  }
}
