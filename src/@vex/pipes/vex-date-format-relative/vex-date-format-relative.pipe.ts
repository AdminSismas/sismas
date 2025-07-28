import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'vexDateFormatRelative',
  standalone: true
})
export class VexDateFormatRelativePipe implements PipeTransform {
  transform(value: DateTime | null | undefined | string,): string | null {
    if (!value) {
      return null;
    }

    if (!(value instanceof DateTime)) {
      value = DateTime.fromISO(value);
    }

    return value.toRelative();
  }
}
