import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomSelectorComponent } from '../../../custom-selector/custom-selector.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';

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
    MatSelectModule,
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatStepperModule,
    MatInputModule,
    NgFor,
    NgIf,
    MatCheckboxModule,
    MatSnackBarModule,
    CustomSelectorComponent,
    MatTooltipModule

  ],
  templateUrl: './edit-information-construction-dialog.component.html',
  styleUrl: './edit-information-construction-dialog.component.scss'
})
export class EditInformationConstructionDialogComponent implements OnInit {
  editForm: FormGroup;
  traditionalRatingForm: FormGroup;
  api_domainName: string = `${environment.url}:${environment.port}${environment.domain_domainName}?`;
  calificationMode: 'tradicional' | 'tipologia' = 'tradicional';
  filteredBuiltUseOptions: any[] = []; // Opciones dinámicas para Uso de Construcción
  filteredTypologyOptions: any[] = []; // Opciones dinámicas para Tipología
  structureArmazonControl!: FormControl;
  structureMurosControl!: FormControl;
  structureCubiertaControl!: FormControl;
  structureConservacionControl!: FormControl;
  finishesFachadasControl!: FormControl;
  finishesMurosControl!: FormControl;
  finishesPisosControl!: FormControl;
  finishesConservacionControl!: FormControl;
  bathSizeControl!: FormControl;
  bathEnchapesControl!: FormControl;
  bathMobiliarioControl!: FormControl;
  bathConservacionControl!: FormControl;
  kitchenSizeControl!: FormControl;
  kitchenEnchapesControl!: FormControl;
  kitchenMobiliarioControl!: FormControl;
  kitchenConservacionControl!: FormControl;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInformationConstructionDialogComponent>,
    private informationPropertyService: InformationPropertyService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {


    // Formulario de Aspectos de Construcción
    this.editForm = this.fb.group({
      unitBuiltId: [data.unitBuiltId],
      domBuiltType: [data.domBuiltType, Validators.required],
      domBuiltUse: [data.domBuiltUse, Validators.required],
      unitBuiltLabel: [
        data.unitBuiltLabel,
        [Validators.required, Validators.pattern('^[A-Z]+$')]
      ],
      unitBuiltFloors: [
        data.unitBuiltFloors,
        [Validators.required, Validators.pattern('^[0-9]+$')]
      ],
      unitBuiltYear: [
        data.unitBuiltYear,
        [Validators.required, Validators.pattern('^(19|20)\\d{2}$')]
      ],
      unitBuiltArea: [
        data.unitBuiltArea,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')]
      ],
      unitBuiltPrivateArea: [
        data.unitBuiltPrivateArea,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')]
      ],
      unitBuiltValuation: [
        data.unitBuiltValuation,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')]
      ],
      unitBuiltValuationM2: [
        data.unitBuiltValuationM2,
        [Validators.required, Validators.pattern('^[0-9]+([.,][0-9]+)?$')]
      ],
      unitBuiltScore: [
        data.unitBuiltScore,
        [Validators.required, Validators.pattern('^[0-9]+$')]
      ],
      unitBuiltObservation: [data.unitBuiltObservation]
    });

    // Formulario de Calificación
    this.traditionalRatingForm = this.fb.group({
      structureArmazon: [data.structureArmazon],
      structureMuros: [data.structureMuros],
      structureCubierta: [data.structureCubierta],
      structureConservacion: [data.structureConservacion],
      finishesFachadas: [data.finishesFachadas],
      finishesMuros: [data.finishesMuros],
      finishesPisos: [data.finishesPisos],
      finishesConservacion: [data.finishesConservacion],
      bathSize: [data.bathSize],
      bathEnchapes: [data.bathEnchapes],
      bathMobiliario: [data.bathMobiliario],
      bathConservacion: [data.bathConservacion],
      kitchenSize: [data.kitchenSize],
      kitchenEnchapes: [data.kitchenEnchapes],
      kitchenMobiliario: [data.kitchenMobiliario],
      kitchenConservacion: [data.kitchenConservacion]
    });

    this.structureArmazonControl = this.traditionalRatingForm.get('structureArmazon') as FormControl;
    this.structureMurosControl = this.traditionalRatingForm.get('structureMuros') as FormControl;
    this.structureCubiertaControl = this.traditionalRatingForm.get('structureCubierta') as FormControl;
    this.structureConservacionControl = this.traditionalRatingForm.get('structureConservacion') as FormControl;
    this.finishesFachadasControl = this.traditionalRatingForm.get('finishesFachadas') as FormControl;
    this.finishesMurosControl = this.traditionalRatingForm.get('finishesMuros') as FormControl;
    this.finishesPisosControl = this.traditionalRatingForm.get('finishesPisos') as FormControl;
    this.finishesConservacionControl = this.traditionalRatingForm.get('finishesConservacion') as FormControl;
    this.bathSizeControl = this.traditionalRatingForm.get('bathSize') as FormControl;
    this.bathEnchapesControl = this.traditionalRatingForm.get('bathEnchapes') as FormControl;
    this.bathMobiliarioControl = this.traditionalRatingForm.get('bathMobiliario') as FormControl;
    this.bathConservacionControl = this.traditionalRatingForm.get('bathConservacion') as FormControl;
    this.kitchenSizeControl = this.traditionalRatingForm.get('kitchenSize') as FormControl;
    this.kitchenEnchapesControl = this.traditionalRatingForm.get('kitchenEnchapes') as FormControl;
    this.kitchenMobiliarioControl = this.traditionalRatingForm.get('kitchenMobiliario') as FormControl;
    this.kitchenConservacionControl = this.traditionalRatingForm.get('kitchenConservacion') as FormControl;

  }

  ngOnInit(): void {
    // Pre-cargar valores iniciales en el formulario
    this.editForm.patchValue({
      domBuiltType: this.data.domBuiltType?.trim(),
      domBuiltUse: this.data.domBuiltUse?.trim(),
    });
  
    // Cargar opciones dinámicas y filtrar según el tipo inicial
    this.fetchAllBuiltUseOptions(() => {
      const initialType = this.editForm.get('domBuiltType')?.value;
      if (initialType) {
        this.filterBuiltUseByType(initialType);
      }
    });
  
    // Manejar el cambio dinámico del selector de tipo
    this.editForm.get('domBuiltType')?.valueChanges.subscribe((selectedType) => {
      this.onTypeSelectionChange(selectedType);
    });
  }
  


  private validateInitialValues(): void {
    const initialType = this.editForm.get('domBuiltType')?.value;
    const initialUse = this.editForm.get('domBuiltUse')?.value;
  
    if (initialType) {
      this.filterBuiltUseByType(initialType);
    }
  
    if (
      initialUse &&
      !this.filteredBuiltUseOptions.some((option) => option.value === initialUse)
    ) {
      this.editForm.get('domBuiltUse')?.setValue(null);
    }
  }
  // Manejar cierre del diálogo
  handleDialogClose(): void {
    if (this.editForm.dirty || this.traditionalRatingForm.dirty) {
      Swal.fire({
        title: '¿Está seguro de cerrar?',
        text: 'Los cambios no se guardarán.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  // Cambiar modo de calificación
  toggleCalificationMode(mode: 'tradicional' | 'tipologia'): void {
    this.calificationMode = mode;
  }


  // Guardar cambios
  save(): void {
    if (this.editForm.valid) {
      const formValues = this.processFormValues(this.editForm.value);

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

  // Guardar calificación
  saveCalification(): void {
    if (this.traditionalRatingForm.valid) {
      Swal.fire({
        title: '¡Calificación Guardada!',
        text: 'Los datos de la calificación han sido registrados.',
        confirmButtonColor: '#3f51b5',
        icon: 'success'
      });
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, corrige las validaciones de calificación.',
        confirmButtonColor: '#3f51b5',
        icon: 'error'
      });
    }
  }

  // Procesar valores del formulario
  private processFormValues(values: any): any {
    return {
      ...values,
      unitBuiltPrivateArea: this.parseNumericValue(values.unitBuiltPrivateArea),
      unitBuiltArea: this.parseNumericValue(values.unitBuiltArea),
      unitBuiltValuation: this.parseNumericValue(values.unitBuiltValuation),
      unitBuiltValuationM2: this.parseNumericValue(values.unitBuiltValuationM2),
      unitBuiltScore: parseInt(values.unitBuiltScore, 10)
    };
  }

  // Convertir valores numéricos
  private parseNumericValue(value: string): number | null {
    return value ? parseFloat(value.toString().replace(',', '.')) : null;
  }


    getApiCalificationUrl(domain: string): string {
    return `${environment.url}:${environment.port}${environment.calificationUB}/${domain}`;
  }

 private fetchAllBuiltUseOptions(callback?: () => void): void {
  const params = new HttpParams().append('domainName', 'BuiltUse').append('active', true);

  this.http.get<any[]>(this.api_domainName, { params }).subscribe({
    next: (data) => {
      console.log('Opciones recargadas desde el backend:', data);
      this.filteredBuiltUseOptions = data;

      if (callback) {
        callback();
      }
    },
    error: (err) => {
      console.error('Error fetching BuiltUse options:', err);
    },
  });
}

  
  
  


  private filterBuiltUseByType(selectedType: string): void {
    if (!this.filteredBuiltUseOptions || this.filteredBuiltUseOptions.length === 0) {
      console.warn('No hay opciones disponibles para filtrar. Esperando datos.');
      return;
    }
  
    const filteredOptions = this.filteredBuiltUseOptions.filter((option) =>
      option.code.startsWith(selectedType)
    );
  
    console.log('Opciones filtradas:', filteredOptions);
  
    this.filteredBuiltUseOptions = filteredOptions;
  
    // Verifica si el valor actual sigue siendo válido
    const currentUse = this.editForm.get('domBuiltUse')?.value;
    const isValid = filteredOptions.some((option) => option.dispname === currentUse);
  
    if (!isValid) {
      console.log('El valor actual no es válido para el tipo seleccionado. Valor limpiado.');
      this.editForm.get('domBuiltUse')?.setValue(null);
    }
  }
  
  
  
  onTypeSelectionChange(selectedType: string): void {
    console.log('Cambio en el tipo de construcción:', selectedType);
  
    if (!selectedType) {
      console.log('No se seleccionó ningún tipo. Opciones de uso limpiadas.');
      this.filteredBuiltUseOptions = [];
      this.editForm.get('domBuiltUse')?.setValue(null);
      return;
    }
  
    // Vuelve a cargar las opciones desde el backend
    this.fetchAllBuiltUseOptions(() => {
      this.filterBuiltUseByType(selectedType);
    });
  }
  
  
  
  get domBuiltTypeControl(): FormControl {
    return this.editForm.get('domBuiltType') as FormControl;
  }
  
  get domBuiltUseControl(): FormControl {
    return this.editForm.get('domBuiltUse') as FormControl;
  }
  
  


}
