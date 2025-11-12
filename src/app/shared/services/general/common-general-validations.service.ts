import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonGeneralValidationsService {

  // Convertir valores numéricos
  parseNumericValue(value: string): number | null {
    return value ? parseFloat(value.toString().replace(',', '.')) : null;
  }

}
