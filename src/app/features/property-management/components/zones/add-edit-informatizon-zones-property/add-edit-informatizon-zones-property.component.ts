/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular framework
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// Vex
// Material
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
// Custom
import { GeoEconomicZone } from '@features/property-management/models/geo-economic-zone';
import {
  InformationPropertyService
} from '@features/property-management/services/property/information-property.service';
import { RuralPhysicalZone } from '@features/property-management/models/rural-physical-zone';
import { UrbanPhysicalZone } from '@features/property-management/models/urban-physical-zone';
import {
  AddZoneParameters,
  CreateBaunitZone
} from '@features/property-management/models/zone-baunit';

@Component({
  selector: 'vex-add-edit-informatizon-zones-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    // Material
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule
    // Custom
  ],
  templateUrl: './add-edit-informatizon-zones-property.component.html',
  styleUrl: './add-edit-informatizon-zones-property.component.scss'
})
export class AddEditInformatizonZonesPropertyComponent implements OnInit {
  zoneBAUnitForm!: FormGroup;

  divPolUrbana: UrbanPhysicalZone[] = [];
  divPolRural: RuralPhysicalZone[] = [];
  divPolGeoeconomica: GeoEconomicZone[] = [];

  @ViewChild('errorForm') errorForm!: SwalComponent;

  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<AddEditInformatizonZonesPropertyComponent>,
    private fb: FormBuilder,
    private informationPropertyService: InformationPropertyService,
    @Inject(MAT_DIALOG_DATA) public data: AddZoneParameters
  ) {}

  ngOnInit(): void {
    this.isEdit = this.data.isEdit;
    this.initializeForm();

    switch (this.data.propertyType) {
      case 'Urbano':
        this.getByDivPolUrbana();
        break;
      case 'Rural':
        this.getByDivPolRural();
        break;
      case 'Geoeconomica':
        this.getByDivPolGeoeconomica();
        break;
    }
  }

  compareZones(zone1: any, zone2: any): boolean {
    if (zone1 && zone2) {
      if (zone1.zonaHomoFisicaUrCode && zone2.zonaHomoFisicaUrCode) {
        return zone1.zonaHomoFisicaUrCode === zone2.zonaHomoFisicaUrCode;
      }
      if (zone1.zonaHomoFisicaRuCode && zone2.zonaHomoFisicaRuCode) {
        return zone1.zonaHomoFisicaRuCode === zone2.zonaHomoFisicaRuCode;
      }
      if (zone1.zonaHomoGeoEconomicaCode && zone2.zonaHomoGeoEconomicaCode) {
        return (
          zone1.zonaHomoGeoEconomicaCode === zone2.zonaHomoGeoEconomicaCode
        );
      }
    }
    return false;
  }

  private initializeForm(): void {
    this.zoneBAUnitForm = this.fb.group({
      baUnitZonaArea: [
        this.data.zone?.baUnitZonaArea || '',
        [Validators.required, this.numberValidator]
      ],
      esComun: [this.data.zone?.esComun || false],
      ccZonaHomoFisicaUr: [this.data.zone?.ccZonaHomoFisicaUr || null],
      ccZonaHomoFisicaRu: [this.data.zone?.ccZonaHomoFisicaRu || null],
      ccZonaHomoGeoEconomica: [this.data.zone?.ccZonaHomoGeoEconomica || null]
    });

    this.updateValidators();
  }

  private updateValidators(): void {
    const zonaFisica = this.zoneBAUnitForm.controls['ccZonaHomoFisicaUr'];
    const zonaRural = this.zoneBAUnitForm.controls['ccZonaHomoFisicaRu'];
    const zonaGeoEconomica =
      this.zoneBAUnitForm.controls['ccZonaHomoGeoEconomica'];

    switch (this.data.propertyType) {
      case 'Urbano':
        zonaFisica.setValidators([Validators.required]);
        zonaRural.setValidators([]);
        zonaGeoEconomica.setValidators([]);
        break;
      case 'Rural':
        zonaFisica.setValidators([]);
        zonaRural.setValidators([Validators.required]);
        zonaGeoEconomica.setValidators([]);
        break;
      case 'Geoeconomica':
        zonaFisica.setValidators([]);
        zonaRural.setValidators([]);
        zonaGeoEconomica.setValidators([Validators.required]);
        break;
      default:
        break;
    }
  }

  numberValidator(control: AbstractControl): Record<string, boolean> | null {
    const value = control.value?.toString().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(value)) {
      return { invalidNumber: true };
    }
    return null;
  }

  onSave(): void {
    if (this.zoneBAUnitForm.valid) {
      const formValue = this.zoneBAUnitForm.value;

      // formValue.baUnitZonaArea = `${formValue.baUnitZonaArea}`.replace(',', '.');
      formValue.baUnitZonaArea = Number(formValue.baUnitZonaArea);

      let selectedZone = null;
      const requestBody: CreateBaunitZone = {
        baUnitZonaArea: formValue.baUnitZonaArea,
        esComun: formValue.esComun
      };

      switch (this.data.propertyType) {
        case 'Urbano':
          selectedZone = formValue.ccZonaHomoFisicaUr;
          requestBody.ccZonaHomoFisicaUr = selectedZone;
          requestBody.ccZonaHomoFisicaRu = null;
          requestBody.ccZonaHomoGeoEconomica = null;
          break;

        case 'Rural':
          selectedZone = formValue.ccZonaHomoFisicaRu;
          requestBody.ccZonaHomoFisicaRu = selectedZone;
          requestBody.ccZonaHomoFisicaUr = null;
          requestBody.ccZonaHomoGeoEconomica = null;
          break;

        case 'Geoeconomica':
          selectedZone = formValue.ccZonaHomoGeoEconomica;
          requestBody.ccZonaHomoGeoEconomica = selectedZone;
          requestBody.ccZonaHomoFisicaUr = null;
          requestBody.ccZonaHomoFisicaRu = null;
          break;

        default:
          console.error('Tipo de propiedad no reconocido');
          return;
      }

      if (selectedZone && selectedZone.cadastreChangeLog) {
        selectedZone.cadastreChangeLog = null;
      }

      if (this.isEdit) {
        const { baUnitZonaId } = this.data.zone!;
        const { baunitId } = this.data;

        this.informationPropertyService
          .updateBAUnitZones(
            this.data.executionId,
            baunitId,
            baUnitZonaId!,
            requestBody
          )
          .subscribe((response) => {
            this.dialogRef.close(response);
          });
      } else {
        this.informationPropertyService
          .createBAUnitZones(
            requestBody,
            this.data.baunitId,
            this.data.executionId
          )
          .subscribe((response) => {
            this.dialogRef.close(response);
          });
      }
    } else {
      this.errorForm.fire();
    }
  }

  getByDivPolUrbana(): void {
    this.informationPropertyService
      .getByDivPolUrbana(this.data.divpolLv1!, this.data.divpolLv2!)
      .subscribe((result: UrbanPhysicalZone[]) => {
        this.divPolUrbana = result;
      });
  }

  getByDivPolRural(): void {
    this.informationPropertyService
      .getByDivPolRural(this.data.divpolLv1!, this.data.divpolLv2!)
      .subscribe((result) => {
        this.divPolRural = result;
      });
  }

  getByDivPolGeoeconomica(): void {
    const npnLike = this.data.npn!.slice(0, 7);
    this.informationPropertyService
      .getByDivPolGeoeconomica(npnLike)
      .subscribe((result) => {
        this.divPolGeoeconomica = result;
      });
  }
}
