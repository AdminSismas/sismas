import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: any, currencyCode = 'COP'): string {
    if (value == null) {
      return '';
    }

    // Convertir el valor a número si es una cadena
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;

    // Formatear el valor con puntos como separadores de miles y sin decimales
    const formattedValue = numericValue.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    // Agregar el símbolo de la moneda
    let currencySymbol = '';
    switch (currencyCode) {
      case 'COP':
        currencySymbol = '$';
        break;
      // Agrega más casos para otras monedas si es necesario
      default:
        currencySymbol = '$';
    }

    return `${currencySymbol}${formattedValue}`;
  }
}