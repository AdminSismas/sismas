import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'citationNoticeType',
  standalone: true
})
export class CitationNoticeTypePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Sin estado';

    if (value === 'Citacion')
      return 'Citación';
    return value;
  }
}
