import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  constructor(private datePipe: DatePipe) {}

  format(date: Date | string, format = 'dd/MM/yyyy'): string {
    return this.datePipe.transform(date, format) || '';
  }
}
