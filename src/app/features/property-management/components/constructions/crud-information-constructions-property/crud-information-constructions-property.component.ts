/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular framework
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
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
import { environment } from '@environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { CustomSelectorComponent } from '@shared/utils/custom-selector/custom-selector.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { CollectionServices } from '@shared/services';
import { CcCalificacionUB } from '@shared/interfaces';
import { TextAreaComponent } from '@shared/utils/text-area/text-area.component';
import {
  CONSTANT_MSG_ONLY_ONE_99,
  CONSTANT_MSG_TYPE_AREA,
  CONSTANT_MSG_UNITBUILT_LABEL,
  CONSTANT_MSG_UNITBUILT_YEAR
} from '../../../../../apps/constants/general/constantsAlertLabel';
import { GeneralValidationsService } from '@shared/services';
import {
  TypeOperation,
  TypeQualificationMode,
  ValidateQualificationByDomBuiltType
} from '@shared/interfaces';
import { CommonGeneralValidationsService } from '@shared/services';
import { InformationConstructionsService } from '@features/property-management/services';
import {
  validateIsNumber,
  validateVariable
} from '../../../../../apps/utils/general';
// Custom
import {
  DOMAIN_NAME_BUILT_USE,
  GUION,
  NAME_NO_DISPONIBLE,
  QUALIFICATIONS_DISABLE_BATH_KITCHEN_BY_DOMBUILTTYPE,
  QUALIFICATIONS_DOMBUILT_TYPE_ANEXX,
  TYPE_ANNEX,
  TYPE_CREATE,
  TYPE_TRADITIONAL,
  TYPE_TYPOLOGY
} from '@shared/constants';
import { DomainCollection } from '@shared/interfaces';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TypesQualificationUB } from 'src/app/apps/interfaces/information-property/types-qualification-ub';

@Component({
  selector: 'crud-information-constructions-property',
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
    // Custom
    CustomSelectorComponent,
    InputComponent,
    TextAreaComponent
  ],
  templateUrl: './crud-information-constructions-property.component.html',
  styleUrl: './crud-information-constructions-property.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudInformationConstructionsPropertyComponent implements OnInit {
  /* ---- Injects ---- */
  public readonly crudInformationData: CrudInformationConstruction | null =
    inject(MAT_DIALOG_DATA);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: MatDialogRef<CrudInformationConstructionsPropertyComponent> =
    inject(MatDialogRef<CrudInformationConstructionsPropertyComponent>);
  private readonly collectionServicesService: CollectionServices =
    inject(CollectionServices);
  private readonly constructionsService: InformationConstructionsService =
    inject(InformationConstructionsService);
  private readonly generalValidations: GeneralValidationsService = inject(
    GeneralValidationsService
  );
  private readonly validationsService: CommonGeneralValidationsService = inject(
    CommonGeneralValidationsService
  );

  /* ---- Properties ---- */
  private readonly urlBasic = `${environment.getApiQualificationUrl}`;
  private executionId: string | null | undefined;
  private baunitId: string | null | undefined;
  private schema = `${environment.schemas.temp}`;
  private unitBuiltId!: number | null | undefined; // ID de la construcción creada
  private typeCrud: TypeOperation | null = null;
  private allBuiltUseOptions: DomainCollection[] = [];
  private isCreateOrUpdateConstruction = false; // Estado de carga
  private constructionData: ContentInformationConstruction | null = null;
  private qualificationsConstruction: CcCalificacionUB[] = [];
  private mapQualificationsConstruction: any = null;
  public readonly api_domainName = `${environment.url_domain_name}`;

  /* ---- Signals ---- */
  public readonly haveToCreateConstruction = signal(true);
  public readonly annexUrl = signal('');
  public readonly qualificationMode = signal(TYPE_TRADITIONAL);
  public readonly filteredBuiltUseOptions = signal<DomainCollection[]>([]);

  /* ---- Forms ---- */
  editForm = signal<FormGroup>(this.fb.group({
    unitBuiltId: [
      this.crudInformationData?.contentInformation?.unitBuiltId ?? null
    ],
    domBuiltType: [
      this.crudInformationData?.contentInformation?.domBuiltType ?? null,
      Validators.required
    ],
    domBuiltUse: [
      this.crudInformationData?.contentInformation?.domBuiltUse ?? null,
      Validators.required
    ],
    unitBuiltLabel: [
      this.crudInformationData?.contentInformation?.unitBuiltLabel ?? null,
      [
        Validators.required,
        this.generalValidations.validateCapitalLettersOnly()
      ]
    ], // Solo letras mayúsculas
    unitBuiltFloors: [
      this.crudInformationData?.contentInformation?.unitBuiltFloors ?? null,
      [Validators.required, this.generalValidations.validateNumberMax99()]
    ], // Números del 1 al 99
    unitBuiltYear: [
      this.crudInformationData?.contentInformation?.unitBuiltYear ?? null,
      [
        Validators.required,
        this.generalValidations.validateYearBetween1900And2099(), // Años entre 1900 y 2099
        this.generalValidations.yearNotInFutureValidator()
      ]
    ], // Validación personalizada
    unitBuiltArea: [
      this.crudInformationData?.contentInformation?.unitBuiltArea ?? null,
      [
        Validators.required,
        Validators.min(0),
        this.generalValidations.validateOnlyNumber(),
        this.generalValidations.nonZeroValidator()
      ]
    ],
    unitBuiltPrivateArea: [
      this.crudInformationData?.contentInformation?.unitBuiltPrivateArea ??
        null,
      [
        Validators.required,
        this.generalValidations.validateOnlyNumber(), // Solo números
        // this.generalValidations.nonZeroValidator(), // Validación para que el área no sea 0
        this.generalValidations.privateAreaValidator('unitBuiltArea') // Validación para que no sea mayor al área total
      ]
    ],
    unitBuiltObservation: [
      this.crudInformationData?.contentInformation?.unitBuiltObservation ?? null
    ]
  }));
  traditionalRatingForm = signal<FormGroup>(this.fb.group({
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
    domTipologiaTipo: [null],
    industrialComplement: [null]
  }));
  typologyRatingForm = signal<FormGroup>(this.fb.group({
    domTipologiaTipo: [null, Validators.required]
  }));
  typeAnexxForm = signal<FormGroup>(this.fb.group({
    domTypeAnexx: [null, Validators.required]
  }));

  /* ---- Observables ---- */
  _useOptions$ = new ReplaySubject<boolean>(1);
  useOptions$ = this._useOptions$.asObservable();

  /* ---- ViewChild ---- */
  readonly stepper = viewChild.required<MatStepper>('stepper');
  readonly formError = viewChild.required<SwalComponent>('formError');
  readonly idError = viewChild.required<SwalComponent>('idError');
  readonly qualificationError = viewChild.required<SwalComponent>('qualificationError');
  readonly warningQualificationDialog = viewChild.required<SwalComponent>('warningQualificationDialog');
  readonly incompleteForm = viewChild.required<SwalComponent>('incompleteForm');
  readonly notFoundValues = viewChild.required<SwalComponent>('notFoundValues');
  readonly saveErrorDialog = viewChild.required<SwalComponent>('saveErrorDialog');
  readonly selectTypeError = viewChild.required<SwalComponent>('selectTypeError');
  readonly successQualificationType = viewChild.required<SwalComponent>('successQualificationType');
  readonly errorQualificationType = viewChild.required<SwalComponent>('errorQualificationType');
  readonly closeDialog = viewChild.required<SwalComponent>('closeDialog');
  private readonly successDialog = viewChild.required<SwalComponent>('successDialog');
  private readonly validationErrorDialog = viewChild.required<SwalComponent>('validationErrorDialog');
  private readonly calificationSuccessDialog = viewChild.required<SwalComponent>('calificationSuccessDialog');
  private readonly errorSaveDialog = viewChild.required<SwalComponent>('errorSaveDialog');

  ngOnInit(): void {
    this.typeCrud = this.crudInformationData?.type ?? TYPE_CREATE;
    this.haveToCreateConstruction.set(this.typeCrud === TYPE_CREATE);
    this.executionId =
      this.crudInformationData?.contentInformation?.executionId;
    this.baunitId = this.crudInformationData?.contentInformation?.baunitId;
    this.unitBuiltId =
      this.crudInformationData?.contentInformation?.unitBuiltId;

    if (
      !validateVariable(this.executionId) ||
      !validateVariable(this.baunitId)
    ) {
      return;
    }

    if (
      !this.crudInformationData ||
      !this.crudInformationData?.contentInformation ||
      this.typeCrud === 'DELETE'
    ) {
      this.fetchAllBuiltUseOptions();
      return;
    }

    this.fetchAllBuiltUseOptions();

    this.useOptions$.pipe(filter<boolean>(Boolean)).subscribe(() => {
      if (
        !this.crudInformationData ||
        !this.crudInformationData?.contentInformation
      ) {
        return;
      }

      if (this.typeCrud === 'UPDATE') {
        this.constructionData = this.crudInformationData?.contentInformation;
        if (
          this.constructionData != null &&
          this.crudInformationData?.contentInformation?.schema != null
        ) {
          this.schema = this.crudInformationData?.contentInformation?.schema;
        }
        this.changeDetailInformationConstruction(this.constructionData);
        this.getDetailQualificationConstruction(this.constructionData);
      }
    });

    if (this.typeCrud === TYPE_CREATE) {
      this.getIDConstructionsSuggestion();
    }
  }

  getIDConstructionsSuggestion() {
    if (!this.executionId || !this.baunitId) return;

    this.constructionsService
      .getIDConstructionsSuggestion(this.executionId, this.baunitId)
      .subscribe((id) => {
        this.editForm()?.get('unitBuiltLabel')?.setValue(id);
      });
  }

  initFormQualification(isIndustrialConstruction: boolean) {
    if (!isIndustrialConstruction) return;

    this.activeQualificationForm.controls['bathSize'].setValue(null);
    this.toggleBathroomFields(34);
    this.activeQualificationForm.controls['bathSize'].disable();

    this.activeQualificationForm.controls['kitchenSize'].setValue(null);
    this.toggleKitchenFields(49);
    this.activeQualificationForm.controls['kitchenSize'].disable();
  }

  resetConstructionAndQualification(): void {
    if (this.qualificationMode() === TYPE_TRADITIONAL) {
      this.traditionalRatingForm().reset();
    } else if (this.qualificationMode() === TYPE_TYPOLOGY) {
      this.typologyRatingForm().reset();
    } else {
      this.typeAnexxForm().reset();
    }
  }

  // Guardar calificación
  saveConstructionAndQualification(): void {
    if (this.qualificationMode() === TYPE_TRADITIONAL) {
      this.saveTraditionalRating();
    } else if (this.qualificationMode() === TYPE_TYPOLOGY) {
      this.saveTypologyQualification();
    } else {
      this.saveTypologyAnexx();
    }
  }

  saveTypologyQualification() {
    const selectedTypology =
      this.typologyRatingForm().get('domTipologiaTipo')?.value;
    if (!selectedTypology) {
      this.selectTypeError().fire();
      return;
    }
    this.successQualificationType().fire();
  }

  saveTraditionalRating() {
    if (
      this.traditionalRatingForm().invalid ||
      !this.executionId ||
      !this.baunitId ||
      !this.unitBuiltId
    ) {
      this.traditionalRatingForm().markAllAsTouched();
      this.incompleteForm().fire();
      return;
    }
    this.saveGeneralQualification(this.traditionalRatingForm().value);
  }

  saveTypologyAnexx() {
    if (
      this.typeAnexxForm().invalid ||
      !this.executionId ||
      !this.baunitId ||
      !this.unitBuiltId
    ) {
      this.typeAnexxForm().markAllAsTouched();
      this.incompleteForm().fire();
      return;
    }
    this.saveGeneralQualification(this.typeAnexxForm().value);
  }

  saveGeneralQualification(formValue: any) {
    if (!this.executionId || !this.baunitId || !this.unitBuiltId) {
      return;
    }
    try {
      const listQualification: CcCalificacionUB[] = Object.values(formValue)
        .filter((id): id is number => typeof id === 'number' && !isNaN(id))
        .map((id: number) => ({ ccCalUBDom: { id } }));
      if (!listQualification || listQualification.length === 0) {
        this.notFoundValues().fire();
        return;
      }
      this.constructionsService
        .updateQualification(
          this.executionId,
          this.baunitId,
          this.unitBuiltId,
          listQualification
        )
        .subscribe({
          next: () =>
            this.calificationSuccessDialog()
              .fire()
              .then(() => this.closedDialog(this.constructionData)),
          error: () => this.errorSaveDialog().fire()
        });
    } catch {
      this.saveErrorDialog().fire();
    }
  }

  // Guardar cambios
  saveConstruction(): void {
    if (this.isCreateOrUpdateConstruction) {
      return;
    }
    if (!this.editForm().valid) {
      this.validationErrorDialog().fire();
      return;
    }

    const formValues: ContentInformationConstruction = this.processFormValues(
      this.editForm()?.value
    );
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
    const currentStepIndex = this.stepper().selectedIndex;
    const qualificationStepIndex = 1;
    if (currentStepIndex === qualificationStepIndex) {
      this.closeDialog().fire().then((result) => {
        if (result.isConfirmed) {
          this.closedDialog(this.constructionData);
        }
      });
    } else {
      this.closedDialog(this.constructionData); // Cerrar directamente si no está en la sección de calificación
    }
  }

  changeDetailInformationConstruction(
    detailInformationConstruction: ContentInformationConstruction | null
  ) {
    if (detailInformationConstruction) {
      Object.entries(detailInformationConstruction).forEach(([key, value]) => {
        if (this.editForm().controls[key]) {
          this.editForm().controls[key].setValue(value);

          if (key === 'domBuiltType') {
            this.toggleKitchenAndBathFields(value);
            this.filteredBuiltUseOptions.set(
              this.allBuiltUseOptions.filter(
                (option: DomainCollection) =>
                  option?.code && option?.code.startsWith(value)
              )
            );
          } else if (key === 'domBuiltUse') {
            this.validateDomBuilTypeAnnex(value);
          }
        }
      });
    }
  }

  getDetailQualificationConstruction(
    detailInformationConstruction: ContentInformationConstruction | null
  ) {
    if (detailInformationConstruction) {
      const executionId = detailInformationConstruction.executionId ?? null;
      const baunitId = detailInformationConstruction.baunitId ?? null;
      const unitBuiltId = detailInformationConstruction.unitBuiltId ?? null;
      if (!executionId || !baunitId || !unitBuiltId) {
        return;
      }
      this.constructionsService
        .getQualificationConstructions(
          executionId,
          baunitId,
          unitBuiltId,
          this.schema
        )
        .subscribe((result: CcCalificacionUB[]) => {
          this.qualificationsConstruction = result;
          this.mapQualificationsConstruction =
            this.indexArraylistQualifications(
              this.qualificationsConstruction,
              'domain'
            );
          setTimeout(() => this.refreshTraditionalRatingForm(), 275);
        });
    }
  }

  refreshTraditionalRatingForm() {
    const idBath = this.chargeQualificationConstruction('Tamanio_Banio');
    const idKitchen = this.chargeQualificationConstruction('Tamanio_Cocina');

    this.typeAnexxForm.set(this.fb.group({
      domTypeAnexx: [this.chargeQualificationConstructionAnexx()]
    }));

    this.traditionalRatingForm.set(this.fb.group({
      structureFraming: [this.chargeQualificationConstruction('Armazon')],
      structureWalls: [this.chargeQualificationConstruction('Muros')],
      structureRoof: [this.chargeQualificationConstruction('Cubierta')],
      structureConservation: [
        this.chargeQualificationConstruction('Conservacion_Cubierta')
      ],
      finishesFacades: [this.chargeQualificationConstruction('Fachada')],
      finishesWalls: [
        this.chargeQualificationConstruction('Cubrimiento_Muros')
      ],
      finishesFloors: [this.chargeQualificationConstruction('Piso')],
      finishesConservation: [
        this.chargeQualificationConstruction('Conservacion_Acabados')
      ],
      bathSize: [idBath],
      bathEnchapes: [this.chargeQualificationConstruction('Enchape_Banio')],
      bathFurniture: [this.chargeQualificationConstruction('Mobiliario_Banio')],
      bathConservation: [
        this.chargeQualificationConstruction('Conservacion_Banio')
      ],
      kitchenSize: [idKitchen],
      kitchenEnchapes: [this.chargeQualificationConstruction('Enchape_Cocina')],
      kitchenFurniture: [
        this.chargeQualificationConstruction('Mobiliario_Cocina')
      ],
      kitchenConservation: [
        this.chargeQualificationConstruction('Conservacion_Cocina')
      ],
      domTipologiaTipo: [this.chargeQualificationConstruction('Tipologia')],
      industrialComplement: [
        this.chargeQualificationConstruction('Cerchas_Complemento_Industria')
      ]
    }));

    setTimeout(() => {
      if (idBath !== null && idBath !== undefined && idBath === 34) {
        this.toggleBathroomFields(idBath);
      }
      if (idKitchen !== null && idKitchen !== undefined && idKitchen === 49) {
        this.toggleKitchenFields(idKitchen);
      }
    }, 2500);

    this.editForm().valueChanges.subscribe(() => {
      this.isCreateOrUpdateConstruction = false;
    });
  }

  toggleBathroomFields(selectedValue: number): void {
    const shouldDisable: boolean = selectedValue === 34; // ID de "Sin_Baño"
    const fieldsToToggle = [
      'bathEnchapes',
      'bathFurniture',
      'bathConservation'
    ];
    fieldsToToggle.forEach((key: string) =>
      this.validateControlDisableOrEnableCustomSelect(key, shouldDisable)
    );
  }

  toggleKitchenFields(selectedValue: number): void {
    const shouldDisable = selectedValue === 49; // ID de "Sin_Cocina"
    const fieldsToToggle = [
      'kitchenEnchapes',
      'kitchenFurniture',
      'kitchenConservation'
    ];
    fieldsToToggle.forEach((key: string) =>
      this.validateControlDisableOrEnableCustomSelect(key, shouldDisable)
    );
  }

  chargeQualificationConstruction(domain: string) {
    let id: number | null = null;
    if (
      this.qualificationsConstruction &&
      this.qualificationsConstruction.length > 0 &&
      domain.length > 0 &&
      this.mapQualificationsConstruction !== null
    ) {
      try {
        id = this.mapQualificationsConstruction[domain]?.ccCalUBDom.id;
        if (validateIsNumber(id) && id !== null && id !== undefined && id > 0) {
          return id;
        }
      } catch {
        return null;
      }
    }
    return id;
  }

  chargeQualificationConstructionAnexx() {
    let id: number | null | undefined = null;
    if (
      this.qualificationsConstruction &&
      this.qualificationsConstruction.length === 1 &&
      this.mapQualificationsConstruction !== null
    ) {
      try {
        const qualification: CcCalificacionUB =
          this.qualificationsConstruction[0];
        if (qualification && qualification?.ccCalUBDom) {
          id = qualification.ccCalUBDom.id;
          if (validateIsNumber(id) && id && id > 0) {
            return id;
          }
        }
      } catch {
        return null;
      }
    }
    return id;
  }

  toggleKitchenAndBathFields(domBuiltType: string | null | undefined): void {
    if (validateVariable(domBuiltType)) {
      QUALIFICATIONS_DISABLE_BATH_KITCHEN_BY_DOMBUILTTYPE.forEach(
        (obj: ValidateQualificationByDomBuiltType) => {
          if (
            obj != null &&
            obj.list.length > 0 &&
            obj.domBuiltType === domBuiltType
          ) {
            obj.list.forEach((key: string) =>
              this.validateControlDisableOrEnableCustomSelect(
                key,
                obj.shouldDisable
              )
            );
          }
        }
      );
    }

    // Mostrar/ocultar campo de complemento industrial
    this.toggleIndustrialComplementField(domBuiltType);
  }

  validateControlDisableOrEnableCustomSelect(
    key: string,
    shouldDisable: boolean
  ) {
    if (this.traditionalRatingForm().controls[key]) {
      if (shouldDisable) {
        this.traditionalRatingForm().get(`${key}`)?.disable();
        this.traditionalRatingForm().get(`${key}`)?.reset(); // Limpia el valor cuando se desactiva
      } else {
        this.traditionalRatingForm().get(`${key}`)?.enable();
      }
    }
  }

  toggleQualificationMode(mode: TypeQualificationMode): void {
    if (
      (this.traditionalRatingForm().dirty && mode === TYPE_TYPOLOGY) ||
      (this.typologyRatingForm().dirty && mode === TYPE_TRADITIONAL) ||
      (this.typeCrud === 'UPDATE' && this.qualificationsConstruction.length > 0)
    ) {
      this.warningQualificationDialog().fire().then(() => {
        this.qualificationMode.set(mode);
        this.typologyRatingForm().reset();
        this.traditionalRatingForm().reset();
        if (
          this.qualificationsConstruction != null &&
          this.qualificationsConstruction.length > 0
        ) {
          this.qualificationsConstruction = [];
        }
      });
      return;
    }
    this.qualificationMode.set(mode);
  }

  onTypeSelectionChange(selectedType: any): void {
    if (!selectedType) {
      this.filteredBuiltUseOptions.set(this.allBuiltUseOptions);
      this.editForm().get('domBuiltUse')?.setValue(null); // Resetea el valor del uso
      return;
    }
    const selectedTypeDispname = selectedType; // Valor seleccionado
    this.filteredBuiltUseOptions.set(
      this.allBuiltUseOptions.filter(
        (option: DomainCollection) =>
          option?.code && option?.code.startsWith(selectedTypeDispname)
      )
    );
    this.editForm().get('domBuiltUse')?.setValue(null); // Resetea el valor del uso
  }

  validateDomBuilTypeAnnex(domBuiltUse: string | null) {
    let domBuiltType: string | null = null;
    if (domBuiltUse) {
      domBuiltType = this.editForm().get('domBuiltType')?.value;
      if (
        domBuiltType &&
        domBuiltType === QUALIFICATIONS_DOMBUILT_TYPE_ANEXX.domBuiltType
      ) {
        const list = this.allBuiltUseOptions.filter(
          (option: DomainCollection) =>
            domBuiltType &&
            domBuiltUse &&
            option?.code &&
            option?.code.startsWith(domBuiltType) &&
            option?.dispname === domBuiltUse
        );
        this.annexUrl.set(
          list.length >= 1 ? this.urlBasic + `${list[0].domainCode}` : ''
        );
        this.toggleQualificationMode(TYPE_ANNEX);
      }
    }
  }

  // Procesar valores del formulario
  private processFormValues(values: any): any {
    const value: ContentInformationConstruction =
      new ContentInformationConstruction(values);
    value.unitBuiltPrivateArea = this.validationsService.parseNumericValue(
      values.unitBuiltPrivateArea
    );
    value.unitBuiltArea = this.validationsService.parseNumericValue(
      values.unitBuiltArea
    );
    return value;
  }

  private fetchAllBuiltUseOptions(): void {
    this.collectionServicesService
      .getAllDataAllBuiltUseOptions(DOMAIN_NAME_BUILT_USE, true)
      .subscribe({
        next: (data: DomainCollection[]) => {
          this.allBuiltUseOptions = (data || []).map(
            (content: DomainCollection) => new DomainCollection(content)
          );
          this.filteredBuiltUseOptions.set(data);
          this._useOptions$.next(true);
        }
      });
  }

  get validateUnitBuiltLabel() {
    return this.editForm().get('unitBuiltLabel') as FormControl;
  }

  get validateUnitBuiltFloors() {
    return this.editForm().get('unitBuiltFloors') as FormControl;
  }

  get validateUnitBuiltYear() {
    return this.editForm().get('unitBuiltYear') as FormControl;
  }

  get validateUnitBuiltPrivateArea() {
    return this.editForm().get('unitBuiltPrivateArea') as FormControl;
  }

  get validateUnitBuiltArea() {
    return this.editForm().get('unitBuiltArea') as FormControl;
  }

  get activeQualificationForm(): FormGroup {
    if (this.qualificationMode() === TYPE_TRADITIONAL) {
      return this.traditionalRatingForm();
    } else if (this.qualificationMode() === TYPE_TYPOLOGY) {
      return this.typologyRatingForm();
    }
    return this.typeAnexxForm();
  }

  getApiQualificationUrl(domain: string): string {
    return `${this.urlBasic}${domain}`;
  }

  createConstruction(
    executionId: string,
    baunitId: string,
    formValues: ContentInformationConstruction
  ) {
    this.constructionsService
      .createConstruction(executionId, baunitId, formValues)
      .subscribe({
        next: (result) => {
          this.constructionData = result;
          this.haveToCreateConstruction.set(false);
          this.unitBuiltId = result?.unitBuiltId;
          this.toggleKitchenAndBathFields(this.constructionData?.domBuiltType);
          this.updateInformationKitchenAndBathFields();
          this.isCreateOrUpdateConstruction = true;
          this.successDialog().fire().then(() => this.stepper().next());
          this.initFormQualification(this.isIndustrialConstruction());
        },
        error: () => {
          this.isCreateOrUpdateConstruction = false;
          this.errorSaveDialog().fire();
          this.haveToCreateConstruction.set(true);
        }
      });
  }

  updateConstruction(
    executionId: string,
    baunitId: string,
    formValues: ContentInformationConstruction
  ) {
    this.constructionsService
      .updateConstruction(executionId, baunitId, formValues)
      .subscribe({
        next: (result) => {
          this.constructionData = result;
          this.unitBuiltId = result?.unitBuiltId;
          this.toggleKitchenAndBathFields(this.constructionData?.domBuiltType);
          this.updateInformationKitchenAndBathFields();
          this.isCreateOrUpdateConstruction = true;
          this.successDialog().fire().then(() => this.stepper().next());
          this.initFormQualification(this.isIndustrialConstruction());
        },
        error: () => {
          this.isCreateOrUpdateConstruction = false;
          this.errorSaveDialog().fire();
        }
      });
  }

  updateInformationKitchenAndBathFields() {
    this.traditionalRatingForm()
      .get('bathFurniture')
      ?.setValue(this.chargeQualificationConstruction('Mobiliario_Banio'));
    this.traditionalRatingForm()
      .get('kitchenFurniture')
      ?.setValue(this.chargeQualificationConstruction('Mobiliario_Cocina'));
  }

  // Cerrar el diálogo
  closedDialog(constructionData: ContentInformationConstruction | null) {
    this.dialogRef.close(constructionData);
  }

  indexArraylistQualifications(obj: CcCalificacionUB[], value: string) {
    if (obj !== null && obj.length > 0) {
      return obj.reduce((acc: CcCalificacionUB[], el: CcCalificacionUB) => {
        const key = el.ccCalUBDom![
          value as keyof TypesQualificationUB
        ] as string;
        return {
          ...acc,
          [key]: el
        };
      }, []);
    }
  }

  toggleIndustrialComplementField(
    domBuiltType: string | null | undefined
  ): void {
    const shouldShowIndustrialComplement = domBuiltType === 'Industrial';
    if (this.traditionalRatingForm().controls['industrialComplement']) {
      if (shouldShowIndustrialComplement) {
        this.traditionalRatingForm().get('industrialComplement')?.enable();
      } else {
        this.traditionalRatingForm().get('industrialComplement')?.disable();
        this.traditionalRatingForm().get('industrialComplement')?.setValue(null);
      }
    }
  }

  isIndustrialConstruction(): boolean {
    return this.editForm().get('domBuiltType')?.value === 'Industrial';
  }

  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly CONSTANT_MSG_UNITBUILT_LABEL =
    CONSTANT_MSG_UNITBUILT_LABEL;
  protected readonly CONSTANT_MSG_UNITBUILT_YEAR = CONSTANT_MSG_UNITBUILT_YEAR;
  protected readonly CONSTANT_MSG_TYPE_AREA = CONSTANT_MSG_TYPE_AREA;
  protected readonly CONSTANT_MSG_ONLY_ONE_99 = CONSTANT_MSG_ONLY_ONE_99;
  protected readonly TYPE_TYPOLOGY = TYPE_TYPOLOGY;
  protected readonly TYPE_TRADITIONAL = TYPE_TRADITIONAL;
  protected readonly TYPE_ANNEX = TYPE_ANNEX;
}
