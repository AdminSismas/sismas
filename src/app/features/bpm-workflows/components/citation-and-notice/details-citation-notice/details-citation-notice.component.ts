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
import { ProcessParticipant } from '@features/bpm-workflows/models/process-participant';
import { MatExpansionModule } from '@angular/material/expansion';
import { MODAL_SMALL_LARGE, NAME_NO_DISPONIBLE } from '@shared/constants/constants';
import { InfoPerson } from '@features/property-management/models/owner/info-person';
import { PeopleService } from '@features/property-management/services/property/people.service';
import { InfoContact } from '@features/property-management/models/owner/info-contact';
import { CreatePeopleComponent } from '@features/operation-support/components/people/create-people/create-people.component';

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
  participationId!: number;
  individualId!: number;
  contact!: InfoContact;

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
    this.dialog.open(CreatePeopleComponent, {
      ...MODAL_SMALL_LARGE,
      disableClose: true,
      data: {
        ...this.processParticipant.individual,
        mode: 'update'
      }
    }).afterClosed().subscribe((result: InfoPerson) => {
      if (result && result?.individualId > 0) {
        this.processParticipant.individual = result;
        this.individualId = result?.individualId;
        this.getContactParticipation();
      }
    });
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
