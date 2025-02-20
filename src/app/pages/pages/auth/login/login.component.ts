import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
import { UserService } from './services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import { NavigationLoaderService } from 'src/app/core/navigation/navigation-loader.service';
import { jwtDecode } from 'jwt-decode';
import {
  ENVIRONMENT_RETIRO_IMG,
  NAME_LOGO_IMG_SAN_VICENTE
} from 'src/app/apps/constants/constant';

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
    MatSidenavModule
  ]
})
export class LoginComponent {
  videoPath: string = environment.video;
  logoPath: string = environment.logo;
  logoPathAlter = '';
  form!: FormGroup;
  inputType = 'password';
  visible = false;
  seeLogoRetiro = false;
  idleState = 'NOT_STARTED';
  countdown?: number | null;
  lastPing?: Date | null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    private navigationLoaderService: NavigationLoaderService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.findLogo(this.logoPath);
    
    
  }
  

  send() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.authService.saveToken(response.token);

            const user: DecodeJwt = jwtDecode(response.token);
            this.userService.setUser(user);

            this.navigationLoaderService.loadInformationNavigation(user.role);

            this.userService.getUserInfo(user.sub).subscribe({
              next: (res) => {
                this.userService.setUserData(res);
              },
              error: () => {
                this.snackbar.open(
                  'Credenciales incorrectas. Intenta nuevamente.',
                  'Error',
                  {
                    duration: 5000
                  }
                );
              }
            });

            const redirectRoute =
              user.role === 'GUEST'
                ? environment.myWork_cadastralSearchDa
                : environment.myWork_cadastralSearch;

            this.router.navigate([redirectRoute]).then(() => {
              this.authService.resetIdle();
              this.snackbar.open(
                `Bienvenido, ${user.role === 'GUEST' ? 'invitado' : 'usuario'} ;)`,
                'Gracias',
                {
                  duration: 5000
                }
              );
            });
          } else {
            this.snackbar.open(
              'Credenciales incorrectas. Intenta nuevamente.',
              'Error',
              {
                duration: 5000
              }
            );
          }
        },
        error: () => {
          this.snackbar.open(
            'Credenciales incorrectas. Intenta nuevamente.',
            'Error',
            {
              duration: 5000
            }
          );
        }
      });
    } else {
      this.snackbar.open(
        'Por favor, complete los campos correctamente.',
        'Error',
        {
          duration: 10000
        }
      );
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

  findLogo(logo: string) {
    const lastSegment = this.getLastSegment(logo);
    if (lastSegment === NAME_LOGO_IMG_SAN_VICENTE) {
      this.seeLogoRetiro = true;
      this.logoPathAlter = ENVIRONMENT_RETIRO_IMG;
    } else {
      this.seeLogoRetiro = false;
    }
  }

  getLastSegment(path: string): string {
    return path.substring(path.lastIndexOf('/') + 1);
  }
}
