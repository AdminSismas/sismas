import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralValidationsService {

  constructor() { }



  isValueField(value: any) {
    return value !== null && value !== undefined && value !== '' && value.length > 0;
  }

  isNotValueFieldZero(value: any) {
    return value !== 0 || value !== '0';
  }
}
