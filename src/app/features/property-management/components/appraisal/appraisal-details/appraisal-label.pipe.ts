import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appraisalLabel',
  standalone: true
})
export class AppraisalLabelPipe implements PipeTransform {
  private readonly labels = {
    cadastralValuation: 'Valor',
    cadastralValuationAt: 'Fecha de Avalúo Catastral',
    cadastralValuationLand: 'Valor de Terreno',
    cadastralValuationUnits: 'Valor de Unidades',
    cadValLandCommon: 'Valor Terreno Común',
    cadValLandPrivate: 'Valor Terreno Privado',
    cadValUnitbuiltCommon: 'Valor Unidades Construidas Comunes',
    cadValUnitbuiltPrivate: 'Valor Unidades Construidas Privadas',
    commercialValuation: 'Valor',
    commercialValuationLand: 'Valor de Terreno',
    commercialValuationUnits: 'Valor de Unidades',
    createdAt: 'Fecha de Creación',
    createdBy: 'Creado Por',
    hash: 'Hash',
    selfValuationIs: '¿Es Autoavalúo?',
    selfValuationValue: 'Valor',
    selfValuationValueLand: 'Valor Terreno',
    selfValuationValueUnits: 'Valor Unidades',
    updatedAt: 'Fecha de Actualización',
    updatedBy: 'Actualizado Por',
    validityValuation: 'Vigencia',
    valuationId: 'ID de Avalúo'
  };

  transform(value: string): string {
    return this.labels[value as keyof typeof this.labels] ?? value;
  }
}
