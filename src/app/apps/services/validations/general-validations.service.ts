/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GeneralValidationsService {

  isValueField(value: any) {
    return value !== null && value !== undefined && value !== '' && value.length > 0;
  }

  isNotValueFieldZero(value: any) {
    return value !== 0 || value !== '0';
  }

  isFieldOneEqualsToFieldTwo( field1: string, field2: string ) {
    return (formGroup: AbstractControl<any>): ValidationErrors | null => {
      const fieldValue1: string = formGroup.get(field1)?.value || '';
      const fieldValue2: string = formGroup.get(field2)?.value || '';

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEquals: true});
        return {
          notEquals: true
        };
      }

      formGroup.get(field2)?.setErrors(null);

      return null;
    };
  }

  isFieldOneDifferentToFieldTwo( field1: string, field2: string ) {
    return (formGroup: AbstractControl<any>): ValidationErrors | null => {
      const fieldValue1: string = formGroup.get(field1)?.value || '';
      const fieldValue2: string = formGroup.get(field2)?.value || '';

      if (fieldValue1 === fieldValue2) {
        formGroup.get(field2)?.setErrors({ isEquals: true});
        return {
          isEquals: true
        };
      }

      formGroup.get(field2)?.setErrors(null);

      return null;
    };
  }

  maxDateValidator(): ValidatorFn {
    return (control: AbstractControl): Record<string, any> | null => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reinicia la hora a 00:00:00
      
      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);
  
      return inputDate > today ? { 'futureDate': true } : null;
    };
  }

}
