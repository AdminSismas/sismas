import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterValidateService {

 /**
   * Formatea un valor con guiones bajos según la longitud máxima.
   * Si el valor está vacío, lo rellena completamente con guiones bajos.
   * @param value El valor ingresado (puede ser vacío).
   * @param maxLength La longitud máxima permitida.
   * @returns El valor formateado con guiones bajos para completar la longitud.
   */
 formatField(value: string | number | null | undefined, maxLength: number): string {
  const stringValue = value ? String(value).trim() : ''; // Convertir a string si no está vacío
  const remainingLength = maxLength - stringValue.length; // Calcular caracteres faltantes
  console.log('Servicio',value);

  if (remainingLength > 0) {
    // Rellenar con guiones bajos
    return '_'.repeat(remainingLength) + stringValue;
  }

  // Truncar el valor si excede el máximo
  return stringValue.slice(0, maxLength);
}
}
