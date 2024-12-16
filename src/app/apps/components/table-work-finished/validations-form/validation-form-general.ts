import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para comparar dos fechas
export function dateComparisonValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as any;  // Asegurándonos de que control sea un FormGroup
    const startDate = formGroup.get(startDateControlName)?.value;
    const endDate = formGroup.get(endDateControlName)?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateComparison: 'End date must be greater than or equal to start date.' };
    }
    return null;  // Retorna null si la validación pasa (es decir, no hay error)
  };
}
