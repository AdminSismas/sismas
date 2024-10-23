import { Component, Input, OnInit } from '@angular/core';
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
  templateUrl: './combox-auto-complete.component.html',
  styleUrl: './combox-auto-complete.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ComboxAutoCompleteComponent implements OnInit {

  form!: FormGroup;

  @Input() options: any[] = [];
  @Input() public label: string = '';
  @Input() public formControlNameCombobox: string = '';
  @Input() public idCombo: string = '';
  @Input() public placeholder?: string;
  @Input() public cssClasses?: string;

  filteredOptions: Observable<string[]> | undefined

  constructor() { }

  ngOnInit(): void {
    if (this.idCombo?.length>0) {
      this.idCombo = this.idCombo + this.getRandomInt(10000) + 'id' +this.getRandomInt(50);
    } else {
      this.idCombo = this.getRandomInt(10000) + 'id' +this.getRandomInt(50);
    }

    this.filteredOptions = this.form.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
