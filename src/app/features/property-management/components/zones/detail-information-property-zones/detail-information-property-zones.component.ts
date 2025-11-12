import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NAME_NO_DISPONIBLE } from '@shared/constants/constants';
import { ZoneBAUnitFisica, ZoneBAUnitGeoeconomic } from '@features/property-management/models/zone-baunit';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
type PropertyType = 'Urbano' | 'Rural' | 'Geoeconómica';

interface DialogData {
  zone: ZoneBAUnitFisica | ZoneBAUnitGeoeconomic;
  propertyType: PropertyType;
}

@Component({
  selector: 'app-detail-information-property-zones',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    ModalWindowComponent
  ],
  templateUrl: './detail-information-property-zones.component.html',
  styleUrls: ['./detail-information-property-zones.component.scss']
})
export class DetailInformationPropertyZonesComponent {
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  private readonly dialogRef = inject(MatDialogRef<DetailInformationPropertyZonesComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: DialogData
  ) {}

  getTitle(): string {
    let code = '';
    if (this.data.propertyType === 'Urbano') {
      code = this.data.zone.zonaHomoFisicaUrCode || this.NAME_NO_DISPONIBLE;
    } else if (this.data.propertyType === 'Geoeconómica') {
      code = this.data.zone.zonaHomoGeoEconomicaCode || this.NAME_NO_DISPONIBLE;
    } else {
      code = this.data.zone.zonaHomoFisicaRuCode || this.NAME_NO_DISPONIBLE;
    }
    return `Código - ${code}`;
  }

  onAccept(): void {
    this.dialogRef.close();
  }
}
