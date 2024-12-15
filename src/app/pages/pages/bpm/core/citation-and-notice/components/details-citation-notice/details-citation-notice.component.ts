import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';

export let contactIdCounter = 50;

@Component({
  selector: 'vex-details-citation-notice',
  templateUrl: './details-citation-notice.component.html',
  styleUrl: './details-citation-notice.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ]
})
export class DetailsCitationNoticeComponent implements OnInit {
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
    private dialogRef: MatDialogRef<DetailsCitationNoticeComponent>,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
  }

}
