import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyLands',
  standalone: true
})
export class CurrencyLandsPipe implements PipeTransform {

  transform(value: any): string {
    if (value == null || value === '') {
      return '';
    }

    // Verificar si contiene "Mts²" o "Mts2"
    const hasMts2 = typeof value === 'string' && /Mts(2|²)/i.test(value);

    // Procesar el valor para normalizarlo
    let numericValue = value;
    if (typeof value === 'string') {
      // Eliminar texto no numérico excepto comas, puntos, y signos
      const cleanedValue = value.replace(/[^0-9.,-]+/g, '');
      numericValue = parseFloat(cleanedValue.replace(',', '.')); // Convertir coma a punto para parsear
    }

    // Si no es un número válido, devolver el valor original
    if (isNaN(numericValue)) {
      return value; // Devuelve el valor original
    }

    // Identificar si tiene decimales o es un número entero
    const isDecimal = numericValue % 1 !== 0;
    let formattedValue = '';

    if (isDecimal) {
      // Si tiene decimales, asegurarse de usar coma para decimales y punto para miles
      formattedValue = numericValue.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      // Si es entero, formatear con puntos para miles y sin decimales
      formattedValue = numericValue.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }

    // Agregar "Mts²" al final si no lo contiene
    return hasMts2 ? value : `${formattedValue} Mts2`;
  }
}

