// Angular framework
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Vex
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralValidationsService } from 'src/app/apps/services/validations/general-validations.service';
// Custom

interface FormErrors {
  required: boolean;
  samePassword: boolean;
  passwordMismatch: boolean;
}

@Component({
  selector: 'vex-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    // Custom
  ],
  templateUrl: './change-password.component.html',
  styles: ``
})
export class ChangePasswordComponent {
  public form: FormGroup = this.fb.group({
    lastPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [
      this.generalValidations.isFieldOneDifferentToFieldTwo('lastPassword', 'newPassword'),
      this.generalValidations.isFieldOneEqualsToFieldTwo('newPassword', 'confirmPassword'),
    ]
  });
  public lastPasswordError = '';
  public newPasswordError = '';
  public confirmPasswordError = '';

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private generalValidations: GeneralValidationsService
  ) { }

  changePassword(): void {
    this.form.markAllAsTouched();
    if (this.form.errors) {
      if (this.form.errors['samePassword']) {
        this.snackbar.open('La nueva contraseña no puede ser la misma que la antigua', 'CLOSE', {
          duration: 3000
        });
        return;
      } else if (this.form.errors['passwordMismatch']) {
        this.snackbar.open('Las nuevas contraseñas no coinciden', 'CLOSE', {
          duration: 3000
        });
        return;
      }
    }
    if (this.form.invalid) {
      this.snackbar.open('Por favor, completa todos los campos', 'CLOSE', {
        duration: 3000
      });
      return;
    }
    console.log('Cambiar contraseña ...')
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }

  invalidInput(control: string): boolean {
    const { invalid, touched, errors } = this.form.controls[control];
    let response: boolean = false;

    if (!invalid || !touched) {
      return response;
    }

    switch (control) {
      case 'lastPassword':
        if (invalid && touched) {
          this.lastPasswordError = errors?.['required']
            ? 'Por favor, introduce tu antigua contraseña'
            : '';
        }
        response = true;
        break;
      case 'newPassword':
        console.log('Validando el nuevo password');
        if (invalid && touched ) {
          this.newPasswordError = errors?.['required']
            ? 'Por favor, introduce tu nueva contraseña'
            : errors?.['isEquals']
            ? 'La nueva contraseña no puede ser la misma que la antigua'
            : '';
        }
        response = true;
        break;
      case 'confirmPassword':
        if (invalid && touched ) {
          this.confirmPasswordError = errors?.['required']
            ? 'Por favor, confirmar la nueva contraseña'
            : errors?.['notEquals']
            ? 'Las nuevas contraseñas no coinciden'
            : '';
        }
        response = true;
        break;
    }

    return response;
  }
}
