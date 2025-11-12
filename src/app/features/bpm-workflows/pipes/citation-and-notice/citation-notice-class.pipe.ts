import { Pipe, type PipeTransform } from '@angular/core';
import {
  CONSTANTE_CITATION,
  CONSTANTE_CITED,
  CONSTANTE_NOTIFIED,
  LIST_NOTICE_NOTIFICATIONS
} from '@shared/constants/constants';

@Pipe({
  name: 'citationNoticeClass',
  standalone: true
})
export class CitationNoticeClassPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case CONSTANTE_CITATION:
        return 'text-primary-600 bg-primary-600/10';
      case CONSTANTE_CITED:
        return 'text-green-600 bg-green-600/10';
      case CONSTANTE_NOTIFIED:
        return 'text-gray-600 bg-gray-600/10';
      default:
        if (LIST_NOTICE_NOTIFICATIONS.includes(value)) {
          return 'text-amber-600 bg-amber-600/10';
        }
        return 'text-secondary-600 bg-secondary-600/10';
    }
  }
}
