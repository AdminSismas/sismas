import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { ZoneBAUnit } from 'src/app/apps/interfaces/information-property/zone-baunit';
import { InputComponent } from '../../../input/input.component';
import { TextAreaComponent } from '../../../text-area/text-area.component';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { RuralPhysicalZone } from 'src/app/apps/interfaces/information-property/rural-physical-zone';
import { UrbanPhysicalZone } from 'src/app/apps/interfaces/information-property/urban-physical-zone';
import Swal from 'sweetalert2';
import { GeoEconomicZone } from 'src/app/apps/interfaces/information-property/geo-economic-zone';

@Component({
  selector: 'vex-add-edit-informatizon-zones-property',
  standalone: true,
  imports: [

    CommonModule,
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    InputComponent,
    TextAreaComponent,
    ComboxColletionComponent,
    MatTabsModule,
    MatCardModule,
    MatSelectModule

 

  
  ],
  templateUrl: './add-edit-informatizon-zones-property.component.html',
  styleUrl: './add-edit-informatizon-zones-property.component.scss'
})
export class AddEditInformatizonZonesPropertyComponent {

  zoneBAUnitForm!: FormGroup;

  divPolUrbana: UrbanPhysicalZone[] = [];
  divPolRural: RuralPhysicalZone[] = [];
  divPolGeoeconomica: GeoEconomicZone[] = [];


  isEdit: boolean = false;   

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditInformatizonZonesPropertyComponent>,
    private informationPropertyService: InformationPropertyService,
    @Inject(MAT_DIALOG_DATA) public data: {zone: ZoneBAUnit, baunitId: number, isEdit: boolean, propertyType: string} 
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

  numberValidator(control: AbstractControl): { [key: string]: boolean } | null {
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
      let requestBody: any = {
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, asegúrese de que los campos sean válidos y contengan solo números.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3f51b5',
      });
    }
  }

  getByDivPolUrbana(): void {
    this.informationPropertyService.getByDivPolUrbana().subscribe((result: UrbanPhysicalZone[]) => {
      this.divPolUrbana = result;  
      console.log(this.divPolUrbana);  

    });
  }
  
  
  getByDivPolRural(): void {
    this.informationPropertyService.getByDivPolRural().subscribe((result) => {
      this.divPolRural = result;
      console.log(this.divPolRural);
    });
  }

  getByDivPolGeoeconomica(): void {
    this.informationPropertyService.getByDivPolGeoeconomica().subscribe((result) => {
      this.divPolGeoeconomica = result;
      console.log(result);
    });
  }
  
  
  

}
