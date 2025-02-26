import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
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
  @Input() public label = '';
  @Input() public formControlNameInput = '';
  @Input() public icon = '';
  @Input() type: InputType = 'text';
  @Input() public hintValue: string |null = null;
  @Input() public hideRequiredMarker = true;

  constructor() { }

  ngOnInit(): void {
    if (this.idComboInput?.length>0) {
      this.idComboInput = this.idComboInput + this.getRandomInt(10000) + this.formControlNameInput;
    } else {
      this.idComboInput = this.getRandomInt(10000) + this.formControlNameInput;
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}

