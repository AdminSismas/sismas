import { Component, input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'vex-combox-auto-complete',
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
    NgClass,
    MatSelectModule,
    AsyncPipe
  ],
  templateUrl: './combobox-auto-complete.component.html',
  styleUrl: './combobox-auto-complete.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ComboboxAutoCompleteComponent implements OnInit {

  form!: FormGroup;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly options = input<any[]>([]);
  public readonly label = input<string>('');
  public readonly formControlNameCombobox = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly cssClasses = input<string>('');

  filteredOptions: Observable<string[]> | undefined;

  ngOnInit(): void {
    this.filteredOptions = this.form.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options().filter(option => option.toLowerCase().includes(filterValue));
  }
}
