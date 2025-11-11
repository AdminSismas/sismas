import { Pipe, type PipeTransform } from '@angular/core';
import { Status } from '@features/bpm-workflows/models/procedures/content-info-procedures.model';

@Pipe({
  name: 'procedureStatus',
  standalone: true,
})
export class ProcedureStatusPipe implements PipeTransform {

  transform(value: Status): string {
    switch (value) {
      case 'COMPLETED':
        return 'Finalizado';
      case 'CANCELLED':
        return 'Anulado';
      case 'ACTIVE':
        return 'Activo';
      default:
        return value;
    }
  }

}
