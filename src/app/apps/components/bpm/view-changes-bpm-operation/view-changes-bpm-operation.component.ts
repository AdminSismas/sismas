import { Component, Inject, OnInit } from '@angular/core';
import { DifferenceChanges } from '../../../interfaces/bpm/difference-changes';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { NgForOf, NgIf } from '@angular/common';
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
import { TWO_POINT_ } from '../../../constants/general/constant';

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
    MatRippleModule,
    NgIf,
    NgForOf
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
    private dialogRef: MatDialogRef<ViewChangesBpmOperationComponent>,
  ) {
  }

  ngOnInit() {
    if(this.defaults && this.defaults.length > 0) {
      this.listChanges = [...this.defaults];

      this.executionId = this.defaults[0].executionId;
      this.baunitIdE = this.defaults[0].executionId;
    }

  }

  protected readonly CONSTANT_CHANGE_UNITED_PREDIAL = CONSTANT_CHANGE_UNITED_PREDIAL;
  protected readonly TWO_POINT_ = TWO_POINT_;
}
