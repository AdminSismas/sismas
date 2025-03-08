// Angular framework
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
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
import {
  ContentInformationConstruction,
  CrudInformationConstruction
} from 'src/app/apps/interfaces/information-property/content-information-construction';
import { environment } from 'src/environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { CustomSelectorComponent } from '../../../general-components/custom-selector/custom-selector.component';
import { InputComponent } from '../../../general-components/input/input.component';
import { CollectionServices } from '../../../../services/general/collection.service';
import { CcCalificacionUB } from '../../../../interfaces/information-property/cc-calificacion-ub';
import { TextAreaComponent } from '../../../general-components/text-area/text-area.component';
import {
  CONSTANT_MSG_ONLY_ONE_99,
  CONSTANT_MSG_TYPE_AREA,
  CONSTANT_MSG_UNITBUILT_LABEL,
  CONSTANT_MSG_UNITBUILT_YEAR
} from '../../../../constants/general/constantsAlertLabel';
import { GeneralValidationsService } from '../../../../services/validations/general-validations.service';
import {
  TypeOperationConstruction,
  TypeQualificationMode,
  ValidateQualificationByDomBuiltType
} from '../../../../interfaces/general/content-info';
import { CommonGeneralValidationsService } from '../../../../services/general/common-general-validations.service';
import {
  InformationConstructionsService
} from '../../../../services/information-property/information-constructions-property/information-constructions.service';
import { validateIsNumber, validateVariable } from '../../../../utils/general';
// Custom
import {
  DOMAIN_NAME_BUILT_USE,
  GUION,
  NAME_NO_DISPONIBLE,
  QUALIFICATIONS_DISABLE_BATH_KITCHEN_BY_DOMBUILTTYPE,
  TYPE_CREATE_CONSTRUCTION,
  TYPE_TRADITIONAL,
  TYPE_TYPOLOGY
} from '../../../../constants/general/constant';
import { env } from '../../../../../../environments/enviromentsIA';


@Component({
  selector: 'vex-edit-information-constructions-property',
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
    CommonModule,
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
    CustomSelectorComponent,
    InputComponent,
    TextAreaComponent

  ],
  templateUrl: './crud-information-constructions-property.component.html',
  styleUrl: './crud-information-constructions-property.component.scss'
})
export class CrudInformationConstructionsPropertyComponent implements OnInit, AfterViewInit {

  executionId: string | null | undefined;
  baunitId: string | null | undefined;
  unitBuiltId!: number | null | undefined; // ID de la construcción creada
  typeCrud: TypeOperationConstruction | null = null;
  api_domainName: string = `${environment.url_domain_name}`;
  qualificationMode: TypeQualificationMode | null = TYPE_TRADITIONAL;
  allBuiltUseOptions: any[] = [];
  filteredBuiltUseOptions: any[] = [];
  isCreateOrUpdateConstruction: boolean = false; // Estado de carga

  constructionData: ContentInformationConstruction | null = null;
  qualificationsConstruction: CcCalificacionUB[] = [];
  mapQualificationsConstruction: any = null;

  editForm: FormGroup = this.fb.group({
    unitBuiltId: [this.crudInformationData?.contentInformation?.unitBuiltId ?? null],
    domBuiltType: [this.crudInformationData?.contentInformation?.domBuiltType ?? null, Validators.required],
    domBuiltUse: [this.crudInformationData?.contentInformation?.domBuiltUse ?? null, Validators.required],
    unitBuiltLabel: [this.crudInformationData?.contentInformation?.unitBuiltLabel ?? null, [Validators.required, this.generalValidations.validateCapitalLettersOnly()]],// Solo letras mayúsculas
    unitBuiltFloors: [this.crudInformationData?.contentInformation?.unitBuiltFloors ?? null, [Validators.required, this.generalValidations.validateNumberMax99()]],// Números del 1 al 99
    unitBuiltYear: [this.crudInformationData?.contentInformation?.unitBuiltYear ?? null, [Validators.required,
      this.generalValidations.validateYearBetween1900And2099(), // Años entre 1900 y 2099
      this.generalValidations.yearNotInFutureValidator()]], // Validación personalizada
    unitBuiltArea: [this.crudInformationData?.contentInformation?.unitBuiltArea ?? null, [Validators.required, this.generalValidations.validateOnlyNumber()]],
    unitBuiltPrivateArea: [this.crudInformationData?.contentInformation?.unitBuiltPrivateArea ?? null, [
      Validators.required,
      this.generalValidations.validateOnlyNumber(), // Solo números
      //this.generalValidations.nonZeroValidator(), // Validación para que el área no sea 0
      this.generalValidations.privateAreaValidator('unitBuiltArea') // Validación para que no sea mayor al área total
    ]],
    unitBuiltObservation: [this.crudInformationData?.contentInformation?.unitBuiltObservation ?? null]
  });
  traditionalRatingForm: FormGroup = this.fb.group({
    structureFraming: [null],
    structureWalls: [null],
    structureRoof: [null],
    structureConservation: [null],
    finishesFacades: [null],
    finishesWalls: [null],
    finishesFloors: [null],
    finishesConservation: [null],
    bathSize: [null],
    bathEnchapes: [null],
    bathFurniture: [null],
    bathConservation: [null],
    kitchenSize: [null],
    kitchenEnchapes: [null],
    kitchenFurniture: [null],
    kitchenConservation: [null],
    domTipologiaTipo: [null]
  });
  typologyRatingForm: FormGroup = this.fb.group({
    domTipologiaTipo: [null, Validators.required]
  });

  domBuiltTypeControl!: FormControl;

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('formError') formError!: SwalComponent;
  @ViewChild('idError') idError!: SwalComponent;
  @ViewChild('qualificationError') qualificationError!: SwalComponent;
  @ViewChild('warningQualificationDialog') warningQualificationDialog!: SwalComponent;
  @ViewChild('incompleteForm') incompleteForm!: SwalComponent;
  @ViewChild('notFoundValues') notFoundValues!: SwalComponent;
  @ViewChild('saveErrorDialog') saveErrorDialog!: SwalComponent;
  @ViewChild('selectTypeError') selectTypeError!: SwalComponent;
  @ViewChild('successQualificationType') successQualificationType!: SwalComponent;
  @ViewChild('errorQualificationType') errorQualificationType!: SwalComponent;
  @ViewChild('closeDialog') closeDialog!: SwalComponent;
  @ViewChild('successDialog') private successDialog!: SwalComponent;
  @ViewChild('validationErrorDialog') private validationErrorDialog!: SwalComponent;
  @ViewChild('calificationSuccessDialog') private calificationSuccessDialog!: SwalComponent;
  @ViewChild('errorSaveDialog') private errorSaveDialog!: SwalComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public crudInformationData: CrudInformationConstruction | null,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrudInformationConstructionsPropertyComponent>,
    private collectionServicesService: CollectionServices,
    private constructionsService: InformationConstructionsService,
    private generalValidations: GeneralValidationsService,
    private validationsService: CommonGeneralValidationsService
  ) {

    this.domBuiltTypeControl = this.editForm.get('domBuiltType') as FormControl;
  }

  ngOnInit(): void {
    this.typeCrud = this.crudInformationData?.type || TYPE_CREATE_CONSTRUCTION;
    this.executionId = this.crudInformationData?.contentInformation?.executionId;
    this.baunitId = this.crudInformationData?.contentInformation?.baunitId;
    this.unitBuiltId = this.crudInformationData?.contentInformation?.unitBuiltId;

    if (!validateVariable(this.executionId) || !validateVariable(this.baunitId)) {
      return;
    }

    if (!this.crudInformationData || !this.crudInformationData?.contentInformation ||
      this.typeCrud === 'DELETE') {
      this.fetchAllBuiltUseOptions();
      return;
    }

    if (this.typeCrud === 'UPDATE') {
      this.constructionData = this.crudInformationData?.contentInformation;
      this.changeDetailInformationConstruction(this.crudInformationData?.contentInformation);
      this.getDetailQualificationConstruction(this.crudInformationData?.contentInformation);
    }
    this.fetchAllBuiltUseOptions();

    this.domBuiltTypeControl.valueChanges.subscribe((value) => {
      this.toggleKitchenAndBathFields(value);
    });
  }

  ngAfterViewInit(): void {
  }


  resetConstructionAndQualification(): void {
    if (this.qualificationMode === TYPE_TRADITIONAL) {
      this.traditionalRatingForm.reset();
    } else {
      this.typologyRatingForm.reset();
    }
  }

  // Guardar calificación
  saveConstructionAndQualification(): void {
    if (this.qualificationMode === TYPE_TRADITIONAL) {
      this.saveTraditionalRating();
    } else {
      this.saveTypologyQualification();
    }
  }

  saveTypologyQualification() {
    const selectedTypology = this.typologyRatingForm.get('domTipologiaTipo')?.value;
    if (!selectedTypology) {
      this.selectTypeError.fire();
      return;
    }
    this.successQualificationType.fire();
  }

  saveTraditionalRating() {
    if (this.traditionalRatingForm.invalid || !this.executionId || !this.baunitId || !this.unitBuiltId) {
      this.traditionalRatingForm.markAllAsTouched();
      this.incompleteForm.fire();
      return;
    }

    try {
      const formValue = this.traditionalRatingForm.value;
      const listQualification: CcCalificacionUB[] = Object.values(formValue)
        .filter((id): id is number => typeof id === 'number' && !isNaN(id))
        .map((id: number) => ({ ccCalUBDom: { id } }));

      if (!listQualification || listQualification.length === 0) {
        this.notFoundValues.fire();
        return;
      }

      this.constructionsService.updateQualification(this.executionId, this.baunitId, this.unitBuiltId, listQualification)
        .subscribe({
          next: () => {
            this.calificationSuccessDialog.fire().then(() => this.closedDialog(this.constructionData));
          },
          error: () => {
            this.errorSaveDialog.fire();
          }
        });
    } catch (error) {
      this.saveErrorDialog.fire();
      console.error(error);
    }
  }

  // Guardar cambios
  saveConstruction(): void {
    if (this.isCreateOrUpdateConstruction) {
      return;
    }
    if (!this.editForm.valid) {
      this.validationErrorDialog.fire();
      return;
    }

    const formValues: ContentInformationConstruction = this.processFormValues(this.editForm.value);
    if (this.typeCrud === 'UPDATE' && this.executionId && this.baunitId) {
      this.updateConstruction(this.executionId, this.baunitId, formValues);
      return;
    }
    if (this.typeCrud === 'CREATE' && this.executionId && this.baunitId) {
      this.createConstruction(this.executionId, this.baunitId, formValues);
      return;
    }
    this.isCreateOrUpdateConstruction = false;
  }

  handleDialogClose(): void {
    const currentStepIndex = this.stepper.selectedIndex;
    const qualificationStepIndex = 1;
    if (currentStepIndex === qualificationStepIndex) {
      this.closeDialog.fire().then((result) => {
        if (result.isConfirmed) {
          this.closedDialog(this.constructionData);
        }
      });
    } else {
      this.closedDialog(this.constructionData); // Cerrar directamente si no está en la sección de calificación
    }
  }

  changeDetailInformationConstruction(detailInformationConstruction: ContentInformationConstruction | null) {
    if (detailInformationConstruction) {
      Object.entries(detailInformationConstruction).forEach(([key, value]) => {
        if (this.editForm.controls[key]) {
          this.editForm.controls[key].setValue(value);
        }
      });
    }
  }

  getDetailQualificationConstruction(detailInformationConstruction: ContentInformationConstruction | null) {
    if (detailInformationConstruction) {
      const executionId = detailInformationConstruction.executionId ?? null;
      const baunitId = detailInformationConstruction.baunitId ?? null;
      const unitBuiltId = detailInformationConstruction.unitBuiltId ?? null;
      if (!executionId || !baunitId || !unitBuiltId) {
        return;
      }
      this.constructionsService.getQualificationConstructions(executionId, baunitId, unitBuiltId)
        .subscribe((result: CcCalificacionUB[]) => {
          this.qualificationsConstruction = result;
          this.mapQualificationsConstruction = this.indexArraylistQualifications(this.qualificationsConstruction, 'domain');
          setTimeout(() => this.refreshTraditionalRatingForm(), 275);
        });
    }
  }

  refreshTraditionalRatingForm() {
    let idBath = this.chargeQualificationConstruction('Tamanio_Banio');
    let idKitchen = this.chargeQualificationConstruction('Tamanio_Cocina');

    this.traditionalRatingForm = this.fb.group({
      structureFraming: [this.chargeQualificationConstruction('Armazon')],
      structureWalls: [this.chargeQualificationConstruction('Muros')],
      structureRoof: [this.chargeQualificationConstruction('Cubierta')],
      structureConservation: [this.chargeQualificationConstruction('Conservacion_Cubierta')],
      finishesFacades: [this.chargeQualificationConstruction('Fachada')],
      finishesWalls: [this.chargeQualificationConstruction('Cubrimiento_Muros')],
      finishesFloors: [this.chargeQualificationConstruction('Piso')],
      finishesConservation: [this.chargeQualificationConstruction('Conservacion_Acabados')],
      bathSize: [idBath],
      bathEnchapes: [{
        value: this.chargeQualificationConstruction('Enchape_Banio'),
        disable: idBath !== null && idBath !== undefined && idBath === 34
      }],
      bathFurniture: [{
        value: this.chargeQualificationConstruction('Mobiliario_Banio'),
        disable: idBath !== null && idBath !== undefined && idBath === 34
      }],
      bathConservation: [{
        value: this.chargeQualificationConstruction('Conservacion_Banio'),
        disable: idBath !== null && idBath !== undefined && idBath === 34
      }],
      kitchenSize: [idKitchen],
      kitchenEnchapes: [{
        value: this.chargeQualificationConstruction('Enchape_Cocina'),
        disable: idKitchen !== null && idKitchen !== undefined && idKitchen === 49
      }],
      kitchenFurniture: [{
        value: this.chargeQualificationConstruction('Mobiliario_Cocina'),
        disable: idKitchen !== null && idKitchen !== undefined && idKitchen === 49
      }],
      kitchenConservation: [{
        value: this.chargeQualificationConstruction('Conservacion_Cocina'),
        disable: idKitchen !== null && idKitchen !== undefined && idKitchen === 49
      }],
      domTipologiaTipo: [this.chargeQualificationConstruction('Tipologia')]
    });

    setTimeout(() => {
      if (idBath !== null && idBath !== undefined && idBath === 34) {
        this.toggleBathroomFields(idBath);
      }
      if (idKitchen !== null && idKitchen !== undefined && idKitchen === 49) {
        this.toggleKitchenFields(idKitchen);
      }
    }, 2500);

    this.editForm.valueChanges.subscribe(selectedValue => {
      this.isCreateOrUpdateConstruction = false;
    });

    this.traditionalRatingForm.valueChanges.subscribe(selectedValue => {
    });

  }

  toggleBathroomFields(selectedValue: number): void {
    const shouldDisable: boolean = selectedValue === 34; // ID de "Sin_Baño"
    const fieldsToToggle = ['bathEnchapes', 'bathFurniture', 'bathConservation'];
    fieldsToToggle.forEach((key: string) => this.validateControlDisableOrEnableCustomSelect(key, shouldDisable));
  }

  toggleKitchenFields(selectedValue: number): void {
    const shouldDisable = selectedValue === 49; // ID de "Sin_Cocina"
    const fieldsToToggle = ['kitchenEnchapes', 'kitchenFurniture', 'kitchenConservation'];
    fieldsToToggle.forEach((key: string) => this.validateControlDisableOrEnableCustomSelect(key, shouldDisable));
  }

  chargeQualificationConstruction(domain: string) {
    let id: number | null = null;
    if (this.qualificationsConstruction && this.qualificationsConstruction.length > 0
      && domain.length > 0 && this.mapQualificationsConstruction != null) {
      try {
        id = this.mapQualificationsConstruction[domain]?.ccCalUBDom.id;
        if (validateIsNumber(id) && id != null && id != undefined && id > 0) {
          return id;
        }
      } catch (e) {
        return null;
      }
    }
    return id;
  }

  toggleKitchenAndBathFields(domBuiltType: string | null | undefined): void {
    if (validateVariable(domBuiltType)) {
      QUALIFICATIONS_DISABLE_BATH_KITCHEN_BY_DOMBUILTTYPE.forEach(
        (obj: ValidateQualificationByDomBuiltType) => {
          if (obj != null && obj.list.length > 0 && obj.domBuiltType === domBuiltType) {
            obj.list.forEach((key: string) => this.validateControlDisableOrEnableCustomSelect(key, obj.shouldDisable));
          }
        });
    }
  }

  validateControlDisableOrEnableCustomSelect(key: string, shouldDisable: boolean) {
    if (this.traditionalRatingForm.controls[key]) {
      if (shouldDisable) {
        this.traditionalRatingForm.get(`${key}`)?.disable();
        this.traditionalRatingForm.get(`${key}`)?.reset(); // Limpia el valor cuando se desactiva
      } else {
        this.traditionalRatingForm.get(`${key}`)?.enable();
      }
    }
  }

  toggleQualificationMode(mode: TypeQualificationMode): void {
    if ((this.traditionalRatingForm.dirty && mode === TYPE_TYPOLOGY) ||
      (this.typologyRatingForm.dirty && mode === TYPE_TRADITIONAL) ||
      (this.typeCrud === 'UPDATE' && this.qualificationsConstruction.length > 0)) {
      this.warningQualificationDialog.fire().then((result) => {
        this.qualificationMode = mode;
        this.typologyRatingForm.reset();
        this.traditionalRatingForm.reset();
        if (this.qualificationsConstruction != null && this.qualificationsConstruction.length > 0) {
          this.qualificationsConstruction = [];
        }
      });
      return;
    }
    this.qualificationMode = mode;
  }

  onTypeSelectionChange(selectedType: any): void {
    if (!selectedType) {
      this.filteredBuiltUseOptions = this.allBuiltUseOptions;
      this.editForm.get('domBuiltUse')?.setValue(null); // Resetea el valor del uso
      return;
    }

    const selectedTypeDispname = selectedType; // Valor seleccionado
    this.filteredBuiltUseOptions = this.allBuiltUseOptions.filter((option) =>
      option.code.startsWith(selectedTypeDispname)
    );

    this.editForm.get('domBuiltUse')?.setValue(null); // Resetea el valor del uso
  }

  // Procesar valores del formulario
  private processFormValues(values: any): any {
    let value: ContentInformationConstruction = new ContentInformationConstruction(values);
    value.unitBuiltPrivateArea = this.validationsService.parseNumericValue(values.unitBuiltPrivateArea);
    value.unitBuiltArea = this.validationsService.parseNumericValue(values.unitBuiltArea);
    return value;
  }

  private fetchAllBuiltUseOptions(): void {
    this.collectionServicesService.getAllDataAllBuiltUseOptions(DOMAIN_NAME_BUILT_USE, true).subscribe({
      next: (data) => {
        this.allBuiltUseOptions = data;
        this.filteredBuiltUseOptions = data;
      },
      error: (err) => {
      }
    });
  }

  get validateUnitBuiltLabel() {
    return this.editForm.get('unitBuiltLabel') as FormControl;
  }

  get validateUnitBuiltFloors() {
    return this.editForm.get('unitBuiltFloors') as FormControl;
  }

  get validateUnitBuiltYear() {
    return this.editForm.get('unitBuiltYear') as FormControl;
  }

  get validateUnitBuiltPrivateArea() {
    return this.editForm.get('unitBuiltPrivateArea') as FormControl;
  }

  get validateUnitBuiltArea() {
    return this.editForm.get('unitBuiltArea') as FormControl;
  }

  get activeQualificationForm(): FormGroup {
    return this.qualificationMode === TYPE_TRADITIONAL ? this.traditionalRatingForm : this.typologyRatingForm;
  }

  getApiQualificationUrl(domain: string): string {
    return `${environment.getApiQualificationUrl}${domain}`;
  }

  createConstruction(executionId: string, baunitId: string, formValues: ContentInformationConstruction) {
    this.constructionsService.createConstruction(executionId, baunitId, formValues).subscribe({
      next: (result) => {
        this.constructionData = result;
        this.unitBuiltId = result?.unitBuiltId;
        this.toggleKitchenAndBathFields(this.constructionData?.domBuiltType);
        this.isCreateOrUpdateConstruction = true;
        this.successDialog.fire();
      },
      error: () => {
        this.isCreateOrUpdateConstruction = false;
        this.errorSaveDialog.fire();
      }
    });
  }

  updateConstruction(executionId: string, baunitId: string, formValues: ContentInformationConstruction) {
    this.constructionsService.updateConstruction(executionId, baunitId, formValues).subscribe({
      next: (result) => {
        this.constructionData = result;
        this.unitBuiltId = result?.unitBuiltId;
        this.toggleKitchenAndBathFields(this.constructionData?.domBuiltType);
        this.isCreateOrUpdateConstruction = true;
        this.successDialog.fire();
      },
      error: () => {
        this.isCreateOrUpdateConstruction = false;
        this.errorSaveDialog.fire();
      }
    });
  }

  // Cerrar el diálogo
  closedDialog(constructionData: ContentInformationConstruction | null) {
    this.dialogRef.close(constructionData);
  }

  indexArraylistQualifications = (obj: CcCalificacionUB[], value: string) => {
    if (obj != null && obj.length > 0) {
      return obj.reduce((acc: any, el: any) => ({
        ...acc,
        [el.ccCalUBDom[value]]: el
      }), []);
    }
  };

  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly CONSTANT_MSG_UNITBUILT_LABEL = CONSTANT_MSG_UNITBUILT_LABEL;
  protected readonly CONSTANT_MSG_UNITBUILT_YEAR = CONSTANT_MSG_UNITBUILT_YEAR;
  protected readonly CONSTANT_MSG_TYPE_AREA = CONSTANT_MSG_TYPE_AREA;
  protected readonly CONSTANT_MSG_ONLY_ONE_99 = CONSTANT_MSG_ONLY_ONE_99;
  protected readonly TYPE_TYPOLOGY = TYPE_TYPOLOGY;
  protected readonly TYPE_TRADITIONAL = TYPE_TRADITIONAL;
}
