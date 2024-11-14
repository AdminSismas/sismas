import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteParamsRrright, DialogsData } from 'src/app/apps/interfaces/bpm/changes-property-owner';
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';

@Component({
  selector: 'vex-delete-property-owner',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-property-owner.component.html',
  styleUrl: './delete-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePropertyOwnerComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogsData,
    private rrrightService: RrrightService,
    private dialogRef: MatDialogRef<DeletePropertyOwnerComponent>,
    private snackbar: MatSnackBar,
  ) {}

  deleteRrrightOwnerProperty(): void {
    console.log('Eliminando propietario...')

    const parameters: DeleteParamsRrright = {
      executionId: this.data.executionId,
      baunitId: this.data.baunitId,
      rightId: this.data.rightId
    }

    this.rrrightService.deletePropertyOwner(parameters)
      .subscribe((res: any) => console.log(res))

    this.close()
    this.snackbar.open('Propietario eliminado', 'CLOSE', { duration: 4000 })
  }

  close() {
    this.dialogRef.close();
  }
}
