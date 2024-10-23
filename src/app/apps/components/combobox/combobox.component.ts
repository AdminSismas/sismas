import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'vex-combox',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatTableModule,
    NgClass
  ],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ComboboxComponent implements OnInit {

  @Input() options: any[] = [];
  @Input() public label: string = '';
  @Input() public formControlNameCombobox: string = '';
  @Input() public idCombo: string = '';
  @Input() public cssClasses?: string;
  @Input() public placeholder: string = '';

  constructor() {
  }

  ngOnInit(): void {
    if (this.idCombo?.length > 0) {
      this.idCombo = this.idCombo + this.getRandomInt(100000)
        + 'combox' + this.getRandomInt(10);
    } else {
      this.idCombo = this.getRandomInt(10000)
        + 'combox' + this.getRandomInt(10);
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
