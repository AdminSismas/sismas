import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';

@Component({
  selector: 'vex-crud-citation-notice',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './crud-citation-notice.component.html',
  styleUrl: './crud-citation-notice.component.scss'
})
export class CrudCitationNoticeComponent implements OnInit {
  form = this.fb.group({
    name: this.fb.control('', {
      nonNullable: true
    }),
    email: this.fb.control('', {
      nonNullable: true
    }),
    phone: this.fb.control('', {
      nonNullable: true
    }),
    company: this.fb.control('', {
      nonNullable: true
    }),
    notes: this.fb.control('', {
      nonNullable: true
    }),
    birthday: this.fb.control('', {
      nonNullable: true
    })
  });

  participant?: ProcessParticipant;

  get isEdit(): boolean {
    return !!this.participationId;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private participationId: ProcessParticipant['participationId'],
    private dialogRef: MatDialogRef<CrudCitationNoticeComponent>,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    if (this.participationId) {
    }
  }

  toggleStar() {
    if (this.participant) {
      this.participant.selected = !this.participant.selected;
    }
  }

  save() {
    const form = this.form.getRawValue();
    this.dialogRef.close();
  }
}
