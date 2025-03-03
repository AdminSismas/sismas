import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { INDIVIDUAL_TYPE_NUMBER, NAME_NO_DISPONIBLE } from '../../../../constants/general/constant';
import { ZoneBAUnitFisica, ZoneBAUnitGeoeconomic } from 'src/app/apps/interfaces/information-property/zone-baunit';

@Component({
  selector: 'vex-detail-information-property-zones',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms,
  ],
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatDialogContent,
    CommonModule
  ],
  templateUrl: './detail-information-property-zones.component.html',
  styleUrl: './detail-information-property-zones.component.scss'
})
export class DetailInformationPropertyZonesComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { zone: ZoneBAUnitFisica | ZoneBAUnitGeoeconomic, propertyType: string},
    private dialogRef: MatDialogRef<DetailInformationPropertyZonesComponent>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.data.zone === null || this.data.zone === undefined) {
      this.close();
    }

    this.cdr.detectChanges();
  }

  close(): void {
    this.dialogRef.close();
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly INDIVIDUAL_TYPE_NUMBER = INDIVIDUAL_TYPE_NUMBER;

}
