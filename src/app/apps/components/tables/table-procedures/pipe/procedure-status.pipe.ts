import { Pipe, type PipeTransform } from '@angular/core';
import { Status } from 'src/app/apps/interfaces/general/content-info-procedures.model';

@Pipe({
  name: 'procedureStatus',
  standalone: true,
})
export class ProcedureStatusPipe implements PipeTransform {

  transform(value: Status): string {
    switch (value) {
      case 'COMPLETED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'ACTIVE':
        return 'Activo';
      default:
        return value;
    }
  }

}
