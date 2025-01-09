import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatService } from '../services/date-format.service';


@Pipe({
  name: 'customDate',
  standalone: true 
})
export class CustomDatePipe implements PipeTransform {
  constructor(private dateFormatService: DateFormatService) {}

  transform(value: Date | string, format = 'dd/MM/yyyy'): string {
    return this.dateFormatService.format(value, format);
  }
}