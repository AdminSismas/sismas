import { Component, Inject, OnInit } from '@angular/core';
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
import { BasicInformationAddress } from '../../../../interfaces/information-property/basic-information-address';
import { GUION, NAME_NO, NAME_NO_DISPONIBLE, NAME_SI } from '../../../../constants/general/constant';
import {
  DetailBasicInformationAddress
} from '../../../../interfaces/information-property/detail-basic-information-address';
import { InformationPropertyService } from '../../../../services/territorial-organization/information-property.service';
import { environment } from '../../../../../../environments/environments';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'vex-detail-information-address',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatDialogContent,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule
  ],
  templateUrl: './detail-information-address.component.html',
  styleUrl: './detail-information-address.component.scss'
})
export class DetailInformationAddressComponent implements OnInit {

  data!: DetailBasicInformationAddress;
  schema = `${environment.schemas.main}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: BasicInformationAddress | undefined,
    private dialogRef: MatDialogRef<DetailInformationAddressComponent>,
    private informationPropertyService: InformationPropertyService
  ) {
  }

  ngOnInit() {
    if (this.defaults === null || this.defaults === undefined) {
      this.close();
      return;
    }
    if (this.defaults?.direccionId === null || this.defaults?.direccionId === undefined) {
      this.close();
      return;
    }
    if (this.defaults?.schema !== null && this.defaults?.schema !== undefined) {
      this.schema = this.defaults?.schema;
    }
    this.loadDetailInformationAddress();
  }

  loadDetailInformationAddress(): void {
    if (this.defaults?.direccionId === null || this.defaults?.direccionId === undefined) {
      return;
    }
    this.informationPropertyService.getDetailBasicInformationPropertyAddresses(
      this.defaults.direccionId,
      this.schema,
      this.defaults.baunitId,
      this.defaults.executionId
    ).subscribe({
          next: (result: DetailBasicInformationAddress) => this.data = result,
          error: (error: HttpErrorResponse) => {
            if (error.status !== 500){
              console.log(error.message);
            }
          }
        }
      );
  }

  close(): void {
    this.dialogRef.close();
  }


  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_SI = NAME_SI;
  protected readonly NAME_NO = NAME_NO;
}
