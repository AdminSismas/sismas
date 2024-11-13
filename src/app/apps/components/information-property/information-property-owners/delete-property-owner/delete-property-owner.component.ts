import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteDialogData } from 'src/app/apps/interfaces/bpm/add-property-owner';
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
    @Inject(MAT_DIALOG_DATA) public defaults: DeleteDialogData,
    private rrrightService: RrrightService,
    private dialogRef: MatDialogRef<DeletePropertyOwnerComponent>,
    private snackbar: MatSnackBar,
  ) {}

  deleteRrrightOwnerProperty(): void {
    console.log('Eliminando propietario...')
    this.rrrightService.deletePropertyOwner(this.defaults)
      .subscribe((res: any) => console.log(res))

    this.close()
    this.snackbar.open('Propietario eliminado', 'CLOSE', { duration: 2000 })
  }

  close() {
    this.dialogRef.close();
  }
}
