import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroupDirective, NG_VALUE_ACCESSOR,
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
import { InputType } from '@shared/interfaces';
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
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';

@Component({
  selector: 'vex-input-date',
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
    NgClass,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle
  ],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true
    }
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class InputDateComponent implements OnInit {

  @Input() public idComboInput = '';
  @Input() public cssClasses?: string;
  @Input() public label!: string | null;
  @Input() public placeHolder = '';
  @Input() public formControlName = '';
  @Input() public icon!: string | null;
  @Input() public maxDate: Date = new Date(); // Fecha máxima permitida (hoy)
  @Input() public minDate: Date | null = null; // Fecha máxima permitida (hoy)
  @Input() public hintValue!: string | null;
  @Input() public hideRequiredMarker = true;

  constructor() {
  }

  ngOnInit(): void {
    if (this.idComboInput?.length > 0) {
      this.idComboInput = this.idComboInput + getRandomInt(10000) + this.formControlName;
    } else {
      this.idComboInput = getRandomInt(10000) + this.formControlName;
    }
  }
}

