import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
} from 'src/app/apps/constants/general/constants';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  host: {
    '(document:keyup.enter)': 'send()'
  },
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
    ReactiveFormsModule,
    RouterLink
  ]
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('bgVideo') bgVideoRef!: ElementRef<HTMLVideoElement>;
  videoPlayed = false;
  videoPath: string = environment.video;
  videoPathWebm: string = environment.videoWebm;
  logoPath: string = environment.logo;
  logoPathAlter = '';
  form!: FormGroup;
  inputType = 'password';
  visible = false;
  seeLogoRetiro = false;
  idleState = 'NOT_STARTED';
  countdown?: number | null;
  lastPing?: Date | null;
  loading = signal<boolean>(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService,
    private navigationLoaderService: NavigationLoaderService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.findLogo(this.logoPath);

    navigationLoaderService.stopCountLoop();
  }

  send() {
    if (this.form.valid) {
      const { email, password } = this.form.value;

      this.loading.set(true);
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.authService.saveToken(response.token);

            const user: DecodeJwt = jwtDecode(response.token);
            this.userService.setUser(user);
            this.loading.set(false);

            this.navigationLoaderService.refreshNavigation();

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
              }).then();
            });
          } else {
            this.alertCredentialIncorrect();
          }
        },
        error: () => {
          this.loading.set(false);
          console.log(this.loading);
          this.alertCredentialIncorrect();
        }
      });
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, complete los campos correctamente.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000
      }).then();
    }
  }

  alertCredentialIncorrect() {
    Swal.fire({
      title: '¡Error!',
      text: 'Credenciales incorrectas. Intenta nuevamente.',
      icon: 'error',
      showConfirmButton: false,
      timer: 5000
    }).then();
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
  ngAfterViewInit(): void {
    const video = this.bgVideoRef?.nativeElement;

    if (video && !this.videoPlayed) {
      video.muted = true; // MUY IMPORTANTE
      video.autoplay = true; // opcional
      video.playsInline = true; // especialmente útil en móviles

      video
        .play()
        .then(() => {
          this.videoPlayed = true;
          console.log('🎥 Video reproducido automáticamente');
        })
        .catch((err) => {
          console.warn('⚠️ No se pudo reproducir automáticamente:', err);
        });
    }
  }

  onVideoLoaded() {
    this.forceVideoPlay();
  }

  private forceVideoPlay() {
    if (this.videoPlayed) return;

    const videoEl = this.bgVideoRef?.nativeElement;

    if (videoEl) {
      this.videoPlayed = true; // Marcar como reproducido una sola vez
      videoEl.play().catch((err) => {
        console.warn('Autoplay bloqueado por el navegador:', err);
      });
    }
  }
}
