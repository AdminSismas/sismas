import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  isRural: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditInformatizonZonesPropertyComponent>,
    private informationPropertyService: InformationPropertyService,
    @Inject(MAT_DIALOG_DATA) public data: ZoneBAUnit
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getByDivPolUrbana();
    this.getByDivPolRural();
    this.getByDivPolGeoeconomica();
  }


  private initializeForm(): void {
    this.zoneBAUnitForm = this.fb.group({
      baUnitZonaId: [this.data?.baUnitZonaId || null],
      baUnitZonaArea: [this.data?.baUnitZonaArea || '', [Validators.required]],
      ccZonaHomoFisicaRu: this.fb.group({
        zonaHomoFisicaRuId: [this.data?.ccZonaHomoFisicaRu?.zonaHomoFisicaRuId || null],
        zonaHomoFisicaRuCode: [this.data?.ccZonaHomoFisicaRu?.zonaHomoFisicaRuCode || '', [Validators.required]],
        domDisponibilidadAgua: [this.data?.ccZonaHomoFisicaRu?.domDisponibilidadAgua || null],
        domInfluenciaVialRural: [this.data?.ccZonaHomoFisicaRu?.domInfluenciaVialRural || null],
        domUsoSueloRural: [this.data?.ccZonaHomoFisicaRu?.domUsoSueloRural || null],
        normaUsoSuelo: [this.data?.ccZonaHomoFisicaRu?.normaUsoSuelo || '', [Validators.required]],
        vigencia: [this.data?.ccZonaHomoFisicaRu?.vigencia || null],
        divpolLv1: [this.data?.ccZonaHomoFisicaRu?.divpolLv1 || '', [Validators.required]],
        divpolLv2: [this.data?.ccZonaHomoFisicaRu?.divpolLv2 || '', [Validators.required]],
      }),
      ccZonaHomoFisicaUr: this.fb.group({
        zonaHomoFisicaUrId: [this.data?.ccZonaHomoFisicaUr?.zonaHomoFisicaUrId || null],
        zonaHomoFisicaUrCode: [this.data?.ccZonaHomoFisicaUr?.zonaHomoFisicaUrCode || '', [Validators.required]],
        domTopografiaZonaTipo: [this.data?.ccZonaHomoFisicaUr?.domTopografiaZonaTipo || ''],
        domInfluenciaVialUrbanaTipo: [this.data?.ccZonaHomoFisicaUr?.domInfluenciaVialUrbanaTipo || ''],
        domServiciosPublicosTipo: [this.data?.ccZonaHomoFisicaUr?.domServiciosPublicosTipo || ''],
        domUsoSueloUrbanoTipo: [this.data?.ccZonaHomoFisicaUr?.domUsoSueloUrbanoTipo || ''],
        normaUsoSuelo: [this.data?.ccZonaHomoFisicaUr?.normaUsoSuelo || ''],
        domTipificacionConstruccionTipo: [this.data?.ccZonaHomoFisicaUr?.domTipificacionConstruccionTipo || ''],
        vigencia: [this.data?.ccZonaHomoFisicaUr?.vigencia || null],
        divpolLv1: [this.data?.ccZonaHomoFisicaUr?.divpolLv1 || ''],
        divpolLv2: [this.data?.ccZonaHomoFisicaUr?.divpolLv2 || ''],
      }),
      ccZonaHomoGeoEconomica: this.fb.group({
        zonaHomoGeoEconomicaId: [this.data?.ccZonaHomoGeoEconomica?.zonaHomoGeoEconomicaId || null],
        zonaHomoGeoEconomicaCode: [this.data?.ccZonaHomoGeoEconomica?.zonaHomoGeoEconomicaCode || '', [Validators.required]],
        zonaHomoGeoEconomicaObs: [this.data?.ccZonaHomoGeoEconomica?.zonaHomoGeoEconomicaObs || ''],
        vigencia: [this.data?.ccZonaHomoGeoEconomica?.vigencia || null],
        divpolLv1: [this.data?.ccZonaHomoGeoEconomica?.divpolLv1 || ''],
        divpolLv2: [this.data?.ccZonaHomoGeoEconomica?.divpolLv2 || ''],
        suelo: [this.data?.ccZonaHomoGeoEconomica?.suelo || ''],
        valorLabel: [this.data?.ccZonaHomoGeoEconomica?.valorLabel || '']
      }),
      baUnitZonaValor: [this.data?.baUnitZonaValor || '', [Validators.required]],
      isRural: [this.isRural]
    });

    this.zoneBAUnitForm.get('isRural')?.valueChanges.subscribe((value: boolean) => {
      this.isRural = value;
      this.toggleZones(value); 
    });

 
    this.toggleZones(this.isRural);
  }

  toggleZones(isRural: boolean) {
    const ccZonaHomoFisicaRu = this.zoneBAUnitForm.get('ccZonaHomoFisicaRu');
    const ccZonaHomoFisicaUr = this.zoneBAUnitForm.get('ccZonaHomoFisicaUr');
  
    if (isRural) {
     
      ccZonaHomoFisicaRu?.enable();
      ccZonaHomoFisicaUr?.disable();
    } else {
    
      ccZonaHomoFisicaRu?.disable();
      ccZonaHomoFisicaUr?.enable();
    }
  }

  onSave(): void {
    if (this.zoneBAUnitForm && this.zoneBAUnitForm.valid) {
      this.dialogRef.close(this.zoneBAUnitForm.value);
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  getByDivPolUrbana(): void {
    this.informationPropertyService.getByDivPolUrbana().subscribe((result) => {
      console.log(result);
    });
  }
  
  
  getByDivPolRural(): void {
    this.informationPropertyService.getByDivPolRural().subscribe((result) => {
      console.log(result);
    });
  }

  getByDivPolGeoeconomica(): void {
    this.informationPropertyService.getByDivPolGeoeconomica().subscribe((result) => {
      console.log(result);
    });
  }
  
  
  

}
