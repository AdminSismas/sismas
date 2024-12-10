import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { InputComponent } from '../../../input/input.component';
import { TextAreaComponent } from '../../../text-area/text-area.component';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import Swal from 'sweetalert2';
import e from 'express';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'vex-edit-information-construction-dialog',
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
  templateUrl: './edit-information-construction-dialog.component.html',
  styleUrl: './edit-information-construction-dialog.component.scss'
})
export class EditInformationConstructionDialogComponent implements OnInit {
  editForm: FormGroup;
  traditionalRatingForm: FormGroup;
  informationConstructionForm: FormGroup;
  private fBuilder = inject(FormBuilder);

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


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInformationConstructionDialogComponent>,
    private informationPropertyService: InformationPropertyService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    this.editForm = this.fb.group({
      unitBuiltId: [data.unitBuiltId],
      domBuiltType: [data.domBuiltType, Validators.required],
      domBuiltUse: [data.domBuiltUse, Validators.required],
      unitBuiltLabel: [
        data.unitBuiltLabel,
        [Validators.required, Validators.pattern('^[A-Z]+$')] // Solo letras mayúsculas
      ],
      unitBuiltFloors: [
        data.unitBuiltFloors,
        [Validators.required, Validators.pattern('^[0-9]+$')] // Solo números enteros
      ],
      unitBuiltYear: [
        data.unitBuiltYear,
        [Validators.required, Validators.pattern('^(19|20)\\d{2}$')] // Solo años válidos entre 1900-2099
      ],
      unitBuiltArea: [
        data.unitBuiltArea,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')] // Solo números
      ],
      unitBuiltScore: [data.unitBuiltScore,
        [Validators.required, Validators.pattern('^[0-9]+$')] // Solo números enteros
      ],
      domTipologiaTipo: [data.domTipologiaTipo, Validators.required],
      unitBuiltValuation: [data.unitBuiltValuation,
      [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')] // Solo números
      ],
      unitBuiltValuationM2: [data.unitBuiltValuationM2,
      [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')] // Solo números
      ],
      unitBuiltPrivateArea: [
        data.unitBuiltPrivateArea,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')] // Solo números
      ],
      unitBuiltObservation: [data.unitBuiltObservation] // No es obligatorio
    });


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
      unitBuiltObservation: [null] // No es obligatorio
    });



  }

  ngOnInit(): void { }

  save(): void {
    if (this.editForm.valid) {

      const formValues = this.editForm.value;

      if (formValues.unitBuiltPrivateArea) {
        formValues.unitBuiltPrivateArea = parseFloat(formValues.unitBuiltPrivateArea.toString().replace(',', '.'));
      }
      if (formValues.unitBuiltArea) {
        formValues.unitBuiltArea = parseFloat(formValues.unitBuiltArea.toString().replace(',', '.'));
      }
      if (formValues.unitBuiltValuation) {
        formValues.unitBuiltValuation = parseFloat(formValues.unitBuiltValuation.toString().replace(',', '.'));
      }
      if (formValues.unitBuiltValuationM2) {
        formValues.unitBuiltValuationM2 = parseFloat(formValues.unitBuiltValuationM2.toString().replace(',', '.'));
      }
      if (formValues.unitBuiltScore) {
        formValues.unitBuiltScore = parseInt(formValues.unitBuiltScore.toString(), 10);
      }

      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas guardar los cambios realizados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.informationPropertyService.updateConstruction(this.data.executionId, this.data.baunitId, formValues)
            .subscribe({
              next: () => {
                Swal.fire({
                  title: '¡Guardado!',
                  text: 'Los datos se han actualizado correctamente.',
                  confirmButtonColor: '#3f51b5',
                  icon: 'success'
                });
                this.dialogRef.close(formValues);
              },
              error: () => {
                Swal.fire({
                  title: '¡Error!',
                  text: 'Ha ocurrido un error al guardar los datos.',
                  confirmButtonColor: '#3f51b5',
                  icon: 'error'
                });
              }
            });
        }
      });
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, corrige las validaciones del formulario.',
        confirmButtonColor: '#3f51b5',
        icon: 'error'
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmitTraditionalForm() {

  };

  onSubmitForm() {
  }



}
