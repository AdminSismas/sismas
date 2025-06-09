import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import {
  BasicInformationProperty,
  CrudBasicInformationProperty
} from 'src/app/apps/interfaces/information-property/basic-information-property';
import { ComboxColletionComponent } from '../../../general-components/combox-colletion/combox-colletion.component';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environments';
import {
  EditBasicPropertyInputs,
  TypeOperation
} from '../../../../interfaces/general/content-info';
import { TYPE_UPDATE_PROPERTY_UNIT } from '../../../../constants/general/constants';
import { InputComponent } from '../../../general-components/input/input.component';
import Swal from 'sweetalert2';
import { FluidMinHeightDirective } from '../../../../directives/fluid-min-height.directive';
import { FORM_INPUT_BASIC_PROPERTY } from '../../../../constants/information-property/basic-property-information.constants';
import { BaunitCondition } from 'src/app/apps/constants/general/constants';
import { Subscription } from 'rxjs';
import Big from 'big.js';

@Component({
  selector: 'vex-edit-basic-property-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ComboxColletionComponent,
    MatDatepickerModule,
    MatIconModule,
    InputComponent,
    FluidMinHeightDirective
  ],
  templateUrl: './edit-basic-property-information.component.html',
  styles: ``
})
export class EditBasicPropertyInformationComponent implements OnInit {
  executionId!: string;
  baunitIdE!: string;
  contentInformation: BasicInformationProperty | null = null;
  typeCategory = signal<TypeOperation>('UPDATE');

  public maxDate = new Date();
  public inputs: EditBasicPropertyInputs[] = FORM_INPUT_BASIC_PROPERTY;

  form: FormGroup = this.fb.group({
    // GRUPO "Identificación del predio"
    cadastralNumberFormat: ['', [Validators.required]],
    cadastralNumber: ['', [Validators.required]],
    cadastralLastNumber: ['', [Validators.min(0)]],
    propertyRegistryOffice: [''],
    propertyRegistryNumber: [''],
    baunitIdOrigin: [''],

    // *****GRUPO "Propiedad y uso" ****

    domBaunitEconoDesti: ['', [Validators.required]],
    domBaunitType: ['', [Validators.required]],
    domBaunitCondition: ['', [Validators.required]],
    cadastralCreatedAt: [''],
    cadastralRegistryNumberTemp: [''],

    // *****GRUPO "Tamaños y áreas" ****
    propertyRegistryArea: [''],
    cadastralArea: ['', [Validators.required, Validators.min(0)]],
    cadAreaCommon: [''],
    cadAreaPrivate: [''],
    cadastralAreaUnitbuilt: [''],
    cadAreaUnitbuiltCommon: [''],
    cadAreaUnitbuiltPrivate: [''],

    // *****GRUPO "Seguimientos y actualizaciones" ****

    cadastralLastEventAt: [''],
    cadastralLastEventCode: [''],
    updatedBy: [''],
    updatedAt: ['']
  });

  formDetailGroup: FormGroup = this.fb.group({
    buildNumber: [
      this.contentInformation?.detailGroup?.buildNumber || null,
      [Validators.required, Validators.min(0), Validators.max(99)]
    ],
    floorNumber: [
      this.contentInformation?.detailGroup?.floorNumber || null,
      [Validators.required, Validators.min(0), Validators.max(99)]
    ],
    unitNumber: [
      this.contentInformation?.detailGroup?.unitNumber || null,
      [Validators.required, Validators.min(0), Validators.max(9999)]
    ],
    percentageGroup: [
      this.contentInformation?.detailGroup?.percentage_group || null,
      [Validators.required, Validators.min(0), Validators.max(100)]
    ]
  });

  private readonly areasByBaunitConditions: Record<BaunitCondition, string[]> =
    {
      'Bien de uso público': [
        'propertyRegistryArea',
        'cadAreaPrivate',
        'cadAreaUnitbuiltPrivate'
      ],
      '(Condominio) Matriz': [
        'propertyRegistryArea',
        'cadAreaCommon',
        'cadAreaUnitbuiltCommon'
      ],
      '(Condominio) Unidad predial': [
        'propertyRegistryArea',
        'cadAreaPrivate',
        'cadAreaUnitbuiltPrivate'
      ],
      Informal: [
        'propertyRegistryArea',
        'cadAreaPrivate',
        'cadAreaUnitbuiltPrivate'
      ],
      Mejora: ['propertyRegistryArea', 'cadAreaUnitbuiltPrivate'],
      'No propiedad horizontal': [
        'propertyRegistryArea',
        'cadAreaPrivate',
        'cadAreaUnitbuiltPrivate'
      ],
      '(Parque cementerio) Matriz': [
        'propertyRegistryArea',
        'cadAreaCommon',
        'cadAreaUnitbuiltCommon'
      ],
      '(Parque Cementerio) Unidad predial': [
        'propertyRegistryArea',
        'cadAreaPrivate',
        'cadAreaUnitbuiltPrivate'
      ],
      '(Propiedad horizontal) Matriz': [
        'propertyRegistryArea',
        'cadAreaCommon',
        'cadAreaUnitbuiltCommon'
      ],
      '(Propiedad horizontal) Unidad Predial': [
        'propertyRegistryArea',
        'cadAreaUnitbuiltCommon'
      ],
      Vía: ['propertyRegistryArea', 'cadAreaPrivate', 'cadAreaUnitbuiltPrivate']
    };

  private areasEnabledByBaunitConditions: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataBasicInformationProperty: CrudBasicInformationProperty,
    private fb: FormBuilder,
    private informationPropertyService: InformationPropertyService,
    private dialogRef: MatDialogRef<EditBasicPropertyInformationComponent>
  ) {}

  ngOnInit(): void {
    this.contentInformation =
      this.dataBasicInformationProperty?.contentInformation;
    if (this.contentInformation?.executionId) {
      this.executionId = this.contentInformation?.executionId;
    }
    if (this.contentInformation?.baunitIdE) {
      this.baunitIdE = this.contentInformation?.baunitIdE;
    }
    this.typeCategory.set(this.dataBasicInformationProperty?.type);
    if (this.typeCategory() === TYPE_UPDATE_PROPERTY_UNIT) {
      this.chargerInfoPropertyUnit();
      return;
    }
    if (this.contentInformation?.domBaunitCondition) {
      this.areasEnabledByBaunitConditions = this.dataBasicInformationProperty
        .areaEdit
        ? this.areasByBaunitConditions[
            this.contentInformation.domBaunitCondition as BaunitCondition
          ]
        : [];
    }
    this.getReadyForm();
  }

  getReadyForm() {
    this.form.reset(this.contentInformation);
    const newCadastraCreatedAt = new Date(
      this.contentInformation?.cadastralCreatedAt + 'T00:00:00-05:00'
    );
    this.form.controls['cadastralCreatedAt'].setValue(newCadastraCreatedAt);
    const enableInputs: string[] = [
      'propertyRegistryOffice',
      'propertyRegistryNumber',
      'domBaunitEconoDesti',
      'domBaunitType',
      'cadastralCreatedAt',
      ...this.areasEnabledByBaunitConditions
    ];
    if (this.dataBasicInformationProperty.npnEdit) {
      enableInputs.push('cadastralNumber');
    }
    Object.keys(this.form.controls).forEach((field) => {
      if (!enableInputs.includes(field)) {
        this.form.get(field)?.disable();
      }
    });
    if (environment.titulo === 'Manizales') {
      this.form.get('propertyRegistryOffice')?.disable();
      this.form.get('propertyRegistryOffice')?.setValue('100');
    }

    this.createSumatoryEvents();
  }

  createSumatoryEvents() {
    const areasParametersName: (keyof BasicInformationProperty)[] = [
      'cadAreaCommon',
      'cadAreaPrivate',
      'cadAreaUnitbuiltCommon',
      'cadAreaUnitbuiltPrivate'
    ];
    areasParametersName.forEach((parameter) => {
      this.sumatoryEvent(parameter);
    });
  }

  sumatoryEvent(parameter: keyof BasicInformationProperty) {
    const subscription: Subscription | undefined = this.form
      .get(parameter)
      ?.valueChanges.subscribe({
        next: (value) => {
          let counterParameterName: keyof BasicInformationProperty;
          if (parameter.includes('Common')) {
            counterParameterName = parameter.replace(
              'Common',
              'Private'
            ) as keyof BasicInformationProperty;
          } else {
            counterParameterName = parameter.replace(
              'Private',
              'Common'
            ) as keyof BasicInformationProperty;
          }

          const areaValue = this.form.value[counterParameterName] || 0;
          const sum = +value + +areaValue;
          const totalAreaParameterName = this.sumatoryParameterName(parameter);

          this.form.get(totalAreaParameterName)?.setValue(sum);
        },
        complete: () => subscription?.unsubscribe()
      });
  }

  sumatoryParameterName(
    areaParameterName: keyof BasicInformationProperty
  ): 'cadastralArea' | 'cadastralAreaUnitbuilt' {
    if (
      areaParameterName === 'cadAreaCommon' ||
      areaParameterName === 'cadAreaPrivate'
    ) {
      return 'cadastralArea';
    }
    if (
      areaParameterName === 'cadAreaUnitbuiltCommon' ||
      areaParameterName === 'cadAreaUnitbuiltPrivate'
    ) {
      return 'cadastralAreaUnitbuilt';
    }

    return 'cadastralArea';
  }

  editBasicInformationProperty() {
    if (!this.executionId || !this.baunitIdE) {
      return;
    }
    let basicInformation!: BasicInformationProperty | null;
    if (this.typeCategory() === TYPE_UPDATE_PROPERTY_UNIT) {
      basicInformation = this.contentInformation;
      if (!basicInformation) {
        this.getAlertError(
          'Informacion no encontrada, consulte al administrador'
        );
        return;
      }
      this.updateInformationPropertyUnit(basicInformation);
    } else {
      this.updateInformationProperty(this.form.value);
    }
  }

  updateInformationProperty(obj: BasicInformationProperty) {
    if (!obj) {
      return;
    }
    this.informationPropertyService
      .updateBasicInformationProperty(this.executionId, this.baunitIdE, obj)
      .subscribe({
        next: (data: BasicInformationProperty) => {
          this.getAlertSuccess(
            'Se ha actualizado los aspectos generales del predio',
            data
          );
        }
      });
  }

  updateInformationPropertyUnit(obj: BasicInformationProperty) {
    if (!obj || !obj.detailGroup) {
      return;
    }
    const { percentageGroup, buildNumber, floorNumber, unitNumber } =
      this.formDetailGroup.value;
    if (!percentageGroup) {
      this.getAlertError('Valor de coeficiente de propiedad no encontrada');
      return;
    }

    if (!this.validationFormUnitEdit(buildNumber, floorNumber, unitNumber)) {
      this.getAlertError('Informacion no encontrada');
      return;
    }

    const percentageCoefficient: number = Big(percentageGroup).div(100).toNumber();
    if (percentageCoefficient <= 0) {
      this.getAlertError('Valor de coeficiente de propiedad no permitido');
      return;
    }

    obj.detailGroup.buildNumber = buildNumber;
    obj.detailGroup.floorNumber = floorNumber;
    obj.detailGroup.unitNumber = unitNumber;
    obj.detailGroup.percentage_group = percentageCoefficient;
    obj.detailGroup.percentageGroupS = percentageCoefficient.toString();
    this.informationPropertyService
      .updateBasicCoefficientInformationProperty(
        this.executionId,
        this.baunitIdE,
        obj
      )
      .subscribe({
        next: (data: BasicInformationProperty) => {
          this.getAlertSuccess(
            'Se ha actualizado los aspectos generales del predio',
            data
          );
        }
      });
  }

  validationFormUnitEdit(
    buildNumber: string,
    floorNumber: string,
    unitNumber: string
  ): boolean {
    if (
      unitNumber === undefined ||
      unitNumber === null ||
      buildNumber === undefined ||
      buildNumber === null ||
      floorNumber === undefined ||
      floorNumber === null
    ) return false;

    const numberCondition = this.contentInformation?.cadastralNumber?.slice(
      21,
      22
    );

    console.log(numberCondition);
    if (numberCondition === '8') {
      if (parseFloat(floorNumber) < 0 || parseFloat(unitNumber) < 0) {
        return false;
      }

      return true;
    }

    if (parseFloat(floorNumber) <= 0 || parseFloat(unitNumber) <= 0) {
      return false;
    }

    return true;
  }

  chargerInfoPropertyUnit() {
    if (!this.contentInformation?.detailGroup) {
      return;
    }

    if (
      this.contentInformation?.detailGroup?.percentage_group &&
      this.contentInformation?.detailGroup?.percentage_group !== 0
    ) {
      const coefficient: number =
        +Big(this.contentInformation?.detailGroup?.percentage_group).mul(100).toFixed(2);
      this.controlPercentageGroup.setValue(coefficient);
    }

    this.controlBuildNumber.setValue(
      this.contentInformation?.detailGroup?.buildNumber
    );
    this.controlFloorNumber.setValue(
      this.contentInformation?.detailGroup?.floorNumber
    );
    this.controlUnitNumber.setValue(
      this.contentInformation?.detailGroup?.unitNumber
    );
  }

  getAlertSuccess(text: string, data: BasicInformationProperty) {
    Swal.fire({
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    }).then(() => this.dialogRef.close(data));
  }

  getAlertError(text: string) {
    Swal.fire({
      title: '¡Error!',
      text: text,
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    }).then();
  }

  get activeTypeCategoryForm(): FormGroup {
    if (this.typeCategory() === TYPE_UPDATE_PROPERTY_UNIT) {
      return this.formDetailGroup;
    }
    return this.form;
  }

  get controlBuildNumber() {
    return this.formDetailGroup.get('buildNumber') as FormControl;
  }

  get controlFloorNumber() {
    return this.formDetailGroup.get('floorNumber') as FormControl;
  }

  get controlUnitNumber() {
    return this.formDetailGroup.get('unitNumber') as FormControl;
  }

  get controlPercentageGroup() {
    return this.formDetailGroup.get('percentageGroup') as FormControl;
  }

  protected readonly TYPE_UPDATE_PROPERTY_COEFFICIENT =
    TYPE_UPDATE_PROPERTY_UNIT;
}
