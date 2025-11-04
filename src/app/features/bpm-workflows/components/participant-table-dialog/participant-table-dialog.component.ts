import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CONSTANT_TYPE_PARTICIPATION_THIRDPARTY } from '@shared/constants';
import { ThirdPartyAffectedParticipant } from '@shared/interfaces';
import { ParticipantTableComponent } from '@shared/components/participant-table/participant-table.component';
import { ProcessParticipant } from '@shared/interfaces';
import { FluidMinHeightDirective } from '@shared/directives';

@Component({
  selector: 'vex-basic-participant-table-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    ParticipantTableComponent,
    FluidMinHeightDirective
  ],
  templateUrl: './participant-table-dialog.component.html',
  styleUrl: './participant-table-dialog.component.scss'
})
export class ParticipantTableDialogComponent implements OnInit {
  executionId = '';
  thirdPartyAffected = false;
  participationFormGroup: UntypedFormGroup = this.fb.group({
    numberID: [null],
    typeNumberDocument: [null],
    typeParticipation: [
      { value: CONSTANT_TYPE_PARTICIPATION_THIRDPARTY, disabled: true }
    ],
    personCompleted: [{ value: '', disabled: true }]
  });
  participants: ProcessParticipant[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ThirdPartyAffectedParticipant,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ParticipantTableDialogComponent>
  ) {}

  ngOnInit(): void {
    this.executionId = this.data.executionId;
    if (!this.executionId || this.executionId?.length <= 0) {
      return;
    }
    this.thirdPartyAffected = this.data.thirdPartyAffected;
  }

  loadParticipants(participants: ProcessParticipant[]) {
    this.participants = participants;
  }

  closeDialog() {
    this.dialogRef.close(this.participants);
  }
}
