// Angular framework
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
import { UserDetails } from '@features/configuration/interfaces/users/user-details.model';
import { PasswordService } from 'src/app/layouts/services/change-password/password.service';
// Custom
import { GeneralValidationsService } from '@shared/services/general/validations/general-validations.service';
import { UserService } from '@shared/services/auth/user.service';

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
export class ChangePasswordComponent implements OnInit {
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
  public fullName = '';
  public hideLastPassword = true;
  public hideNewPassword = true;
  public hideConfirmPassword = true;

  private user!: UserDetails;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private generalValidations: GeneralValidationsService,
    private userService: UserService,
    private passwordService: PasswordService
  ) { }

  ngOnInit(): void {
    const user = this.userService.getUser();
    this.userService.getUserInfo(user?.sub as string).subscribe({
      next: (res) => {
        this.user = res;
        this.fullName = res.individual.fullName;
      }
    });
  }

  changePassword(): void {
    this.form.markAllAsTouched();
    if (!this.validForm()) return;
    this.dialogRef.close();
    this.changePasswordService();
  }

  validForm(): boolean {
    if (this.form.errors) {
      if (this.form.errors['samePassword']) {
        this.snackbar.open('La nueva contraseña no puede ser la misma que la antigua', 'CERRAR', {
          duration: 10000
        });
        return false;
      } else if (this.form.errors['passwordMismatch']) {
        this.snackbar.open('Las nuevas contraseñas no coinciden', 'CERRAR', {
          duration: 10000
        });
        return false;
      }
    }
    if (this.form.invalid) {
      this.snackbar.open('Por favor, completa todos los campos', 'CERRAR', {
        duration: 10000
      });
      return false;
    }

    return true;
  }

  invalidInput(control: string): boolean {
    const { invalid, touched, errors } = this.form.controls[control];
    let response = false;

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

  changePasswordService(): void {
    const username = this.user.userId;
    const lastPassword = this.form.get('lastPassword')?.value;
    const newPassword = this.form.get('newPassword')?.value;

    this.passwordService.changePassword(username, lastPassword, newPassword).subscribe({
      next: () => {
        this.snackbar.open('Contraseña cambiada correctamente', 'CERRAR', {
          duration: 10000
        });
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.open('Error al cambiar la contraseña', 'CERRAR', {
          duration: 10000
        });
        throw err;
      }
    });
  }
}
