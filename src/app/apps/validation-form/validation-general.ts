import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxLengthValidator(maxLength: number): ValidatorFn {
    console.log(maxLength, 'valores validator');
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value.length > maxLength) {
      return { 'maxLengthExceeded': true };
    }
    console.log(maxLength, control.value, 'valores validator');
    return null;

  };
}
