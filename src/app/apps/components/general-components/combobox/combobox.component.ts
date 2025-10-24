import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, NgClass } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { STRING_INFORMATION_NOT_FOUND } from '@shared/constants';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'vex-combox',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ComboboxComponent implements OnInit, OnChanges {

  @Input({ required: true }) label = '';
  @Input({ required: true }) fielKey = '';
  @Input()  public idCombo = '';
  @Input()  public valueKey = '';
  @Input()  public options: any[] = [];
  @Input()  public formControlNameCombobox = '';
  @Input()  public cssClasses?: string;
  @Input()  public placeholder = '';
  @Input()  public hideRequiredMarker = false;
  @Output() public selectionChange = new EventEmitter<any>(); // Evento para emitir cambios de selección


  _filteredOptions$:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredOptions$ = this._filteredOptions$.asObservable();

  value: any; // Valor del selector

  constructor() {
  }

  ngOnInit(): void {
    if (this.idCombo?.length > 0) {
      this.idCombo = this.idCombo + this.getRandomInt(14500)
        + 'combox' + this.getRandomInt(10) + 'b32334';
    } else {
      this.idCombo = this.getRandomInt(18700)
        + 'combox' + this.getRandomInt(10) + '23432f';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['options'] && this.options && this.options.length > 0) {
      this._filteredOptions$.next(this.options);
    }
  }

  onSelectionChange(value: any): void {
    this.value = value;
    this.selectionChange.emit(value);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
}
