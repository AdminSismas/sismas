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

  validateCapitalLettersOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let value = this.patternValidator(control, '^[A-Z]+$');
      return value != null && value ? { capitalLetter: true } : null
    };
  }

  validateArea(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let value = this.patternValidator(control, '^[0-9]+([.,][0-9]+)?$');
      return value != null && value ? { errorArea: true } : null
    };
  }

  validateOnlyNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let value = this.patternValidator(control, '^[0-9]+([.,][0-9]+)?$');
      return value != null && value ? { onlyNumber: true } : null
    };
  }

  validateNumberMax99(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let value = this.patternValidator(control, '^(?:[1-9]|[1-9][0-9])$');
      return value != null && value ? { max99: true } : null
    };
  }

  validateYearBetween1900And2099(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let value = this.patternValidator(control, '^(19|20)\\d{2}$');
      return value != null && value ? { yearBetween1900And2099: true } : null;
    };
  }

  patternValidator(control: AbstractControl, pattern :string) {
    if (!pattern || this.isEmptyInputValue(control.value)) {
      return null;
    }

    let regex:RegExp | null = null;
    let regexStr:string;
    if (!this.isEmptyInputValue(pattern)) {
      regexStr = '';
      if (pattern.charAt(0) !== '^')
        regexStr += '^';
      regexStr += pattern;
      if (pattern.charAt(pattern.length - 1) !== '$')
        regexStr += '$';
      regex = new RegExp(regexStr);
    }
    const value = control.value;
    return !regex || regex.test(value) ? null : true;
  }

  nonZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseFloat(control.value);
      if (value <= 0) {
        return { nonZero: true }; // Devuelve un error si el valor es 0 o menor
      }
      return null; // Sin errores
    };
  }

  min03Characters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      return this.isValueField(value) && value.length <= 10 ? { min03Characters: true } : null
    };
  }

  min10Characters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      return this.isValueField(value) && value.length <= 10 ? { min10Characters: true } : null
    };
  }

  privateAreaValidator(totalAreaControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent; // Obtén el grupo del formulario
      if (!formGroup) {
        return null; // Espera hasta que haya un formulario padre
      }
      const totalAreaControl = formGroup.get(totalAreaControlName);
      if (!totalAreaControl) {
        return null; // Asegúrate de que el control exista
      }
      const totalArea = parseFloat(totalAreaControl.value);
      const privateArea = parseFloat(control.value);
      if (privateArea > totalArea) {
        return { privateAreaExceedsTotal: true }; // Devuelve un error si el área privada es mayor
      }
      return null; // Sin errores
    };
  }

  onlyTextAndNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = this.patternValidator(control, '[a-zA-Z0-9]*');
      return value != null && value ? { onlyTextOrNumber: true } : null
    };
  }

  onlyTextAndNumber1(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let regex = /^(?![^a-zA-Z0-9\u0B80-\u0BFF]).*$/;
      return regex.test(control.value) ? null : { onlyTextOrNumber1: true };
    };
  }

  onlyTextAndNumberGuionCommand(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let regex = /^[a-zA-Z0-9\s.,-]*$/;
      return regex.test(control.value) ? null : { onlyTextAndNumberGuionCommand: true };
    };
  }

  onlyNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let regex = /^\d+$/;
      return regex.test(control.value) ? null : { onlyNumber: true };
    };
  }

  onlyLetters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || !control.value) {
        return null;
      }
      let regex = /^[a-zA-Z]+$/;
      return regex.test(control.value) ? null : { onlyLetters: true };
    };
  }

  isEmptyInputValue(value:any) {
    return value == null ||
      ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
  }

  yearNotInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentYear = new Date().getFullYear();
      const enteredYear = parseInt(control.value, 10);
      if (enteredYear > currentYear) {
        return { yearInFuture: true };
      }
      return null;
    };
  }

}
