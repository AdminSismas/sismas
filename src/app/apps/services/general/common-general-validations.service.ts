import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SendGeneralRequestsService } from '@shared/services';

@Injectable({
  providedIn: 'root'
})
export class CommonGeneralValidationsService {

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) {}

  // Convertir valores numéricos
  parseNumericValue(value: string): number | null {
    return value ? parseFloat(value.toString().replace(',', '.')) : null;
  }

}
