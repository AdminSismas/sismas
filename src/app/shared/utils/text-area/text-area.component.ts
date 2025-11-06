import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  CONSTANT_ERR_CAPITAL_LETTER,
  CONSTANT_ERR_INVALID_AREA,
  CONSTANT_ERR_INVALID_NUMBER,
  CONSTANT_ERR_INVALID_YEAR,
  CONSTANT_ERR_MIN03_CHARACTERS,
  CONSTANT_ERR_MIN10_CHARACTERS,
  CONSTANT_ERR_ONLY_INVALID_LETTER,
  CONSTANT_ERR_ONLY_INVALID_NUMBER,
  CONSTANT_ERR_ONLY_ONE_99,
  CONSTANT_ERR_ONLY_TEXT_NUMBER
} from '../../constants/general/constantsAlertLabel';

@Component({
  selector: 'vex-text-area',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class TextAreaComponent {
  public readonly cssClasses = input('');
  @Input() public label = '';
  public readonly placeholder = input('');
  @Input() public formControlNameTextArea = '';
  @Input() public formControlTextArea:FormControl | null = null;
  @Input() public icon!: string | null;
  @Input() public hintValue!: string | null;
  public readonly hideRequiredMarker = input(true);

  checkIsInValid(formControl: AbstractControl | null): boolean {
    return !(
      formControl && Object.keys(formControl).includes('status') && formControl.status === 'VALID' &&
      Object.keys(formControl).includes('errors') && formControl.errors === null
    );
  }

  checkForErrorsIn(formControl: AbstractControl): string {
    if (formControl.hasError('required')) {
      return 'Campo requerido';
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('capitalLetter') && formControl.errors?.['capitalLetter']) {
      return CONSTANT_ERR_CAPITAL_LETTER;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('onlyNumber') && formControl.errors?.['onlyNumber']) {
      return CONSTANT_ERR_INVALID_NUMBER;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('errorArea') && formControl.errors?.['errorArea']) {
      return CONSTANT_ERR_INVALID_AREA;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('yearBetween1900And2099') && formControl.errors?.['yearBetween1900And2099']) {
      return CONSTANT_ERR_INVALID_YEAR;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('max99') && formControl.errors?.['max99']) {
      return CONSTANT_ERR_ONLY_ONE_99;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('onlyTextOrNumber') && formControl.errors?.['onlyTextOrNumber']) {
      return CONSTANT_ERR_ONLY_TEXT_NUMBER;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('min03Characters') && formControl.errors?.['min03Characters']) {
      return CONSTANT_ERR_MIN03_CHARACTERS;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('min10Characters') && formControl.errors?.['min10Characters']) {
      return CONSTANT_ERR_MIN10_CHARACTERS;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('onlyTextAndNumberGuionCommand') && formControl.errors?.['onlyTextAndNumberGuionCommand']) {
      return CONSTANT_ERR_ONLY_INVALID_NUMBER;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('onlyNumber') && formControl.errors?.['onlyNumber']) {
      return CONSTANT_ERR_ONLY_INVALID_NUMBER;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('onlyLetters') && formControl.errors?.['onlyLetters']) {
      return CONSTANT_ERR_ONLY_INVALID_LETTER;
    }

    if (formControl.errors && Object.keys(formControl.errors).includes('max') && formControl.errors?.['max']) {
      return 'Error, valor maximo: ' + formControl.errors?.['max'].max + ' valor actual: ' + formControl.errors?.['max'].actual;
    }

    return '';
  }

}
