import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ProcessParticipant } from 'src/app/apps/interfaces/bpm/process-participant';
import {
  BasicParticipantTableComponent
} from 'src/app/pages/pages/bpm/initiate-filing-procedure/components/basic-participant-table/basic-participant-table.component';

@Component({
  selector: 'vex-basic-participant-table-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    // Custom
    BasicParticipantTableComponent
  ],
  templateUrl: './basic-participant-table-dialog.component.html',
  styles: ``
})
export class BasicParticipantTableDialogComponent {
  participationFormGroup: UntypedFormGroup = this.fb.group({
    numberID: [null],
    typeNumberDocument: [null],
    typeParticipation: [{ value: 'Tercero Afectado', disabled: true }],
    personCompleted: [{ value: '', disabled: true }]
  });
  participants: ProcessParticipant[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputs: unknown,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BasicParticipantTableDialogComponent>,
  ) {}

  loadParticipants(participants: ProcessParticipant[]) {
    this.participants = participants;
  }

  closeDialog() {
    console.log(this.participants);
    this.dialogRef.close(this.participants);
  }
}
