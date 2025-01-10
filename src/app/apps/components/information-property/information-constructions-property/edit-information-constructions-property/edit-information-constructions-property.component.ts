// Angular framework
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal, viewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
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
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
// Custom
import { GUION, NAME_NO, NAME_NO_DISPONIBLE, NAME_SI } from 'src/app/apps/constants/constant';
import { BasicInformationConstruction } from 'src/app/apps/interfaces/information-property/basic-information-construction';
import { ContentInformationConstruction, CreateBasicInformationConstruction } from 'src/app/apps/interfaces/information-property/content-information-construction';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { environment } from 'src/environments/environments';
import { InputComponent } from '../../../input/input.component';
import { CustomSelectorComponent } from '../../../custom-selector/custom-selector.component';
import { V } from '@angular/cdk/keycodes';



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
    NgIf,
    ReactiveFormsModule,
    SweetAlert2Module,
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
  ],
  templateUrl: './edit-information-constructions-property.component.html',
  styleUrl: './edit-information-constructions-property.component.scss',
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
  ratingForm!: FormGroup;
  typologyRatingForm!: FormGroup;
  executionId: string | undefined;
  api_domainName: string = `${environment.url}:${environment.port}${environment.domain_domainName}?`;
  calificationMode: 'tradicional' | 'tipologia' | null = null;

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
  domTipologiaTipoControl!: FormControl;
  allBuiltUseOptions: any[] = [];
  filteredBuiltUseOptions: any[] = [];
  filteredTypologyOptions: any[] = [];
  isCreatingConstruction: boolean = false; // Estado de carga
  constructionId!: number; // ID de la construcción creada
  constructionData: ContentInformationConstruction | null = null;
  errorStepper?: any;

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('formError') formError!: SwalComponent;
  @ViewChild('idError') idError!: SwalComponent;
  @ViewChild('errorDialog') errorDialog!: SwalComponent;
  @ViewChild('qualificationError') qualificationError!: SwalComponent;
  @ViewChild('warningDialog') warningDialog!: SwalComponent;
  @ViewChild('incompleteForm') incompleteForm!: SwalComponent;
  @ViewChild('notFoundValues') notFoundValues!: SwalComponent;
  @ViewChild('successDialog') successDialog!: SwalComponent;
  @ViewChild('saveErrorDialog') saveErrorDialog!: SwalComponent;
  @ViewChild('selectTypeError') selectTypeError!: SwalComponent;
  @ViewChild('successQualificationType') successQualificationType!: SwalComponent;
  @ViewChild('errorQualificationType') errorQualificationType!: SwalComponent;
  @ViewChild('closeDialog') closeDialog!: SwalComponent;


  constructor(private http: HttpClient) {
    this.initForm();

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
    this.domTipologiaTipoControl = this.typologyRatingForm.get('domTipologiaTipo') as FormControl;
  }

  ngOnInit(): void {
    this.executionId = this.addEditInformationData.executionId;
    console.log('Execution ID:', this.executionId);
    this.loadDetailInformationConstruction();
    this.fetchAllBuiltUseOptions();

    this.domBuiltTypeControl.valueChanges.subscribe((selectedType) => {
      this.onTypeSelectionForTypology(selectedType);
    });

    this.bathSizeControl.valueChanges.subscribe((value) => {
      this.toggleBathroomFields(value);
    });

    // Escuchar cambios en el selector de tamaño de la cocina
    this.kitchenSizeControl.valueChanges.subscribe((value) => {
      this.toggleKitchenFields(value);
    });


  }

  private fetchAllBuiltUseOptions(): void {
    const params = new HttpParams().append('domainName', 'BuiltUse').append('active', true);

    this.http.get<any[]>(this.api_domainName, { params }).subscribe({
      next: (data) => {
        this.allBuiltUseOptions = data;
        this.filteredBuiltUseOptions = data;
      },
      error: (err) => {
        console.error('Error fetching BuiltUse options:', err);
      }
    });
  }



  onTypeSelectionChange(selectedType: any): void {
    if (!selectedType) {
      this.filteredBuiltUseOptions = this.allBuiltUseOptions;
      this.informationConstructionForm.get('domBuiltUse')?.setValue(null); // Resetea el valor del uso
      return;
    }

    const selectedTypeDispname = selectedType; // Valor seleccionado
    this.filteredBuiltUseOptions = this.allBuiltUseOptions.filter((option) =>
      option.code.startsWith(selectedTypeDispname)
    );

    this.informationConstructionForm.get('domBuiltUse')?.setValue(null); // Resetea el valor del uso
  }

  onTypeSelectionForTypology(selectedType: string): void {
    if (!selectedType) {
      // Si no hay selección, limpia las opciones de Tipología
      this.filteredTypologyOptions = [];
      this.domTipologiaTipoControl.setValue(null); // Resetea el valor de Tipología
      return;
    }

    // Construye la URL con el tipo seleccionado
    const url = `${environment.url}:${environment.port}${environment.calificationUB}${environment.unitBuild}/${environment.schemas.temp}/tipologiaTipo/${selectedType}`;

    // Realiza la petición GET para obtener las opciones de Tipología
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.filteredTypologyOptions = data; // Actualiza las opciones de Tipología
      },
      error: (err) => {
        console.error('Error al cargar las opciones de Tipología:', err);
        this.filteredTypologyOptions = []; // Limpia las opciones en caso de error
      },
    });
  }


  async createConstruction(): Promise<void> {
    if (this.informationConstructionForm.invalid) {
      this.informationConstructionForm.markAllAsTouched();
      this.formError.fire();
      return;
    }

    this.isCreatingConstruction = true; // Mostrar indicador de carga

    try {
      const formValue = this.informationConstructionForm.value;

      const createBasicInformationConstruction: CreateBasicInformationConstruction = {
        domBuiltType: formValue?.domBuiltType,
        domBuiltUse: formValue?.domBuiltUse,
        unitBuiltLabel: formValue?.unitBuiltLabel,
        unitBuiltFloors: formValue?.unitBuiltFloors,
        unitBuiltYear: formValue?.unitBuiltYear,
        unitBuiltArea: formValue?.unitBuiltArea,
        unitBuiltPrivateArea: formValue?.unitBuiltPrivateArea,
        unitBuiltObservation: formValue?.unitBuiltObservation,
      };

      const baunitId: string = this.addEditInformationData.baunitId || '';
      if (!baunitId) {
        this.idError.fire();
      }

      // Llamada al servicio para crear la construcción
      const response = await lastValueFrom(
        this.informationPropertyService.createBasicInformationPropertyConstruction(
          this.executionId || '',
          baunitId,
          createBasicInformationConstruction
        )
      );

      // Guarda el ID de la construcción
      this.constructionId = response.unitBuiltId ?? 0;
      this.constructionData = response;

      console.log('Construction ID:', this.constructionId);

      // Deshabilitar edición del primer paso, verificando si el objeto existe
      const firstStep = this.stepper.steps.get(0);
      if (firstStep) {
        firstStep.editable = false;
      }

      // Avanza al siguiente paso
      this.stepper.next();
    } catch (error) {
      // Si ocurre un error, evitar que el wizard avance
      this.stepper.selectedIndex = 0; // Asegura que el wizard se quede en el primer step
      this.errorStepper = error;
      this.errorDialog.fire();
      console.error(error);
    } finally {
      this.isCreatingConstruction = false; // Oculta el indicador de carga
    }
  }




  filterBuiltUseByType(selectedTypeCode: string): void {
    const builtUseControl = this.ratingForm.get('domBuiltUse');
    if (!builtUseControl) {
      return;
    }

    const builtUseOptions = (builtUseControl as any)?.options || [];

    this.filteredBuiltUseOptions = builtUseOptions.filter((opt: any) =>
      opt.code.startsWith(selectedTypeCode)
    );

    builtUseControl.setValue(null);
  }

  disableStepNavigation(): void {
    const steps = this.stepper.steps.toArray();
    steps.forEach((step, index) => {
      if (index < this.stepper.selectedIndex) {
        step.editable = false;
      }
    });
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

  /**
   * Init information address form
   */
  private initForm(): void {


    this.ratingForm = this.fBuilder.group({

      structureArmazon: [null],
      structureMuros: [null],
      structureCubierta: [null],
      structureConservacion: [null],

      // Campos de acabados principales
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
      kitchenConservacion: [null],




    });

    this.traditionalRatingForm = this.fBuilder.group({
      // Campos de Estructura
      structureArmazon: [null, Validators.required],
      structureMuros: [null, Validators.required],
      structureCubierta: [null, Validators.required],
      structureConservacion: [null, Validators.required],

      // Campos de Acabados Principales
      finishesFachadas: [null, Validators.required],
      finishesMuros: [null, Validators.required],
      finishesPisos: [null, Validators.required],
      finishesConservacion: [null, Validators.required],

      // Campos de Baño
      bathSize: [null, Validators.required],
      bathEnchapes: [null],
      bathMobiliario: [null],
      bathConservacion: [null],

      // Campos de Cocina
      kitchenSize: [null, Validators.required],
      kitchenEnchapes: [null],
      kitchenMobiliario: [null],
      kitchenConservacion: [null],



    });


    this.typologyRatingForm = this.fBuilder.group({
      domTipologiaTipo: [null, Validators.required],
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
        [Validators.required, Validators.pattern('^(?:[1-9]|[1-9][0-9])$')] // Números del 1 al 99
      ],
      unitBuiltYear: [
        null,
        [
          Validators.required,
          Validators.pattern('^(19|20)\\d{2}$'), // Años entre 1900 y 2099
          this.yearNotInFutureValidator() // Validación personalizada
        ]
      ],
      unitBuiltArea: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]+([.,][0-9]+)?$'), // Solo números
          this.nonZeroValidator() // Validación para que el área no sea 0
        ]
      ],

      unitBuiltPrivateArea: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]+([.,][0-9]+)?$'), // Solo números
          this.nonZeroValidator(), // Validación para que el área no sea 0
          this.privateAreaValidator('unitBuiltArea') // Validación para que no sea mayor al área total
        ]
      ],
      unitBuiltObservation: [null]

    });


  }

  yearNotInFutureValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentYear = new Date().getFullYear();
      const enteredYear = parseInt(control.value, 10);
      if (enteredYear > currentYear) {
        return { yearInFuture: true };
      }
      return null;
    };
  }

  nonZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseFloat(control.value);
      if (value <= 0) {
        return { nonZero: true }; // Devuelve un error si el valor es 0 o menor
      }
      return null; // Sin errores
    };
  }

  privateAreaValidator(totalAreaControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent; // Obtén el grupo del formulario
      if (!formGroup) {
        return null; // Espera hasta que haya un formulario padre
      }
      const totalAreaControl = formGroup.get(totalAreaControlName);
      if (!totalAreaControl) {
        return null; // Asegúrate de que el control exista
      }
      const totalArea = parseFloat(totalAreaControl.value);
      const privateArea = parseFloat(control.value);
      if (privateArea > totalArea) {
        return { privateAreaExceedsTotal: true }; // Devuelve un error si el área privada es mayor
      }
      return null; // Sin errores
    };
  }

  async submit(): Promise<void> {
    if (this.calificationMode === 'tradicional') {
      await this.submitTraditionalRating();
    } else if (this.calificationMode === 'tipologia') {
      await this.submitTypologyCalification();
    } else {
      this.qualificationError.fire()
    }
  }



  get activeCalificationForm(): FormGroup {
    return this.calificationMode === 'tradicional' ? this.traditionalRatingForm : this.typologyRatingForm;
  }


  getApiCalificationUrl(domain: string): string {
    return `${environment.url}:${environment.port}${environment.calificationUB}/${domain}`;
  }

  getApiTipologiaCalificationUrl(tipologia: string): string {
    return `${environment.url}:${environment.port}${environment.calificationUB}${environment.unitBuild}/${environment.schemas.temp}/${tipologia}`;
  }

  toggleCalificationMode(mode: 'tradicional' | 'tipologia'): void {
    if (
      (this.traditionalRatingForm.dirty && mode === 'tipologia') ||
      (this.typologyRatingForm.dirty && mode === 'tradicional')
    ) {
      this.warningDialog.fire();
      return;
    }

    this.calificationMode = mode;
  }


  get domBuiltTypeControl(): FormControl {
    return this.informationConstructionForm.get('domBuiltType') as FormControl;
  }

  get domBuiltUseControl(): FormControl {
    return this.informationConstructionForm.get('domBuiltUse') as FormControl;
  }


  async submitTraditionalRating(): Promise<void> {
    if (this.traditionalRatingForm.invalid) {
      this.traditionalRatingForm.markAllAsTouched();
      this.incompleteForm.fire();
      return;
    }

    try {
      const formValue = this.traditionalRatingForm.value;
      const payload = Object.values(formValue)
        .filter((id): id is number => typeof id === 'number' && !isNaN(id))
        .map((id) => ({ ccCalUBDom: { id } }));

      if (payload.length === 0) {
        this.notFoundValues.fire();
        return;
      }

      const baunitId: string = this.addEditInformationData.baunitId || '';
      if (!baunitId) throw new Error('baunitId no está definido.');

      await lastValueFrom(this.informationPropertyService.updateCalification(this.executionId || '', baunitId, this.constructionId, payload));

      this.successDialog.fire();

      // Cerrar el diálogo y enviar el resultado al padre
      this.dialogRef.close(this.constructionData);
    } catch (error) {
      this.saveErrorDialog.fire();
      console.error(error);
    }
  }

  async submitTypologyCalification(): Promise<void> {
    const selectedTypology = this.typologyRatingForm.get('domTipologiaTipo')?.value;

    if (!selectedTypology) {
      this.selectTypeError.fire()
      return;
    }

    try {
      const url = `${environment.url}:${environment.port}${environment.calificationUB}${environment.unitBuild}/${environment.schemas.temp}/tipologiaTipo/list/${selectedTypology}`;
      const response = await lastValueFrom(this.http.get<any[]>(url));

      const payload = response
        .filter((item) => item?.ccCalUBDom?.id)
        .map((item) => ({ ccCalUBDom: { id: item.ccCalUBDom.id } }));

      if (payload.length === 0) {
        this.notFoundValues.fire();
        return;
      }

      const baunitId: string = this.addEditInformationData.baunitId || '';
      if (!baunitId) throw new Error('baunitId no está definido.');

      await lastValueFrom(this.informationPropertyService.updateCalification(this.executionId || '', baunitId, this.constructionId, payload));

      this.successQualificationType.fire()

      // Cerrar el diálogo y enviar el resultado al padre
      this.dialogRef.close(this.constructionData);
    } catch (error) {
      this.errorQualificationType.fire();
      console.error(error);
    }
  }



  resetForms(): void {
    this.traditionalRatingForm.reset();
    this.typologyRatingForm.reset();
    this.calificationMode = null;
  }

  toggleBathroomFields(selectedValue: number): void {
    const shouldDisable = selectedValue === 34; // ID de "Sin_Baño"
    const fieldsToToggle = [
      this.bathEnchapesControl,
      this.bathMobiliarioControl,
      this.bathConservacionControl,
    ];

    fieldsToToggle.forEach((control) => {
      if (shouldDisable) {
        control.disable();
        control.reset(); // Limpia el valor cuando se desactiva
      } else {
        control.enable();
      }
    });
  }

  toggleKitchenFields(selectedValue: number): void {
    const shouldDisable = selectedValue === 49; // ID de "Sin_Cocina"
    const fieldsToToggle = [
      this.kitchenEnchapesControl,
      this.kitchenMobiliarioControl,
      this.kitchenConservacionControl,
    ];

    fieldsToToggle.forEach((control) => {
      if (shouldDisable) {
        control.disable();
        control.reset(); // Limpia el valor cuando se desactiva
      } else {
        control.enable();
      }
    });
  }

  handleDialogClose(): void {
    const currentStepIndex = this.stepper.selectedIndex;
    const calificationStepIndex = 1;

    if (currentStepIndex === calificationStepIndex) {
      this.closeDialog.fire().then((result) => {
        if (result.isConfirmed) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close(); // Cerrar directamente si no está en la sección de calificación
    }
  }








}
