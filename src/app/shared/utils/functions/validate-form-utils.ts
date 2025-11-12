import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

// Validador personalizado para comparar dos fechas
export function dateComparisonValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control;
    const startDate = formGroup.get(startDateControlName)?.value;
    const endDate = formGroup.get(endDateControlName)?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateComparison: 'End date must be greater than or equal to start date.' };
    }
    return null;  // Retorna null si la validación pasa (es decir, no hay error)
  };
}


export function asyncValidation(control: AbstractControl): Observable<ValidationErrors | null> {
  return new Observable((observer) => {
    setTimeout(() => {
      if (control.value !== '' && control.value !== 0 && control.value !== null) {
        observer.next({ existe: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 400);
  });
}
