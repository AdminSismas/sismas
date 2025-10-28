import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { DataAlfaMain } from '@shared/interfaces';
import { TypeOperationAlfaMain } from '@shared/interfaces';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { InputComponent } from 'src/app/apps/components/general-components/input/input.component';
import { ComboboxCollectionComponent } from 'src/app/apps/components/general-components/combobox-collection/combobox-collection.component';
import { DomainCollection } from '@shared/interfaces';
import {
  CONSTANT_TYPEDOMAIN_BAUNITCONDITION,
  CONSTANT_TYPEDOMAIN_DISPNAME_CO_,
  CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATRIZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PC_,
  CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATRIZ, CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PH_,
  CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATRIZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATZ,
  TYPE_OPERATION_ADD
} from '@shared/constants';
import { Operation } from '@shared/interfaces';
import { CollectionServices } from '@shared/services';
import Swal from 'sweetalert2';
import { BaunitHead } from '@shared/interfaces';
import {
  UnitPropertyInformationService
} from '@shared/services';

@Component({
  selector: 'vex-crud-property-units',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogClose,
    MatIconButton,
    MatIcon,
    MatDivider,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    InputComponent,
    ComboboxCollectionComponent
  ],
  templateUrl: './crud-property-units.component.html',
  styleUrl: './crud-property-units.component.scss'
})
export class CrudPropertyUnitsComponent implements OnInit {

  executionId!: string;
  baunitIdE!: string;
  baunitConditionOptions: DomainCollection[] = [];
  operationBaUnitHead: Operation | null = null;
  baunitHead: BaunitHead | null = null;

  typeCategory = signal<TypeOperationAlfaMain>('CREATE');

  formDetailGroup: FormGroup = this.fb.group({
    buildNumber: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
    floorNumber: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
    domBaunitCondition: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: DataAlfaMain,
    private fb: FormBuilder,
    private unitPropertyInformationService: UnitPropertyInformationService,
    private collectionServicesService: CollectionServices,
    private dialogRef: MatDialogRef<CrudPropertyUnitsComponent>) {
  }

  ngOnInit(): void {
    if (!this.defaults || !this.defaults?.executionId ||
      !this.defaults?.typeOperation || !this.defaults?.operationBaUnitHead ||
      !this.defaults?.operationBaUnitHead?.baunitHead ||
      !this.defaults?.operationBaUnitHead?.baunitHead?.baunitIdE) {
      return;
    }

    this.executionId = this.defaults.executionId;
    this.typeCategory.set(this.defaults?.typeOperation);

    if (this.typeCategory() !== TYPE_OPERATION_ADD) {
      this.dialogRef.close(null);
      return;
    }

    this.operationBaUnitHead = this.defaults?.operationBaUnitHead;
    this.baunitHead = this.defaults?.operationBaUnitHead?.baunitHead;
    this.obtainsCollectionsListUnitProperty();
  }

  obtainsCollectionsListUnitProperty() {
    this.collectionServicesService.getDataDomainName(CONSTANT_TYPEDOMAIN_BAUNITCONDITION)
      .subscribe((result: DomainCollection[]) => this.captureCollectionsListUnitProperty(result)
      );
  }

  captureCollectionsListUnitProperty(result: DomainCollection[]) {
    let data: DomainCollection[] = [];
    if (this.operationBaUnitHead && this.operationBaUnitHead.baunitHead) {
      const domBaunitCondition = this.operationBaUnitHead.baunitHead?.domBaunitCondition;
      if (domBaunitCondition === CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATRIZ) {
        data = result.filter(dm => dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PH_) && !dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATZ));
      } else if (domBaunitCondition === CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATRIZ) {
        data = result.filter(dm => dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_CO_) && !dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATZ));
      } else if (domBaunitCondition === CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATRIZ) {
        data = result.filter(dm => dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PC_) && !dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATZ));
      }
      this.baunitConditionOptions = data;
    }
  }

  addEditPropertyUnit() {
    if (!this.formDetailGroup.value || this.formDetailGroup.invalid) {
      return;
    }

    const {domBaunitCondition, buildNumber, floorNumber } = this.formDetailGroup.value;
    const baunitIdMaster = this.baunitHead?.baunitIdE;
    if (!baunitIdMaster) {
      return;
    }

    if (!domBaunitCondition) {
      this.getAlertError('Para poder continuar diligencie los campos obligatorios');
      return;
    }

    this.unitPropertyInformationService.createBaUnitCreateDetail(
      baunitIdMaster, this.executionId, domBaunitCondition, buildNumber, floorNumber).subscribe({
      next: () => {
        this.getAlertSuccess('Se ha creado una unidad predial al predio matriz: ' + baunitIdMaster, true);
      }
    });
  }

  getAlertSuccess(text: string, data: boolean) {
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

  get controlBuildNumber() {
    return this.formDetailGroup.get('buildNumber') as FormControl;
  }

  get controlFloorNumber() {
    return this.formDetailGroup.get('floorNumber') as FormControl;
  }

  protected readonly TYPE_OPERATION_ADD = TYPE_OPERATION_ADD;
}
