// Angular framework
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
// Custom


@Component({
  selector: 'vex-change-password',
  standalone: true,
  imports: [
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
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) {}

  changePassword(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
    const { invalid, touched } = this.form.controls[control];
    return invalid && touched;
  }
}
