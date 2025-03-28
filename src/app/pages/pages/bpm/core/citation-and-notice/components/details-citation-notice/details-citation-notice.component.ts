import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import { MatExpansionModule } from '@angular/material/expansion';
import { NAME_NO_DISPONIBLE } from '../../../../../../../apps/constants/general/constants';
import { getRandomInt } from 'src/app/apps/utils/general';

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
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatExpansionModule,
    TitleCasePipe
  ]
})
export class DetailsCitationNoticeComponent implements OnInit {

  id: string = '';
  participationId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public processParticipant: ProcessParticipant) {
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.processParticipant == null || this.processParticipant.participationId == null) {
      return;
    }
    this.participationId = this.processParticipant.participationId;
    this.id = this.id + getRandomInt(10000);
  }

  editProcessParticipant(){

  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
