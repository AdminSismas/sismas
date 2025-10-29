import { Injectable, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  private readonly datePipe = inject(DatePipe);

  format(date: Date | string, format = 'dd/MM/yyyy'): string {
    return this.datePipe.transform(date, format) || '';
  }
}
