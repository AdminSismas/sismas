import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../../../../../environments/environments';
import Swal from 'sweetalert2';
import { ForgotPasswordService } from './services/forgot-password.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInUp400ms],
  standalone: true,
  host: {
    '(document:keyup.enter)': 'send()'
  },
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ForgotPasswordComponent {
  // Injects
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private forgotPasswordService = inject(ForgotPasswordService);

  // Signals
  errorMessage = signal('');

  form = this.fb.group({
    email: [
      null,
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]
    ]
  });

  back() {
    this.router
      .navigate([`${environment.auth.value}${environment.auth.login}`])
      .then();
  }

  send() {
    if (this.form.invalid) {
      this.formErrorsManager();
      return;
    }

    const email = this.form.controls['email'].value!;
    this.forgotPasswordService
      .sendEmail(email)
      .pipe(
        catchError(() => {
          const message = `No se ha encontrado un usuario asociado al correo ${email}`;
          this.notificationWindows(message, 'error');

          throw new Error('Error al recuperar contraseña');
        })
      )
      .subscribe(() => {
        const message = `Se ha enviado un correo a ${email}`;
        this.notificationWindows(message, 'success');
      });
  }

  notificationWindows(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question'
  ) {
    Swal.fire({
      icon: icon,
      text: message,
      showConfirmButton: false,
      timer: 10000
    });
  }

  formErrorsManager() {
    const error = this.form.controls['email']!.errors!;

    if (error['required']) {
      this.errorMessage.set(
        'No podemos recuperar tu contraseña sin tu correo electrónico.'
      );
      const message = 'Debes escribir un correo electrónico.';
      this.notificationWindows(message, 'error');
      return;
    }

    if (error['pattern']) {
      this.errorMessage.set(
        'El correo electrónico debe tener un formato usuario@mail.com'
      );
      const message = 'El correo electrónico no es válido.';
      this.notificationWindows(message, 'error');
      return;
    }
  }
}
