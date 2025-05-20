import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputType } from '../../../interfaces/general/content-info';
import { getRandomInt } from 'src/app/apps/utils/general';
import {
  CONSTANT_ERR_CAPITAL_LETTER,
  CONSTANT_ERR_INVALID_AREA,
  CONSTANT_ERR_INVALID_NUMBER,
  CONSTANT_ERR_INVALID_YEAR,
  CONSTANT_ERR_MIN03_CHARACTERS,
  CONSTANT_ERR_MIN10_CHARACTERS, CONSTANT_ERR_ONLY_INVALID_EMAIL,
  CONSTANT_ERR_ONLY_INVALID_LETTER,
  CONSTANT_ERR_ONLY_INVALID_NUMBER,
  CONSTANT_ERR_ONLY_ONE_99,
  CONSTANT_ERR_ONLY_TEXT_NUMBER
} from '../../../constants/general/constantsAlertLabel';

@Component({
  selector: 'vex-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    NgClass
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class InputComponent implements OnInit {

  @Input() public idComboInput = '';
  @Input() public cssClasses?: string;
  @Input() public label!: string | null;
  @Input() public formControlNameInput = '';
  @Input() public formControlInput:FormControl | null = null;
  @Input() public icon!: string | null;
  @Input() type: InputType = 'text';
  @Input() public hintValue!: string | null;
  @Input() public hideRequiredMarker = true;

  constructor() { }

  ngOnInit(): void {
    if (this.idComboInput?.length>0) {
      this.idComboInput = this.idComboInput + getRandomInt(10000) + this.formControlNameInput;
    } else {
      this.idComboInput = getRandomInt(10000) + this.formControlNameInput;
    }
  }

  checkIsInValid(formControl: AbstractControl | null): boolean {
    return !(
      formControl && formControl.hasOwnProperty('status') && formControl.status === 'VALID' &&
      formControl.errors === null
    );
  }

  checkForErrorsIn(formControl: AbstractControl): string {
    if (formControl.hasError('required')) {
      return 'Campo requerido'
    }

    if (formControl.errors?.hasOwnProperty('capitalLetter') && formControl.errors?.['capitalLetter'] === true) {
      return CONSTANT_ERR_CAPITAL_LETTER;
    }

    if (formControl.errors?.hasOwnProperty('onlyNumber') && formControl.errors?.['onlyNumber'] === true) {
      return CONSTANT_ERR_INVALID_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('errorArea') && formControl.errors?.['errorArea'] === true) {
      return CONSTANT_ERR_INVALID_AREA;
    }

    if (formControl.errors?.hasOwnProperty('yearBetween1900And2099') && formControl.errors?.['yearBetween1900And2099'] === true) {
      return CONSTANT_ERR_INVALID_YEAR;
    }

    if (formControl.errors?.hasOwnProperty('max99') && formControl.errors?.['max99'] === true) {
      return CONSTANT_ERR_ONLY_ONE_99;
    }

    if (formControl.errors?.hasOwnProperty('onlyTextOrNumber') && formControl.errors?.['onlyTextOrNumber'] === true) {
      return CONSTANT_ERR_ONLY_TEXT_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('min03Characters') && formControl.errors?.['min03Characters'] === true) {
      return CONSTANT_ERR_MIN03_CHARACTERS;
    }

    if (formControl.errors?.hasOwnProperty('min10Characters') && formControl.errors?.['min10Characters'] === true) {
      return CONSTANT_ERR_MIN10_CHARACTERS;
    }

    if (formControl.errors?.hasOwnProperty('onlyTextAndNumberGuionCommand') && formControl.errors?.['onlyTextAndNumberGuionCommand'] === true) {
      return CONSTANT_ERR_ONLY_INVALID_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('onlyNumber') && formControl.errors?.['onlyNumber'] === true) {
      return CONSTANT_ERR_ONLY_INVALID_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('onlyLetters') && formControl.errors?.['onlyLetters'] === true) {
      return CONSTANT_ERR_ONLY_INVALID_LETTER;
    }

    if (formControl.errors?.hasOwnProperty('invalidEmail') && formControl.errors?.['invalidEmail'] === true) {
      return CONSTANT_ERR_ONLY_INVALID_EMAIL;
    }

    if (formControl.errors?.hasOwnProperty('max') && formControl.errors?.['max']) {
      return 'Error, valor maximo: ' + formControl.errors?.['max'].max + ' valor actual: ' + formControl.errors?.['max'].actual;
    }

    return '';
  }
}

