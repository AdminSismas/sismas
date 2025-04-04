import { Component, Inject, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import { MatExpansionModule } from '@angular/material/expansion';
import { MODAL_DYNAMIC_HEIGHT, NAME_NO_DISPONIBLE } from '../../../../../../../apps/constants/general/constants';
import { getRandomInt } from 'src/app/apps/utils/general';
import { UpdateParticipantComponent } from '../update-participant/update-participant.component';
import { InfoPerson } from '../../../../../../../apps/interfaces/information-property/info-person';
import { HttpErrorResponse } from '@angular/common/http';
import { PeopleService } from '../../../../../../../apps/services/users/people.service';
import { InfoContact } from '../../../../../../../apps/interfaces/information-property/info-contact';

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

  id: string = getRandomInt(5258445) + 'DetailsCitationNoticeComponent';
  participationId!: number;
  individualId!: number;
  contact!: InfoContact

  constructor(
    @Inject(MAT_DIALOG_DATA) public processParticipant: ProcessParticipant,
    private peopleService: PeopleService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.processParticipant == null || this.processParticipant.participationId == null) {
      return;
    }
    this.participationId = this.processParticipant.participationId;
    this.individualId = this.processParticipant?.individual?.individualId;
    this.getContactParticipation();
  }

  getContactParticipation() {
    this.peopleService.getContactByIndividualId(this.individualId)
      .subscribe((res: InfoContact) => this.contact = res);
  }

  editProcessParticipant() {
    let individualTypeNumber: string = this.processParticipant.individual.domIndividualTypeNumber;
    let number: string = this.processParticipant.individual.number;
    this.dialog.open(UpdateParticipantComponent, {
      ...MODAL_DYNAMIC_HEIGHT,
      disableClose: true,
      data: {
        domIndividualTypeNumber: individualTypeNumber,
        number: number,
        mode: 'update'
      }
    }).afterClosed().subscribe(
      (result: { number: string; individualTypeNumber: string }) => {

      });
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
