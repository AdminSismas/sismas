import { Component, Inject, OnInit } from '@angular/core';
import { DifferenceChanges } from '../../../interfaces/bpm/difference-changes';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { CONSTANT_CHANGE_UNITED_PREDIAL } from '../../../constants/general/constantLabels';
import { TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION } from '../../../constants/general/constants';

@Component({
  selector: 'vex-view-changes-bpm-operation',
  standalone: true,
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatListModule,
    MatRippleModule
  ],
  templateUrl: './view-changes-bpm-operation.component.html',
  styleUrl: './view-changes-bpm-operation.component.scss'
})
export class ViewChangesBpmOperationComponent implements OnInit {

  baunitIdE!:string |undefined;
  executionId!:string |undefined;
  listChanges: DifferenceChanges[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: DifferenceChanges[],
  ) {
  }

  ngOnInit() {
    if(this.defaults && this.defaults.length > 0) {
      this.listChanges = [...this.defaults];

      this.executionId = this.defaults[0].executionId;
      this.baunitIdE = this.defaults[0].baunitIdE;
    }

  }

  get dialogTitle(): string {
    return `${CONSTANT_CHANGE_UNITED_PREDIAL}${this.baunitIdE}, Versión: ${this.executionId}`;
  }

  protected readonly columns = TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION;
}
