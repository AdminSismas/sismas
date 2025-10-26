import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CommonGeneralValidationsService {

  constructor(
    private http: HttpClient
  ) {}

  // Convertir valores numéricos
  parseNumericValue(value: string): number | null {
    return value ? parseFloat(value.toString().replace(',', '.')) : null;
  }

}
