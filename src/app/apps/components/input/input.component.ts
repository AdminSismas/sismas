import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputType } from '../../interfaces/content-info';

@Component({
  selector: 'vex-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgFor,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    MatSelectModule,
    MatTooltipModule,
    NgClass
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class InputComponent implements OnInit {

  @Input() public idComboInput: string = '';
  @Input() public cssClasses?: string;
  @Input() public label: string = '';
  @Input() public formControlNameInput: string = '';
  @Input() public icon: string = '';
  @Input() type: InputType = 'text';
  @Input() public hintValue: string |null = null;
  @Input() public hideRequiredMarker: boolean = true;

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

