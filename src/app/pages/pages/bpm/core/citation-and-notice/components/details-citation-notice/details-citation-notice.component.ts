import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import {
  HeaderCadastralInformationPropertyComponent
} from '../../../../../../../apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NAME_NO_DISPONIBLE } from '../../../../../../../apps/constants/constant';

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
    MatDatepickerModule,
    DatePipe,
    HeaderCadastralInformationPropertyComponent,
    MatExpansionModule
  ]
})
export class DetailsCitationNoticeComponent implements OnInit {

  id: string = '';
  participationId!: number;

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public processParticipant: ProcessParticipant,
    private dialogRef: MatDialogRef<DetailsCitationNoticeComponent>,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.processParticipant == null || this.processParticipant.participationId == null) {
      return;
    }
    this.participationId = this.processParticipant.participationId;
    this.id = this.id + this.getRandomInt(10000);
  }

  get isEdit(): boolean {
    return !!this.participationId;
  }
  private getRandomInt(max: number):number {
    return Math.floor(Math.random() * max);
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
