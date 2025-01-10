// Angular framework
import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
// Vex
// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
// Custom
import { CustomSelectorComponent } from '../../../custom-selector/custom-selector.component';
import { environment } from 'src/environments/environments';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { InputComponent } from '../../../input/input.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'vex-edit-information-construction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
    CustomSelectorComponent,
    InputComponent,
    SweetAlert2Module,
  ],
  templateUrl: './edit-information-construction-dialog.component.html',
  styleUrl: './edit-information-construction-dialog.component.scss'
})
export class EditInformationConstructionDialogComponent implements OnInit {
  editForm: FormGroup;
  traditionalRatingForm: FormGroup;
  api_domainName = `${environment.url}:${environment.port}${environment.domain_domainName}?`;
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

  @ViewChild('closingDialog') private closingDialog!: SwalComponent;
  @ViewChild('saveConfirmDialog') private saveConfirmDialog!: SwalComponent;
  @ViewChild('successDialog') private successDialog!: SwalComponent;
  @ViewChild('errorDialog') private errorDialog!: SwalComponent;
  @ViewChild('validationErrorDialog') private validationErrorDialog!: SwalComponent;
  @ViewChild('calificationSuccessDialog') private calificationSuccessDialog!: SwalComponent;
  @ViewChild('calificationErrorDialog') private calificationErrorDialog!: SwalComponent;

  // Modifica los métodos que usan Swal

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
      this.closingDialog.fire().then((result) => {
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

      this.saveConfirmDialog.fire().then((result) => {
        if (result.isConfirmed) {
          this.informationPropertyService.updateConstruction(this.data.executionId, this.data.baunitId, formValues)
            .subscribe({
              next: () => {
                this.successDialog.fire().then(() => {
                  this.dialogRef.close(formValues);
                });
              },
              error: () => {
                this.errorDialog.fire();
              }
            });
        }
      });
    } else {
      this.validationErrorDialog.fire();
    }
  }

  // Guardar calificación
  saveCalification(): void {
    if (this.traditionalRatingForm.valid) {
      this.calificationSuccessDialog.fire();
    } else {
      this.calificationErrorDialog.fire();
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
