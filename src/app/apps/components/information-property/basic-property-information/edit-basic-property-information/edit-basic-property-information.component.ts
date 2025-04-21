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
  MatDialogClose,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import {
  BasicInformationProperty,
  CrudBasicInformationProperty,
  UpdateBasicInformationProperty
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

enum BaunitCondition {
  'Bien de uso público' = 'Bien de uso público',
  '(Condominio) Matriz' = '(Condominio) Matriz',
  '(Condominio) Unidad predial' = '(Condominio) Unidad predial',
  'Informal' = 'Informal',
  'Mejora' = 'Mejora',
  'No propiedad horizontal' = 'No propiedad horizontal',
  '(Parque cementerio) Matriz' = '(Parque cementerio) Matriz',
  '(Parque Cementerio) Unidad predial' = '(Parque Cementerio) Unidad predial',
  '(Propiedad horizontal) Matriz' = '(Propiedad horizontal) Matriz',
  '(Propiedad horizontal) Unidad Predial' = '(Propiedad horizontal) Unidad Predial',
  'Vía' = 'Vía'
}

@Component({
  selector: 'vex-edit-basic-property-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatDialogClose,
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
    private informationPropretyService: InformationPropertyService,
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
      this.areasEnabledByBaunitConditions =
        this.areasByBaunitConditions[
          this.contentInformation.domBaunitCondition as BaunitCondition
        ];
    }
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
    Object.keys(this.form.controls).forEach((field) => {
      if (!enableInputs.includes(field)) {
        this.form.get(field)?.disable();
      }
    });
    if (environment.titulo === 'Manizales') {
      this.form.get('propertyRegistryOffice')?.disable();
      this.form.get('propertyRegistryOffice')?.setValue('100');
    }
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

  updateInformationProperty(obj: UpdateBasicInformationProperty) {
    if (!obj) {
      return;
    }
    this.informationPropretyService
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
      this.getAlertError(
        'Informacion no encontrada, consulte al administrador'
      );
      return;
    }
    const percentageCoefficient: number = parseFloat(percentageGroup) / 100;
    if (percentageCoefficient <= 0) {
      this.getAlertError('Valor de coeficiente de propiedad no permitido');
      return;
    }

    obj.detailGroup.buildNumber = buildNumber;
    obj.detailGroup.floorNumber = floorNumber;
    obj.detailGroup.unitNumber = unitNumber;
    obj.detailGroup.percentage_group = percentageCoefficient;
    obj.detailGroup.percentageGroupS = percentageCoefficient.toString();
    this.informationPropretyService
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

  chargerInfoPropertyUnit() {
    if (
      !this.contentInformation?.detailGroup ||
      !this.contentInformation?.detailGroup?.percentage_group
    ) {
      return;
    }
    const coefficient: number =
      this.contentInformation?.detailGroup?.percentage_group * 100;
    this.controlPercentageGroup.setValue(coefficient);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAlertSuccess(text: string, data: any) {
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
