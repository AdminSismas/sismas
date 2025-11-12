import { Pipe, type PipeTransform } from '@angular/core';

const municipalities = [
  { code: '001', name: 'Manizales' },
  { code: '674', name: 'San Vicente' },
  { code: '607', name: 'El Retiro' },
];

@Pipe({
  name: 'muncipalityCode',
  standalone: true,
})
export class MuncipalityCodePipe implements PipeTransform {

  transform(value: string): string {
    const municipality = municipalities.find(m => m.code === value);
    return municipality ? municipality.name : 'No se encuentra municipio';
  }

}
