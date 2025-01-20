import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyLands',
  standalone: true
})
export class CurrencyLandsPipe implements PipeTransform {

  transform(value: any): string {
    if (value == null) {
      return '';
    }

    // Verificar si el valor ya contiene "Mts²"
    const hasMts2 = typeof value === 'string' && value.includes('Mts²');

    // Convertir el valor a número si es una cadena y no contiene "Mts²"
    let numericValue = hasMts2 ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : 
                      typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;

    // Formatear el valor con puntos como separadores de miles y comas como separadores decimales
    const formattedValue = numericValue.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Agregar "Mts²" al final del valor formateado si no lo contiene
    return hasMts2 ? `${formattedValue} Mts²` : `${formattedValue} Mts²`;
  }

}
