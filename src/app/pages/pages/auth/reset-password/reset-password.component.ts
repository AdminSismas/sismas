import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { catchError, map } from 'rxjs';
import { ResetPasswordService } from './services/reset-password.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-reset-password',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  styleUrl: './reset-password.component.scss',
  templateUrl: './reset-password.component.html',
  animations: [fadeInUp400ms, stagger40ms]
})
export default class ResetPasswordComponent {
  // Injects
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private resetPasswordService = inject(ResetPasswordService);

  // Signals
  inputTypePassword = signal<'password' | 'text'>('password');
  inputTypeConfirmPassword = signal<'password' | 'text'>('password');
  form = signal<FormGroup>(this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirm: ['', [Validators.required]]
    },
    {
      validators: this.passwordMatchValidator
    }
  ));

  // toSignals
  token = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        return params.get('token');
      })
    )
  );

  constructor() {
    effect(() => {
      if (!this.token()) {
        this.router.navigate([
          `${environment.auth.value}${environment.auth.login}`
        ]);
      }
    });

    
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirm')?.value;

    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  send() {
    if (this.form().invalid || !this.token()) {
      return;
    }
    // TODO: Implement password change logic here
    const token = this.token();
    const newPassword = this.form().controls['password'].value;
    this.resetPasswordService
      .changePassword(token!, newPassword)
      .pipe(
        catchError(() => {
          Swal.fire({
            icon: 'error',
            text: 'Ha ocurrido un error al actualizar la contraseña',
            showConfirmButton: false,
            timer: 10000
          });

          throw new Error('Error al cambiar la contraseña');
        })
      )
      .subscribe((response) => {
        Swal.fire({
          icon: 'success',
          text: response,
          showConfirmButton: false,
          timer: 10000
        });
        this.router.navigate([
          `${environment.auth.value}${environment.auth.login}`
        ]);
      });
  }

  back() {
    this.router.navigate([
      `${environment.auth.value}${environment.auth.login}`
    ]);
  }

  toggleVisibility(input: 'password' | 'confirmPassword') {
    if (input === 'password') {
      this.inputTypePassword.update((type) => {
        if (type === 'password') return 'text';
        return 'password';
      });
      return;
    }
    this.inputTypeConfirmPassword.update((type) => {
      if (type === 'password') return 'text';
      return 'password';
    });
    return;
  }
}
