import { Component, OnInit, signal } from '@angular/core';
import {
  InConstructionComponent
} from '../../../../../apps/components/general-components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { map } from 'rxjs/operators';
import { CONSTANT_LOGIN_SUBMIT, CONSTANT_NAME_ID } from '../../../../../apps/constants/general/constantLabels';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { NgStyle } from '@angular/common';
import { InputComponent } from '../../../../../apps/components/general-components/input/input.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { environment as envi } from '../../../../../../environments/environments';

@Component({
  selector: 'vex-validate-certificates',
  standalone: true,
  animations: [fadeInUp400ms],
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    NgStyle,
    InputComponent,
    ReactiveFormsModule,
    NgxCaptchaModule
  ],
  templateUrl: './validate-certificates.component.html',
  styleUrl: './validate-certificates.component.scss'
})
export class ValidateCertificatesComponent implements OnInit {

  recaptchaSiteKey = `${envi.contentRecaptcha.siteKeyWeb}`;
  loading = signal(false);

  numberPin$ = this.route.params.pipe(
    map((params) => params[CONSTANT_NAME_ID])
  );

  form: FormGroup = this.fb.group({
    numberPin: ['', [Validators.required]],
    recaptcha: ['', Validators.required]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {

  }

  get controlNumberPin() {
    return this.form.get('numberPin') as FormControl;
  }

  protected readonly CONSTANT_LOGIN_SUBMIT = CONSTANT_LOGIN_SUBMIT;
}
