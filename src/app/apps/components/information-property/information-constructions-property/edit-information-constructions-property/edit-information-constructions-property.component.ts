import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { GUION, NAME_NO, NAME_NO_DISPONIBLE, NAME_SI } from 'src/app/apps/constants/constant';
import { BasicInformationConstruction } from 'src/app/apps/interfaces/information-property/basic-information-construction';
import { ContentInformationConstruction, CreateBasicInformationConstruction } from 'src/app/apps/interfaces/information-property/content-information-construction';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { environment } from 'src/environments/environments';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { TextAreaComponent } from '../../../text-area/text-area.component';
import { InputComponent } from '../../../input/input.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';



export interface AddEditInformationConstructionI {
  type: 'edit' | 'new';
  basicInformationConstruction: BasicInformationConstruction | undefined;
  baunitId: string | undefined;
  executionId: string | undefined;
}

@Component({
  selector: 'vex-edit-information-constructions-property',
  standalone: true,
  imports: [
    CommonModule,
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './edit-information-constructions-property.component.html',
  styleUrl: './edit-information-constructions-property.component.scss'
})
export class EditInformationConstructionsPropertyComponent implements OnInit {

  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_SI = NAME_SI;
  protected readonly NAME_NO = NAME_NO;
  informationConstructionForm!: FormGroup;
  schema = signal<string>(`${environment.schemas.main}`);
  detailBasicInformation = signal<ContentInformationConstruction | null>(null);
  isLoading = signal<boolean>(false);
  private dialogRef = inject(MatDialogRef<EditInformationConstructionsPropertyComponent>);
  private informationPropertyService = inject(InformationPropertyService);
  private fBuilder = inject(FormBuilder);
  readonly addEditInformationData = inject<AddEditInformationConstructionI>(MAT_DIALOG_DATA);
  traditionalRatingForm!: FormGroup;
  typologyRatingForm!: FormGroup;
  executionId: string | undefined;

  armazonOptions: string[] = [
    'Madera', 'Tapia', 'Prefabricado', 'Ladrillo', 'Bloque', 'Madera inmunizada',
    'Concreto hasta tres pisos', 'Concreto cuatro o más pisos'
  ];

  murosOptions: string[] = [
    'Materiales de desecho', 'Esterilla', 'Bahareque', 'Adobe', 'Tapia', 'Madera',
    'Concreto Prefabricado', 'Bloque', 'Ladrillo', 'Madera Fina'
  ];

  cubiertaOptions: string[] = [
    'Materiales de desecho', 'Zinc', 'Teja de barro', 'Eternit o Teja de barro',
    'Azotea', 'Aluminio', 'Placas con Eternit'
  ];

  conservacionOptions: string[] = ['Malo', 'Regular', 'Bueno', 'Excelente'];

  fachadasOptions: string[] = ['Pobre', 'Sencilla', 'Regular', 'Buena', 'Lujosa'];

  murosCubrimientoOptions: string[] = [
    'Sin cubrimiento', 'Pañete', 'Panel', 'Común', 'Ladrillo prensado', 'Estuco',
    'Cerámica', 'Panel fino', 'Madera', 'Piedra ornamentada', 'Ladrillo fino',
    'Mármol lujoso', 'Otros'
  ];

  pisosOptions: string[] = [
    'Tierra Pisada', 'Cemento', 'Madera burda', 'Baldosa común de cemento', 'Tablón',
    'Ladrillo', 'Listón machihembrado', 'Tableta', 'Caucho', 'Acrílico', 'Granito',
    'Baldosa fina', 'Cerámica', 'Parquet', 'Alfombra', 'Retal de mármol', 'Mármol',
    'Vinilo Lujo', 'Otros lujos'
  ];

  // Opciones para Baño
  banoTamanoOptions: string[] = ['Sin baño', 'Pequeño', 'Mediano', 'Grande'];
  banoEnchapesOptions: string[] = [
    'Sin cubrimiento', 'Pañete', 'Baldosa común de cemento', 'Baldosín', 'Cristanac',
    'Granito', 'Panel fino', 'Cerámica', 'Mármol', 'Enchape lujoso'
  ];
  banoMobiliarioOptions: string[] = ['Pobre', 'Sencillo', 'Regular', 'Bueno', 'Lujoso'];

  // Opciones para Cocina
  cocinaTamanoOptions: string[] = ['Sin cocina', 'Pequeña', 'Mediana', 'Grande'];
  cocinaEnchapesOptions: string[] = [
    'Sin cubrimiento', 'Pañete', 'Baldosa común de cemento', 'Baldosín', 'Cristanac',
    'Granito', 'Panel fino', 'Cerámica', 'Mármol', 'Enchape lujoso'
  ];
  cocinaMobiliarioOptions: string[] = ['Pobre', 'Sencillo', 'Regular', 'Bueno', 'Lujoso'];



  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.executionId = this.addEditInformationData.executionId;
    console.log('Execution ID:', this.executionId);
    this.loadDetailInformationConstruction();

  }


  /**
   * Load date for detail information selected
   */
  async loadDetailInformationConstruction(): Promise<void> {
    try {
      if (this.addEditInformationData.type === 'new') {
        return;
      }
      const detailBasicInformationConstruction: ContentInformationConstruction =
        await lastValueFrom(
          this.informationPropertyService.getDetailBasicInformationPropertyConstructions(
            this.schema(),
            this.addEditInformationData.basicInformationConstruction?.unitBuiltId
          )
        );
      this.detailBasicInformation.set(detailBasicInformationConstruction);
      Object.entries(detailBasicInformationConstruction)
        .forEach(([key, value]) => {
          if (this.informationConstructionForm.controls[key]) {
            this.informationConstructionForm.controls[key].setValue(value);
          }
        });
    } catch (e) {
      console.error(e);
    }


  }

  onSubmitTraditionalForm() {

  };


  async onSubmitForm(): Promise<void> {
    console.log('Submitting form with values:', this.informationConstructionForm.value);
    if (this.informationConstructionForm.invalid) {
      this.informationConstructionForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, corrige los errores en el formulario para continuar.',
        confirmButtonColor: '#3f51b5'
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de crear una nueva construcción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    });
  
    if (!result.isConfirmed) {
      return;
    }
  
    this.isLoading.set(true);
  
    try {
      const value = this.informationConstructionForm.value || {};
  
      if (value.unitBuiltPrivateArea) {
        value.unitBuiltPrivateArea = value.unitBuiltPrivateArea.toString().replace(',', '.');
      }
      if (value.unitBuiltArea) {
        value.unitBuiltArea = value.unitBuiltArea.toString().replace(',', '.');
      }
  
      let detailBasicInformationConstruction: ContentInformationConstruction | undefined;
      if (this.addEditInformationData.type === 'new') {
        const createBasicInformationConstruction: CreateBasicInformationConstruction = {
          domBuiltType: value?.domBuiltType,
          domBuiltUse: value?.domBuiltUse,
          unitBuiltLabel: value?.unitBuiltLabel,
          unitBuiltFloors: value?.unitBuiltFloors,
          unitBuiltYear: value?.unitBuiltYear,
          unitBuiltArea: value?.unitBuiltArea,
          domTipologiaTipo: value?.domTipologiaTipo,
          unitBuiltPrivateArea: value?.unitBuiltPrivateArea,
          unitBuiltObservation: value?.unitBuiltObservation,
        };
  
        const baunitId: string = this.addEditInformationData.baunitId || '';
        if (!baunitId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'baunitId no está definido.',
            confirmButtonColor: '#3f51b5'
          });
          throw new Error('baunitId no está definido.');
        }
  

        detailBasicInformationConstruction = await lastValueFrom(
          this.informationPropertyService.createBasicInformationPropertyConstruction(
            this.executionId || '',
            baunitId,
            createBasicInformationConstruction
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Creación exitosa',
          text: 'La información de construcción se ha guardado correctamente.',
          confirmButtonText: 'OK', confirmButtonColor: '#3f51b5'
        });
      } else {
        detailBasicInformationConstruction = await lastValueFrom(
          this.informationPropertyService.updateBasicInformationPropertyConstruction(
            this.detailBasicInformation()?.unitBuiltId?.toString() || '',
            { ...value },
          )
        );
      }
  
      this.dialogRef.close(detailBasicInformationConstruction);
    } catch (e) {
      let errorMessage = 'Ocurrió un error inesperado.';
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      } else if ((e as Error)?.message) {
        errorMessage = (e as Error).message;
      }
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ocurrió un error al guardar la información: ${errorMessage}`,
        confirmButtonColor: '#3f51b5'
      });
  
      console.error(e);
    }
  
    this.isLoading.set(false);
  }
  /**
   * Init information address form
   */
  private initForm(): void {

    this.traditionalRatingForm = this.fBuilder.group({
      // Campos de Estructura
      structureArmazon: [null],
      structureMuros: [null],
      structureCubierta: [null],
      structureConservacion: [null],

      // Campos de Acabados Principales
      finishesFachadas: [null],
      finishesMuros: [null],
      finishesPisos: [null],
      finishesConservacion: [null],

      // Campos de Baño
      bathSize: [null],
      bathEnchapes: [null],
      bathMobiliario: [null],
      bathConservacion: [null],

      // Campos de Cocina
      kitchenSize: [null],
      kitchenEnchapes: [null],
      kitchenMobiliario: [null],
      kitchenConservacion: [null]
    });


    this.informationConstructionForm = this.fBuilder.group({
      domBuiltType: [null, Validators.required],
      domBuiltUse: [null, Validators.required],
      unitBuiltLabel: [
        null,
        [Validators.required, Validators.pattern('^[A-Z]+$')] // Solo letras mayúsculas
      ],
      unitBuiltFloors: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')] // Solo números enteros
      ],
      unitBuiltYear: [
        null,
        [Validators.required, Validators.pattern('^(19|20)\\d{2}$')] // Solo años válidos entre 1900-2099
      ],
      unitBuiltArea: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')]// Solo números
      ],
      domTipologiaTipo: [null, Validators.required],
      unitBuiltPrivateArea: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')]// Solo números
      ],
      unitBuiltObservation: [null] 
    });

    if (this.addEditInformationData.type === 'new') {
      const names: string[] = ['unitBuiltId'];
      names.forEach((name: string) => {
        if (this.informationConstructionForm.controls[name]) {
          this.informationConstructionForm.controls[name].clearValidators();
          this.informationConstructionForm.controls[name].updateValueAndValidity();
        }
      });
    }
  }


}
