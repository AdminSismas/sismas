import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import {
  BasicInformationProperty,
  CrudBasicInformationProperty,
  UpdateBasicInformationProperty
} from 'src/app/apps/interfaces/information-property/basic-information-property';
import { ComboxColletionComponent } from '../../../general-components/combox-colletion/combox-colletion.component';
import {
  InformationPropertyService
} from 'src/app/apps/services/territorial-organization/information-property.service';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environments';
import { EditBasicPropertyInputs, TypeOperation } from '../../../../interfaces/general/content-info';
import { TYPE_UPDATE_PROPERTY_UNIT } from '../../../../constants/general/constants';
import { InputComponent } from '../../../general-components/input/input.component';
import Swal from 'sweetalert2';
import { FluidMinHeightDirective } from '../../../../directives/fluid-min-height.directive';

@Component({
  selector: 'vex-edit-basic-property-information',
  standalone: true,
  imports: [
    CommonModule,
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
  public inputs: EditBasicPropertyInputs[] = [
    // GRUPO "Identificación del predio"
    {
      groupName: 'Identificación del predio',
      fields: [
        {
          name: 'propertyRegistryOffice',
          label: 'Oficina de registro',
          collection: false,
          type: 'text',
          placeholder: 'Oficina de registro',
          group: '',
          groupName: 'Identificación del predio'
        },
        {
          name: 'propertyRegistryNumber',
          label: 'Número de registro',
          collection: false,
          type: 'text',
          placeholder: 'Número de registro',
          group: '',
          groupName: 'Identificación del predio'
        },

        {
          name: 'cadastralNumber',
          label: 'Número predial',
          collection: false,
          type: 'text',
          placeholder: 'Número predial',
          group: '',
          groupName: 'Identificación del predio'
        },
        {
          name: 'cadastralLastNumber',
          label: 'Número predial anterior',
          collection: false,
          type: 'number',
          placeholder: 'Número predial anterior',
          group: '',
          groupName: 'Identificación del predio'
        },
// *********** estos dos campo contituyen matricula inmobiliaria**********


// *********** estos dos campo contituyen matricula inmobiliaria**********
        {
          name: 'baunitIdOrigin',
          label: 'Nupre',
          collection: false,
          type: 'text',
          placeholder: 'Nupre',
          group: '',
          groupName: 'Identificación del predio'
        }
      ]
    },
    {
      groupName: 'Propiedad y uso',
      fields: [
        // *****GRUPO "Propiedad y uso" ****

        {
          // DEBE SER LISTA TIPO
          name: 'domBaunitEconoDesti',
          label: 'Destino económico',
          collection: true,
          type: 'BaunitEconoDesti',
          placeholder: 'Destino económico',
          group: '',
          groupName: 'Propiedad y uso'
        },
        // DEBE SER LISTA TIPO
        {
          name: 'domBaunitType',
          label: 'Tipo',
          collection: true,
          type: 'BaunitType',
          placeholder: 'Tipo',
          group: '',
          groupName: 'Propiedad y uso'
        },
        {
          // DEBE SER LISTA TIPO
          name: 'domBaunitCondition',
          label: 'Condición propiedad',
          collection: true,
          type: 'BaunitCondition',
          placeholder: 'Condición propiedad',
          group: '',
          groupName: 'Propiedad y uso'
        },
        {
          name: 'cadastralCreatedAt',
          label: 'Inscripción catastral',
          collection: false,
          type: 'date',
          placeholder: 'Inscripción catastral',
          group: '',
          groupName: 'Propiedad y uso'
        },
        {
          name: 'cadastralRegistryNumberTemp',
          label: 'Código homologado',
          collection: false,
          type: 'text',
          placeholder: 'Código homologado',
          group: '',
          groupName: 'Propiedad y uso'
        }
      ]
    },
    {
      groupName: 'Tamaños y áreas',
      fields: [
        // *****GRUPO "Tamaños y áreas" ****

        {
          name: 'propertyRegistryArea',
          label: 'Área registral',
          collection: false,
          type: 'text',
          placeholder: 'Área registral',
          group: '',
          groupName: 'Tamaños y áreas'
        },
        {
          name: 'cadastralArea',
          label: 'Área catastral',
          collection: false,
          type: 'text',
          placeholder: 'Área catastral',
          group: '',
          groupName: 'Tamaños y áreas'
        },
        {
          name: 'cadlAreaCommonE',
          label: 'Área catastral común',
          collection: false,
          type: 'text',
          placeholder: 'Área catastral común',
          group: '',
          groupName: 'Tamaños y áreas'
        },
        {
          name: 'cadAreaPrivate',
          label: 'Área catastral privada',
          collection: false,
          type: 'text',
          placeholder: 'Área catastral privada',
          group: '',
          groupName: 'Tamaños y áreas'
        },
        {
          name: 'cadastralAreaUnitbuilt',
          label: 'Área catastral construida',
          collection: false,
          type: 'text',
          placeholder: 'Área catastral construida',
          group: '',
          groupName: 'Tamaños y áreas'
        },
        {
          name: 'cadAreaUnitbuiltCommon',
          label: 'Área catastral construida común',
          collection: false,
          type: 'text',
          placeholder: 'Área catastral construida común',
          group: '',
          groupName: 'Tamaños y áreas'
        },
        {
          name: 'cadAreaUnitbuiltPrivate',
          label: 'Área catastral construida Privada',
          collection: false,
          type: 'text',
          placeholder: 'Área catastral construida Privada',
          group: '',
          groupName: 'Tamaños y áreas'
        }
      ]
    }

  ];

  form: FormGroup = this.fb.group({
    // GRUPO "Identificación del predio"
    'cadastralNumberFormat': ['', [Validators.required]],
    'cadastralNumber': ['', [Validators.required]],
    'cadastralLastNumber': ['', [Validators.min(0)]],
    'propertyRegistryOffice': [''],
    'propertyRegistryNumber': [''],
    'baunitIdOrigin': [''],

    // *****GRUPO "Propiedad y uso" ****

    'domBaunitEconoDesti': ['', [Validators.required]],
    'domBaunitType': ['', [Validators.required]],
    'domBaunitCondition': ['', [Validators.required]],
    'cadastralCreatedAt': [''],
    'cadastralRegistryNumberTemp': [''],

    // *****GRUPO "Tamaños y áreas" ****
    'propertyRegistryArea': [''],
    'cadastralArea': ['', [Validators.required, Validators.min(0)]],
    'cadlAreaCommonE': [''],
    'cadAreaPrivate': [''],
    'cadastralAreaUnitbuilt': [''],
    'cadAreaUnitbuiltCommon': [''],
    'cadAreaUnitbuiltPrivate': [''],

    // *****GRUPO "Seguimientos y actualizaciones" ****

    'cadastralLastEventAt': [''],
    'cadastralLastEventCode': [''],
    'updatedBy': [''],
    'updatedAt': ['']

  });

  formDetailGroup: FormGroup = this.fb.group({
    buildNumber: [this.contentInformation?.detailGroup?.buildNumber || null, [Validators.required, Validators.min(0), Validators.max(99)]],
    floorNumber: [this.contentInformation?.detailGroup?.floorNumber || null, [Validators.required, Validators.min(0), Validators.max(99)]],
    unitNumber: [this.contentInformation?.detailGroup?.unitNumber || null, [Validators.required, Validators.min(0), Validators.max(9999)]],
    percentageGroup: [this.contentInformation?.detailGroup?.percentage_group || null, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataBasicInformationProperty: CrudBasicInformationProperty,
    private fb: FormBuilder,
    private informationPropretyService: InformationPropertyService,
    private dialogRef: MatDialogRef<EditBasicPropertyInformationComponent>) {
  }

  ngOnInit(): void {
    this.contentInformation = this.dataBasicInformationProperty?.contentInformation;
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

    this.form.reset(this.contentInformation);
    const newCadastraCreatedAt = new Date(this.contentInformation?.cadastralCreatedAt + 'T00:00:00-05:00');
    this.form.controls['cadastralCreatedAt'].setValue(newCadastraCreatedAt);
    const enableInputs: string[] = [
      'propertyRegistryOffice',
      'propertyRegistryNumber',
      'domBaunitEconoDesti',
      'domBaunitType',
      'cadastralCreatedAt',
      'cadAreaPrivate',
      'propertyRegistryArea',
      'cadastralArea'
    ];
    Object.keys(this.form.controls).forEach(field => {
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
        this.getAlertError('Informacion no encontrada, consulte al administrador');
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
    this.informationPropretyService.updateBasicInformationProperty(
      this.executionId, this.baunitIdE, obj).subscribe({
      next: (data: BasicInformationProperty) => {
        this.getAlertSuccess('Se ha actualizado los aspectos generales del predio', data);
      }
    });
  }

  updateInformationPropertyUnit(obj: BasicInformationProperty) {
    if (!obj || !obj.detailGroup) {
      return;
    }
    const { percentageGroup, buildNumber, floorNumber, unitNumber } = this.formDetailGroup.value;
    if (!percentageGroup) {
      this.getAlertError('Informacion no encontrada, consulte al administrador');
      return;
    }
    const percentageCoefficient: number = (parseFloat(percentageGroup) / 100);
    if (percentageCoefficient <= 0) {
      this.getAlertError('Valor de coeficiente de propiedad no permitido');
      return;
    }

    obj.detailGroup.buildNumber = buildNumber;
    obj.detailGroup.floorNumber = floorNumber;
    obj.detailGroup.unitNumber = unitNumber;
    obj.detailGroup.percentage_group = percentageCoefficient;
    obj.detailGroup.percentageGroupS = percentageCoefficient.toString();
    this.informationPropretyService.updateBasicCoefficientInformationProperty(
      this.executionId, this.baunitIdE, obj).subscribe({
      next: (data: BasicInformationProperty) => {
        this.getAlertSuccess('Se ha actualizado los aspectos generales del predio', data);
      }
    });
  }

  chargerInfoPropertyUnit() {
    if (!this.contentInformation?.detailGroup || !this.contentInformation?.detailGroup?.percentage_group) {
      return;
    }
    let coefficient: number = (this.contentInformation?.detailGroup?.percentage_group * 100);
    this.controlPercentageGroup.setValue(coefficient);
    this.controlBuildNumber.setValue(this.contentInformation?.detailGroup?.buildNumber);
    this.controlFloorNumber.setValue(this.contentInformation?.detailGroup?.floorNumber);
    this.controlUnitNumber.setValue(this.contentInformation?.detailGroup?.unitNumber);
  }

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

  protected readonly TYPE_UPDATE_PROPERTY_COEFFICIENT = TYPE_UPDATE_PROPERTY_UNIT;
}
