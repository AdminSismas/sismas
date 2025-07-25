import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { getRandomInt } from '../../../utils/general';
import { MatLabel } from '@angular/material/form-field';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { STRING_INFORMATION_NOT_FOUND } from '../../../constants/general/constant';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'vex-radio-button',
  standalone: true,
  imports: [
    MatRadioGroup,
    MatRadioButton,
    MatLabel,
    ReactiveFormsModule,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class RadioButtonComponent implements OnInit, OnChanges {

  @Input() public idRadioButton = '';
  @Input() public cssClasses?: string = '';
  @Input() public label = '';
  @Input() public key = '';
  @Input() public valueKey = '';
  @Input() public inLine = true;
  @Input() public formControlNameRadio = '';
  @Input() public options: any[] = [];

  @Output() public selectionChange = new EventEmitter<any>(); // Evento para emitir cambios de selección

  _filteredOptions$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredOptions$ = this._filteredOptions$.asObservable();

  value: any; // Valor del selector

  constructor() {
  }

  ngOnInit(): void {
    if (this.idRadioButton?.length > 0) {
      this.idRadioButton = this.idRadioButton + getRandomInt(14000) + 'radioButton_' + this.formControlNameRadio;
    } else {
      this.idRadioButton = getRandomInt(10000) + 'radioButton_' + this.formControlNameRadio;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options && this.options.length > 0) {
      this._filteredOptions$.next(this.options);
    }
  }

  onSelectionChange(value: any): void {
    this.value = value;
    this.selectionChange.emit(value);
  }

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
}
