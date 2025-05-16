import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { environment as envi, environment } from '../../../../../environments/environments';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import { NavigationLoaderService } from 'src/app/core/navigation/navigation-loader.service';
import { jwtDecode } from 'jwt-decode';
import { ENVIRONMENT_RETIRO_IMG, NAME_LOGO_IMG_SAN_VICENTE } from 'src/app/apps/constants/general/constants';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CONSTANT_LOGIN_ERROR_USER,
  CONSTANT_LOGIN_FORGET_PASSPORT,
  CONSTANT_LOGIN_INIT_SESSION,
  CONSTANT_LOGIN_NOT_SUPPORT_VIDEO,
  CONSTANT_LOGIN_PASSWORD,
  CONSTANT_LOGIN_SUBMIT,
  CONSTANT_LOGIN_USER,
  CONSTANT_LOGIN_WELCOME
} from '../../../../apps/constants/general/constantLabels';
import { NgxCaptchaModule } from 'ngx-captcha';
import { InputComponent } from '../../../../apps/components/general-components/input/input.component';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    NgIf,
    NgxCaptchaModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
    InputComponent
  ]
})
export class LoginComponent {
  videoPath: string = environment.video;
  logoPath: string = environment.logo;
  logoLoginPath: string = environment.logo_login;
  logoPathAlter = '';
  inputType = 'password';
  visible = false;
  seeLogoRetiro = false;
  recaptchaSiteKey = `${envi.contentRecaptcha.siteKeyWeb}`;
  recaptchaAction = `${envi.contentRecaptcha.userActionLogin}`;
  loading = signal(false);

  form:FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
    recaptcha: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService,
    private navigationLoaderService: NavigationLoaderService,
  ) {

    this.findLogo(this.logoPath);
    navigationLoaderService.stopCountLoop();
  }


  send() {
    if (!this.form.valid) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, complete los campos correctamente.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then(() => this.loading.set(false));
      return;
    }
    const { recaptcha } = this.form.value;
    this.loading.set(true);
    this.validateReCaptcha(recaptcha);
  }

  validateReCaptcha(recaptcha: string) {
    this.authService.validateRecaptchaLogin(recaptcha).subscribe({
      next: (res: boolean) => this.executeLogin(res),
      error: (err: any) => this.alertCredentialIncorrect(err)
    });
  }

  executeLogin(res: boolean) {
    if (!this.form.valid || !res) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, complete los campos correctamente.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then(() => this.loading.set(false));
      return;
    }
    const { email, password } = this.form.value;
    this.loading.set(true);
    this.authService.login(email, password).subscribe({
      next: (response) => {

        if (response && response.token) {
          this.authService.saveToken(response.token);

          const user: DecodeJwt = jwtDecode(response.token);
          this.userService.setUser(user);
          this.loading.set(false);

          this.navigationLoaderService.loadInformationNavigation(user.role);

          this.userService.getUserInfo(user.sub).subscribe({
            next: (res) => this.userService.setUserData(res),
            error: () => this.alertCredentialIncorrect()
          });

          const redirectRoute =
            user.role === 'GUEST'
              ? environment.myWork_cadastralSearchDa
              : environment.myWork_cadastralSearch;

          this.router.navigate([redirectRoute]).then(() => {
            this.authService.resetIdle();
            Swal.fire({
              position: 'center',
              text: `Bienvenido, ${email}`,
              icon: 'success',
              showConfirmButton: false,
              timer: 3000
            }).then(() => this.loading.set(false));
          });
        } else {
          this.alertCredentialIncorrect();
        }
      },
      error: () => this.alertCredentialIncorrect()
    });
  }

  alertCredentialIncorrect(err: any = null) {
    let msgError: string = 'Credenciales incorrectas. Intenta nuevamente.';
    if (err) {
      msgError += ' ' + err;
    }
    Swal.fire({
      title: '¡Error!',
      text: msgError,
      icon: 'error',
      showConfirmButton: false,
      timer: 5000
    }).then(() => this.loading.set(false));
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



  protected readonly CONSTANT_LOGIN_WELCOME = CONSTANT_LOGIN_WELCOME;
  protected readonly CONSTANT_LOGIN_INIT_SESSION = CONSTANT_LOGIN_INIT_SESSION;
  protected readonly CONSTANT_LOGIN_NOT_SUPPORT_VIDEO = CONSTANT_LOGIN_NOT_SUPPORT_VIDEO;
  protected readonly CONSTANT_LOGIN_PASSWORD = CONSTANT_LOGIN_PASSWORD;
  protected readonly CONSTANT_LOGIN_USER = CONSTANT_LOGIN_USER;
  protected readonly CONSTANT_LOGIN_ERROR_USER = CONSTANT_LOGIN_ERROR_USER;
  protected readonly CONSTANT_LOGIN_FORGET_PASSPORT = CONSTANT_LOGIN_FORGET_PASSPORT;
  protected readonly CONSTANT_LOGIN_SUBMIT = CONSTANT_LOGIN_SUBMIT;
}
