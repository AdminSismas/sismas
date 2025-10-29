import { Component, OnChanges, SimpleChanges, input, output } from '@angular/core';
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
export class ComboboxComponent implements OnChanges {
  /* ---- Inputs ---- */
  readonly label = input.required<string>();
  readonly fielKey = input.required<string>();
  public readonly valueKey = input<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly options = input<any[]>([]);
  public readonly formControlNameCombobox = input('');
  public readonly cssClasses = input<string>();
  public readonly placeholder = input('');
  public readonly hideRequiredMarker = input(false);

  /* ---- Outputs ---- */
  public selectionChange = output<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _filteredOptions$:BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredOptions$ = this._filteredOptions$.asObservable();

  ngOnChanges(changes: SimpleChanges): void {
    const options = this.options();
    if(changes['options'] && options && options.length > 0) {
      this._filteredOptions$.next(options);
    }
  }

  onSelectionChange(value: string): void {
    this.selectionChange.emit(value);
  }

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
}
