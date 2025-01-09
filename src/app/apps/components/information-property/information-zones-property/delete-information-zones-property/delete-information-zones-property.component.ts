import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ZoneBAUnit } from 'src/app/apps/interfaces/information-property/zone-baunit';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';

@Component({
  selector: 'vex-delete-information-zones-property',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-information-zones-property.component.html',
  styleUrl: './delete-information-zones-property.component.scss'
})
export class DeleteInformationZonesPropertyComponent {
  baUnitZonaId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { zone: ZoneBAUnit, baunitId: number, baUnitZonaId: number },
 
    private dialogRef: MatDialogRef<DeleteInformationZonesPropertyComponent>,
    private snackbar: MatSnackBar,
    private informationPropertyService: InformationPropertyService,
  ) {}


  deleteBAUnitZonesProperty(): void {

    this.informationPropertyService.deleteBAUnitZones(this.data.baUnitZonaId, this.data.baunitId, 2024, 99999)
      .subscribe((res: any) => console.log(res));

    this.close();
    this.snackbar.open('Zona eliminada', 'CERRAR', { duration: 4000 });
  }

  close() {
    this.dialogRef.close();
  }

}
