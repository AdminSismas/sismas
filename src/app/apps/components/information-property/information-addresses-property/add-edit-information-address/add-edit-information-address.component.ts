/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  CREATE_BASIC_MODEL_ADDRESS,
  DETAIL_BASIC_MODEL_ADDRESS,
  GUION,
  NAME_NO_DISPONIBLE,
  PROCESO_ACTUALIZAR_DIRECCION,
  PROCESO_CREAR_DIRECCION,
  TYPE_CREATE
} from '@shared/constants';
import { environment } from 'src/environments/environments';
import {
  InformationPropertyService
} from 'src/app/apps/services/territorial-organization/information-property.service';
import {
  AddEditInformationDataI,
  CreateBasicInformationAddress,
  DetailBasicInformationAddress
} from 'src/app/apps/interfaces/information-property/detail-basic-information-address';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TypeOperation } from '@shared/interfaces';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { validateVariable } from '../../../../utils/general';
import { BasicInformationAddress } from '@shared/interfaces';
import { GeneralValidationsService } from '@shared/services';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComboboxCollectionComponent } from '@shared/utils/combobox-collection/combobox-collection.component';
import { InputComponent } from '@shared/ui/input/input.component';import {
  HeaderCadastralInformationPropertyComponent
} from 'src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { TextAreaComponent } from 'src/app/apps/components/general-components/text-area/text-area.component';
import {
  ComboboxCollectionFormComponent
} from '@shared/utils/combobox-collection-form/combobox-collection-form.component';

@Component({
  selector: 'vex-edit-information-address',
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
    ComboboxCollectionComponent,
    InputComponent,
    HeaderCadastralInformationPropertyComponent,
    TextAreaComponent,
    ComboboxCollectionFormComponent
  ],
  templateUrl: './add-edit-information-address.component.html',
  styleUrl: './add-edit-information-address.component.scss'
})
export class AddEditInformationAddressComponent implements OnInit, AfterViewInit {

  public procesoActual: string = PROCESO_CREAR_DIRECCION;

  typeCrud: TypeOperation | null = null;
  executionId: string | null | undefined;
  baUnitId: string | null | undefined;
  direccionId: string | null | undefined;
  informationAddressData: BasicInformationAddress | null = null;
  formExpanded = true;
  isCreateOrUpdateAddress = false;// Estado de carga

  schema = signal<string>(`${environment.schemas.temp}`);
  detailBasicInformation = signal<DetailBasicInformationAddress | null>(null);

  editForm: FormGroup = this.fb.group({
    domTipoDireccion: [null, [Validators.required]],
    codigoPostal: [null, [Validators.required, this.generalValidations.onlyNumber()]],
    nombrePredio: [null, [Validators.required, this.generalValidations.textAddressValidator()]],
    esDireccionPrincipal: [false, [Validators.required]],
    direccionTexto: [null, [Validators.required, this.generalValidations.textAddressValidator()]],
    domClaseViaPrincipal: [null, [Validators.required]],
    letraViaPrincipal: [null, [this.generalValidations.onlyLetters()]], // Solo letras
    valorViaPrincipal: [null, [Validators.required, this.generalValidations.onlyNumber()]], // Solo números
    domSectorCiudad: [null, []], // Aquí solo una validación básica de requerido
    valorViaGeneradora: [null, [Validators.required, this.generalValidations.onlyNumber()]],
    numeroPredio: [null, [Validators.required, this.generalValidations.onlyNumber()]],
    letraViaGeneradora: [null, [this.generalValidations.onlyLetters()]],
    domSectorPredio: [null, []]
  });

  @ViewChild('successDialog') private successDialog!: SwalComponent;
  @ViewChild('successCreate', { static: true }) successCreate!: SwalComponent;
  @ViewChild('errorSaveDialog') private errorSaveDialog!: SwalComponent;
  @ViewChild('validationErrorDialog') private validationErrorDialog!: SwalComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public addEditInformationData: AddEditInformationDataI | null,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditInformationAddressComponent>,
    private generalValidations: GeneralValidationsService,
    private informationPropertyService: InformationPropertyService
  ) {
  }

  ngOnInit(): void {
    this.typeCrud = this.addEditInformationData?.type || TYPE_CREATE;
    this.executionId = this.addEditInformationData?.basicInformationAddress?.executionId;
    this.baUnitId = this.addEditInformationData?.basicInformationAddress?.baunitId;
    this.direccionId = this.addEditInformationData?.basicInformationAddress?.direccionId;

    if (!validateVariable(this.executionId) || !validateVariable(this.baUnitId) ||
      !this.addEditInformationData ||
      !this.addEditInformationData?.basicInformationAddress ||
      this.typeCrud === 'DELETE') {
      return;
    }

    if (this.typeCrud === 'UPDATE') {
      this.procesoActual = PROCESO_ACTUALIZAR_DIRECCION;
      this.informationAddressData = this.addEditInformationData?.basicInformationAddress;
      if (this.informationAddressData?.schema) {
        this.schema.set(this.informationAddressData?.schema);
      }
      this.changeDetailBasicInformationAddress(this.informationAddressData);
      this.loadDetailInformationAddress(this.informationAddressData);
    }

    this.blockPrimaryAddressField();
    this.editForm.valueChanges.subscribe(() => {
      this.isCreateOrUpdateAddress = false;
    });

    this.mainAddress?.setValue?.(false);//VALOR por defecto
    this.complemento?.disable();//VALOR por defecto

    this.editForm.get('domTipoDireccion')?.valueChanges.subscribe(value => {
      this.validateTypeAddress(value);
    });
  }

  ngAfterViewInit(): void {
    if (this.addEditInformationData?.type === 'CREATE') {
      const names: string[] = ['direccionId'];
      names.forEach((name: string) => {
        if (this.editForm.controls[name]) {
          this.editForm.controls[name].clearValidators();
          this.editForm.controls[name].updateValueAndValidity();
        }
      });
    }
  }

  loadDetailInformationAddress(basicInformationAddress: BasicInformationAddress) {
    if (!basicInformationAddress) {
      return;
    }
    const { direccionId, baunitId, schema, executionId } = basicInformationAddress;
    if (!executionId || !baunitId || !direccionId || !schema) {
      return;
    }
    this.informationPropertyService.getDetailBasicInformationPropertyAddresses(direccionId, schema, baunitId, executionId)
      .subscribe((result: DetailBasicInformationAddress) => {
        this.detailBasicInformation.set(result);
        this.changeDetailBasicInformationPropertyAddresses(result);
      });
  }

  saveInformationAddress() {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      this.validationErrorDialog.fire();
      return;
    }

    if (this.addEditInformationData?.type === 'CREATE') {
      this.createAddress();
      return;
    }
    this.updateAddress();
  }

  createAddress() {
    if (!this.baUnitId || !this.executionId) {
      return;
    }
    this.blockPrimaryAddressField();
    const value = this.editForm.value || {};
    let createBasicInformationAddress: CreateBasicInformationAddress = CREATE_BASIC_MODEL_ADDRESS;
    if (value?.domTipoDireccion === 'Estructurada') {
      createBasicInformationAddress = this.filterValueAddressStructured(value);
    } else if (value?.domTipoDireccion === 'No estructurada') {
      createBasicInformationAddress = this.filterValueAddressDontStructured();
    }
    createBasicInformationAddress.domTipoDireccion = value?.domTipoDireccion;
    createBasicInformationAddress.esDireccionPrincipal = this.mainAddress?.value;
    createBasicInformationAddress.codigoPostal = value?.codigoPostal;
    createBasicInformationAddress.nombrePredio = value?.nombrePredio;
    createBasicInformationAddress.complemento = '';
    this.informationPropertyService.createBasicInformationPropertyAddress(
      this.baUnitId, this.schema(), this.executionId, createBasicInformationAddress)
      .subscribe({
        next: (result: DetailBasicInformationAddress) => {
          this.detailBasicInformation.set(result);
          this.direccionId = result?.direccionId;
          this.isCreateOrUpdateAddress = true;
          this.closeSuccessDialog(this.detailBasicInformation());
        },
        error: () => {
          this.isCreateOrUpdateAddress = false;
          this.errorSaveDialog.fire();
        }
      });
  }

  updateAddress() {
    if (!this.baUnitId || !this.executionId) {
      return;
    }

    const direccionId = this.informationAddressData?.direccionId;
    this.blockPrimaryAddressField();
    const value = this.editForm.value || {};
    let detailBasicInformationAddress: DetailBasicInformationAddress = DETAIL_BASIC_MODEL_ADDRESS;
    if (value?.domTipoDireccion === 'Estructurada') {
      detailBasicInformationAddress = this.filterValueAddressStructuredModel(value);
    } else if (value?.domTipoDireccion === 'No estructurada') {
      detailBasicInformationAddress = this.filterValueAddressDontStructuredModel(value);
    }
    detailBasicInformationAddress.domTipoDireccion = value?.domTipoDireccion;
    detailBasicInformationAddress.esDireccionPrincipal = this.mainAddress?.value;
    detailBasicInformationAddress.codigoPostal = value?.codigoPostal;
    detailBasicInformationAddress.nombrePredio = value?.nombrePredio;
    detailBasicInformationAddress.complemento = '';
    detailBasicInformationAddress.direccionId = direccionId;
    this.informationPropertyService.updateBasicInformationPropertyAddress(
      this.baUnitId, this.schema(), this.executionId, detailBasicInformationAddress)
      .subscribe({
        next: (result: DetailBasicInformationAddress) => {
          this.detailBasicInformation.set(result);
          this.direccionId = result?.direccionId;
          this.isCreateOrUpdateAddress = true;
          this.closeSuccessDialog(this.detailBasicInformation());
        },
        error: () => {
          this.isCreateOrUpdateAddress = false;
          this.errorSaveDialog.fire();
        }
      });
  }

  blockPrimaryAddressField() {
    if (this.addEditInformationData?.hasMainAddress) {
      if (this.addEditInformationData &&
        (this.addEditInformationData?.basicInformationAddress &&
          this.addEditInformationData?.basicInformationAddress?.esDireccionPrincipal === true)) {
        this.mainAddress?.enable();
      } else if (this.addEditInformationData?.basicInformationAddress &&
        this.addEditInformationData?.basicInformationAddress?.esDireccionPrincipal === false) {
        this.mainAddress?.disable();
        this.mainAddress?.setValue(false);//VALOR por defecto
      } else {
        this.mainAddress?.disable();
        this.mainAddress?.setValue(false);//VALOR por defecto
      }
    } else {
      this.mainAddress?.enable();
    }
  }

  validateTypeAddress(value: string) {
    if (value === 'Estructurada') {
      // Direccion no estructurada
      this.editForm.get('direccionTexto')?.disable();
      this.editForm.get('direccionTexto')?.reset();

      // Principal
      this.editForm.get('domClaseViaPrincipal')?.enable();
      this.editForm.get('letraViaPrincipal')?.enable();
      this.editForm.get('valorViaPrincipal')?.enable();
      this.editForm.get('domSectorCiudad')?.enable();
      // Generadora
      this.editForm.get('valorViaGeneradora')?.enable();
      this.editForm.get('numeroPredio')?.enable();
      this.editForm.get('letraViaGeneradora')?.enable();
      this.editForm.get('domSectorPredio')?.enable();
      this.formExpanded = true;
      return;
    }

    if (value === 'No estructurada') {
      // ISSU direcciones
      // Direccion no estructurada
      this.editForm.get('direccionTexto')?.enable();
      // Principal
      this.editForm.get('domClaseViaPrincipal')?.disable();
      this.editForm.get('letraViaPrincipal')?.disable();
      this.editForm.get('valorViaPrincipal')?.disable();
      this.editForm.get('domSectorCiudad')?.disable();

      this.editForm.get('domClaseViaPrincipal')?.reset();
      this.editForm.get('letraViaPrincipal')?.reset();
      this.editForm.get('valorViaPrincipal')?.reset();
      this.editForm.get('domSectorCiudad')?.reset();
      // Generadora
      this.editForm.get('valorViaGeneradora')?.disable();
      this.editForm.get('numeroPredio')?.disable();
      this.editForm.get('letraViaGeneradora')?.disable();
      this.editForm.get('domSectorPredio')?.disable();
      this.editForm.get('valorViaGeneradora')?.reset();
      this.editForm.get('numeroPredio')?.reset();
      this.editForm.get('letraViaGeneradora')?.reset();
      this.editForm.get('domSectorPredio')?.reset();
      // ISSU direcciones
      this.formExpanded = false;
      return;
    }

    // Se habilitan todos los campos
    this.editForm.get('direccionTexto')?.enable();
    // Principal
    this.editForm.get('domClaseViaPrincipal')?.enable();
    this.editForm.get('letraViaPrincipal')?.enable();
    this.editForm.get('valorViaPrincipal')?.enable();
    this.editForm.get('domSectorCiudad')?.enable();
    // Generadora
    this.editForm.get('valorViaGeneradora')?.enable();
    this.editForm.get('numeroPredio')?.enable();
    this.editForm.get('letraViaGeneradora')?.enable();
    this.editForm.get('domSectorPredio')?.enable();
    this.formExpanded = true;
  }

  filterValueAddressStructuredModel(value: any): DetailBasicInformationAddress {
    return {
      // campos BASE
      domTipoDireccion: '',
      esDireccionPrincipal: false,
      codigoPostal: '',
      nombrePredio: '',
      // PRINCIPAL
      domClaseViaPrincipal: value?.domClaseViaPrincipal,
      letraViaPrincipal: value?.letraViaPrincipal,
      valorViaPrincipal: value?.valorViaPrincipal,
      domSectorCiudad: value?.valorViaPrincipal,
      // GENERADORA
      letraViaGeneradora: value?.letraViaGeneradora,
      valorViaGeneradora: value?.valorViaGeneradora,
      complemento: value?.complemento,
      domSectorPredio: value?.domSectorPredio,
      numeroPredio: value?.numeroPredio,
      // campo bloqueado
      direccionTexto: ''
    };
  }

  filterValueAddressDontStructuredModel(value: any): DetailBasicInformationAddress {
    return {
      // campos BASE Informacion permanente
      domTipoDireccion: '',
      esDireccionPrincipal: false,
      codigoPostal: '',
      nombrePredio: '',
      // PRINCIPAL // campo bloqueado
      domClaseViaPrincipal: '',
      letraViaPrincipal: '',
      valorViaPrincipal: '',
      domSectorCiudad: '',
      // GENERADORA // campo bloqueado
      letraViaGeneradora: '',
      valorViaGeneradora: '',
      complemento: '',
      numeroPredio: '',
      domSectorPredio: '',
      direccionTexto: value?.direccionTexto
    };
  }

  filterValueAddressDontStructured(): CreateBasicInformationAddress {
    const address: CreateBasicInformationAddress = CREATE_BASIC_MODEL_ADDRESS;

    return address;
  }

  filterValueAddressStructured(value: any): CreateBasicInformationAddress {
    return {
      domTipoDireccion: '',
      esDireccionPrincipal: false,
      codigoPostal: '',
      nombrePredio: '',
      domClaseViaPrincipal: value?.domClaseViaPrincipal,
      letraViaPrincipal: value?.letraViaPrincipal,
      valorViaPrincipal: value?.valorViaPrincipal,
      domSectorCiudad: value?.valorViaPrincipal,
      letraViaGeneradora: value?.letraViaGeneradora,
      valorViaGeneradora: value?.valorViaGeneradora,
      complemento: value?.complemento,
      numeroPredio: value?.numeroPredio,
      domSectorPredio: value?.domSectorPredio,
      direccionTexto: ''
    };
  }

  changeDetailBasicInformationAddress(basicInformationAddress: BasicInformationAddress | null) {
    if (basicInformationAddress) {
      this.chargeInfoUpdate(basicInformationAddress);
    }
  }

  changeDetailBasicInformationPropertyAddresses(detailBasicInformationAddress: DetailBasicInformationAddress | null) {
    if (detailBasicInformationAddress) {
      this.chargeInfoUpdate(detailBasicInformationAddress);
    }
  }

  chargeInfoUpdate(object:any){
    Object.entries(object).forEach(([key, value]) => {
      if (this.editForm.controls[key]) {
        this.editForm.controls[key].setValue(value);
      }
    });
  }

  closeSuccessDialog(result: DetailBasicInformationAddress | null) {
    this.successDialog.fire().then(() => {
      this.closedDialog(result);
    });
  }

  closedDialog(dataInformation: DetailBasicInformationAddress | null) {
    this.dialogRef.close(dataInformation);
  }

  get controlLetterViaPrincipal() {
    return this.editForm.get('letraViaPrincipal') as FormControl;
  }

  get controlValueViaPrincipal() {
    return this.editForm.get('valorViaPrincipal') as FormControl;
  }

  get controlValueViaGeneradora() {
    return this.editForm.get('valorViaGeneradora') as FormControl;
  }

  get controlLetterViaGeneradora() {
    return this.editForm.get('letraViaGeneradora') as FormControl;
  }

  get controlNumberProperties() {
    return this.editForm.get('numeroPredio') as FormControl;
  }

  get controlNameProperties() {
    return this.editForm.get('nombrePredio') as FormControl;
  }

  get controlTextAddress() {
    return this.editForm.get('direccionTexto') as FormControl;
  }

  get controlDomTypeAddress() {
    return this.editForm.get('domTipoDireccion') as FormControl;
  }

  get controlDomClaseViaPrincipal() {
    return this.editForm.get('domClaseViaPrincipal') as FormControl;
  }

  get controlDomSectorCity() {
    return this.editForm.get('domSectorCiudad') as FormControl;
  }

  get controlCodePostal() {
    return this.editForm.get('codigoPostal') as FormControl;
  }

  get controlMainAddress() {
    return this.editForm.get('esDireccionPrincipal') as FormControl;
  }

  get mainAddress() {
    return this.editForm.get('esDireccionPrincipal');
  }

  get complemento() {
    return this.editForm.get('complemento');
  }

  get isCreate() {
    return this.typeCrud === 'CREATE';
  }

  get isUpdate() {
    return this.typeCrud === 'UPDATE';
  }

  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
