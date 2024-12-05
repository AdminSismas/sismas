import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxLengthValidator(maxLength: number): ValidatorFn {
    console.log(maxLength, 'valores valdiator')
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length > maxLength) {
      return { 'maxLengthExceeded': true };
    }
    console.log(maxLength, control.value, 'valores valdiator')
    return null;

  };
}