/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular framework
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// Vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { GeoEconomicZone } from 'src/app/apps/interfaces/information-property/geo-economic-zone';
import {
  InformationPropertyService
} from 'src/app/apps/services/territorial-organization/information-property.service';
import { InputComponent } from '../../../general-components/input/input.component';
import { RuralPhysicalZone } from 'src/app/apps/interfaces/information-property/rural-physical-zone';
import { UrbanPhysicalZone } from 'src/app/apps/interfaces/information-property/urban-physical-zone';
import { AddZoneParameters } from 'src/app/apps/interfaces/information-property/zone-baunit';

@Component({
  selector: 'vex-add-edit-informatizon-zones-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
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
    MatTabsModule,
    // Custom
    InputComponent,
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
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditInformatizonZonesPropertyComponent>,
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

    // const selectedZone = this.zoneBAUnitForm.controls['ccZonaHomoFisicaUr'].value;
    if (this.data.zone) {
      this.zoneBAUnitForm.patchValue({
        baUnitZonaId: this.data.zone.baUnitZonaId,
        baUnitZonaArea: this.data.zone.baUnitZonaArea,
        ccZonaHomoFisicaUr: this.data.zone.ccZonaHomoFisicaUr,
        ccZonaHomoFisicaRu: this.data.zone.ccZonaHomoFisicaRu,
        ccZonaHomoGeoEconomica: this.data.zone.ccZonaHomoGeoEconomica,
        baUnitZonaValor: this.data.zone.baUnitZonaValor,
      });
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
        return zone1.zonaHomoGeoEconomicaCode === zone2.zonaHomoGeoEconomicaCode;
      }
    }
    return false;
  }


  private initializeForm(): void {

    this.zoneBAUnitForm = this.fb.group({
      baUnitZonaId: [this.data.zone?.baUnitZonaId || null],
      baUnitZonaArea: [this.data.zone?.baUnitZonaArea || '', [Validators.required, this.numberValidator]],
      ccZonaHomoFisicaUr: [this.data.zone?.ccZonaHomoFisicaUr || null],
      ccZonaHomoFisicaRu: [this.data.zone?.ccZonaHomoFisicaRu || null],
      ccZonaHomoGeoEconomica: [this.data.zone?.ccZonaHomoGeoEconomica || null],
      baUnitZonaValor: [this.data.zone?.baUnitZonaValor || '', [Validators.required, this.numberValidator]],
    });


    this.updateValidators();
  }

  private updateValidators(): void {
    const zonaFisica = this.zoneBAUnitForm.controls['ccZonaHomoFisicaUr'];
    const zonaRural = this.zoneBAUnitForm.controls['ccZonaHomoFisicaRu'];
    const zonaGeoEconomica = this.zoneBAUnitForm.controls['ccZonaHomoGeoEconomica'];

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
      return { 'invalidNumber': true };
    }
    return null;
  }


  onSave(): void {
    if (this.zoneBAUnitForm.valid) {
      const formValue = this.zoneBAUnitForm.value;


      formValue.baUnitZonaArea = formValue.baUnitZonaArea.toString().replace(',', '.');
      formValue.baUnitZonaValor = formValue.baUnitZonaValor.toString().replace(',', '.');


      let selectedZone = null;
      const requestBody: any = {
        baUnitZonaArea: formValue.baUnitZonaArea,
        baUnitZonaValor: formValue.baUnitZonaValor,
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
        this.informationPropertyService.updateBAUnitZones(formValue.baUnitZonaId, requestBody, this.data.baunitId, 2024)
          .subscribe(response => {
            console.log("Zona editada con éxito", response);
            this.dialogRef.close(response);
          });
      } else {
        this.informationPropertyService.createBAUnitZones(requestBody, this.data.baunitId, 2024)
          .subscribe(response => {
            console.log("Zona creada con éxito", response);
            this.dialogRef.close(response);
          });
      }
    } else {
      this.errorForm.fire();
    }
  }

  getByDivPolUrbana(): void {
    this.informationPropertyService.getByDivPolUrbana(this.data.divpolLv1, this.data.divpolLv2).subscribe((result: UrbanPhysicalZone[]) => {
      this.divPolUrbana = result;
      console.log(this.divPolUrbana);

    });
  }


  getByDivPolRural(): void {
    this.informationPropertyService.getByDivPolRural(this.data.divpolLv1, this.data.divpolLv2).subscribe((result) => {
      this.divPolRural = result;
      console.log(this.divPolRural);
    });
  }

  getByDivPolGeoeconomica(): void {
    this.informationPropertyService.getByDivPolGeoeconomica(this.data.divpolLv1, this.data.divpolLv2).subscribe((result) => {
      this.divPolGeoeconomica = result;
      console.log(result);
    });
  }




}
