import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { environment } from '../../../../../environments/environments';
import { AuthService } from './services/auth.service';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule,
    MatSidenavModule,
    RouterOutlet
  ]
})
export class LoginComponent {
  form!: FormGroup;
  inputType = 'password';
  visible = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService  
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  send() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      this.authService.login(email, password).subscribe(
        (response: any) => {
          if (response && response.token) {
            this.authService.saveToken(response.token);

            // Decodificar el token y obtener los datos del usuario
            this.authService.getUserData()?.subscribe(
              (userData) => {
                const user = new UserDetails(userData);
                this.userService.setUser(user);  // Guardamos el usuario en el servicio

                this.router.navigate([`${environment.myWork_cadastralSearch}`])
                  .then(() => {
                    this.snackbar.open('Bienvenido usuario ;)', 'Gracias', {
                      duration: 5000
                    });
                  });
              },
              (error) => {
                this.snackbar.open('Error al obtener los datos del usuario.', 'Error', {
                  duration: 5000
                });
              }
            );
          } else {
            this.snackbar.open('Credenciales incorrectas. Intenta nuevamente.', 'Error', {
              duration: 5000
            });
          }
        },
        (error) => {
          this.snackbar.open('Credenciales incorrectas. Intenta nuevamente.', 'Error', {
            duration: 5000
          });
        }
      );
    } else {
      this.snackbar.open('Por favor, complete los campos correctamente.', 'Error', {
        duration: 3000
      });
    }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
