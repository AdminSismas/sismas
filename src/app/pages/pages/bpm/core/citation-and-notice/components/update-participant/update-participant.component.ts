/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ExtraInfoPerson, InfoPerson } from '../../../../../../../apps/interfaces/information-property/info-person';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  ComboboxCollectionFormComponent
} from '../../../../../../../apps/components/general-components/combobox-collection-form/combobox-collection-form.component';
import { InputComponent } from '../../../../../../../apps/components/general-components/input/input.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { PeopleService } from '../../../../../../../apps/services/users/people.service';
import { validateVariable } from '../../../../../../../apps/utils/general';
import { TypeOperationPeople } from '../../../../../../../apps/interfaces/general/content-info';
import {
  CONSTANT_COUNTRY_DEFAULT,
  PAGE,
  PAGE_SIZE
} from '../../../../../../../apps/constants/general/constants';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ComboboxComponent } from '../../../../../../../apps/components/general-components/combobox/combobox.component';
import { Department } from '../../../../../../../apps/interfaces/territorial-organization/department.model';
import { Municipality } from '../../../../../../../apps/interfaces/territorial-organization/municipality.model';
import {
  TerritorialOrganizationService
} from '../../../../../../../apps/services/territorial-organization/territorial-organization.service';
import { GeneralValidationsService } from '../../../../../../../apps/services/validations/general-validations.service';
import { Observable, ReplaySubject } from 'rxjs';
import { InfoContact } from '../../../../../../../apps/interfaces/information-property/info-contact';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'vex-update-participant',
  standalone: true,
  animations: [stagger20ms, fadeInUp400ms, scaleFadeIn400ms],
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDivider,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    MatDialogContent,
    ComboboxCollectionFormComponent,
    InputComponent,
    MatButton,
    MatDialogActions,
    ComboboxComponent
  ],
  templateUrl: './update-participant.component.html',
  styleUrl: './update-participant.component.scss'
})
export class UpdateParticipantComponent implements OnInit, OnDestroy {
  label = 'Actualizar Participante';

  optionsDeparment: Department[] = [];
  optionsMunicipalities: Municipality[] = [];
  contact: InfoContact | null = null;

  form: FormGroup = this.fb.group({
    individualId: [{ value: this.defaults?.individualId || '' }],
    firstName: [{ value: this.defaults?.firstName || '' }],
    middleName: [{ value: this.defaults?.middleName || '' }],
    lastName: [{ value: this.defaults?.lastName || '' }],
    otherLastName: [{ value: this.defaults?.lastName || '' }],
    domIndividualTypeNumber: [{ value: this.defaults?.domIndividualTypeNumber || '' }],
    number: [{ value: this.defaults?.number || '' }],
    companyName: [{ value: this.defaults?.companyName || '' }],
    domIndividualSex: [this.defaults?.domIndividualSex || ''],
    domIndividualType: [{ value: this.defaults?.domIndividualType || '' }, Validators.required],
    domIndividualEthnicGroup: [this.defaults?.domIndividualEthnicGroup || ''],
    divpolLv1: [this.defaults?.contact?.divpolLv1 || '', Validators.required],
    divpolLv2: [this.defaults?.contact?.divpolLv2 || '', Validators.required],
    phoneNumber: [this.defaults?.contact?.phoneNumber || '', [Validators.required, this.generalValidations.onlyNumber()]],
    email: [this.defaults?.contact?.email || '', [Validators.required, this.generalValidations.emailValidator()]],
    address: [this.defaults?.contact?.address || '',[Validators.required, this.generalValidations.min03Characters()]]
  });
  mode: TypeOperationPeople | null = 'update';

  _obtainInfoContact: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  obtainInfoContact$: Observable<boolean> = this._obtainInfoContact.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ExtraInfoPerson | undefined,
    private dialogRef: MatDialogRef<UpdateParticipantComponent>,
    private generalValidations: GeneralValidationsService,
    private territorialOrganizationService: TerritorialOrganizationService,
    private peopleService: PeopleService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    if (!this.defaults || this.defaults && this.defaults?.mode === null) {
      return;
    }
    this.contact = this.defaults?.contact;
    this.mode = this.defaults?.mode;
    this.loadDepartmentalInformation();
    this.sendPerson();

    this.obtainInfoContact$
      .pipe(filter<boolean>(Boolean))
      .subscribe(() => {
        this.getContactParticipation();
      });
  }

  sendPerson() {
    if (this.defaults?.number == null || !validateVariable(this.defaults?.number) ||
      this.defaults?.domIndividualTypeNumber == null || !validateVariable(this.defaults?.domIndividualTypeNumber)) {
      Swal.fire({
        text: 'Ingresar tipo documento o número de documento',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then();
      return;
    }
    this.getPeople(
      this.defaults?.number,
      this.defaults?.domIndividualTypeNumber
    );
  }

  getPeople(numberID: string, typeDocument: string) {
    const obj = {
      number: numberID, individualTypeNumber: typeDocument,
      page: PAGE, size: PAGE_SIZE
    };
    this.peopleService.getPeopleTypeNumber(obj).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.getMessageError(
            'No se encontro persona a consultar.', true, null
          );
          return;
        }
      },
      next: (result: InfoPerson) => {
        if (result) {
          this.defaults = {
            ...result,
            mode: 'update'
          } as ExtraInfoPerson;
          if (this.contact != null && this.contact.individualId > 0) {
            this.defaults.contact = this.contact;
            this.chargeInformation();
          } else {
            this._obtainInfoContact.next(true);
          }
        }
      }
    });
  }

  getContactParticipation() {
    if (!this.defaults?.individualId) {
      return;
    }
    this.peopleService.getContactByIndividualId(this.defaults?.individualId)
      .subscribe((res: InfoContact) => {
        this.contact = res;
        if (this.contact != null && this.contact.individualId > 0 && this.defaults) {
          this.defaults.contact = this.contact;
        }
        this.chargeInformation();
      });
  }

  updatePeople() {
    if (this.form.invalid) {
      this.getMessageError(
        'Error no se encontro informacion del participante', false
        , null
      );
      return;
    }

    if (!this.defaults || this.defaults && this.defaults?.mode === null) {
      this.getMessageError(
        'Error no se encontro informacion del participante', true, null
      );
      return;
    }
    const individualId = this.defaults.individualId;
    const people = this.defaults;
    if (!individualId || individualId <= 0) {
      this.getMessageError(
        'Error al tratar de actualizar el participante', true, null
      );
      return;
    }

    if (this.form.get('domIndividualTypeNumber')?.value === 'NIT') {
      const validate: boolean | null = this.validateNit(this.form.get('number')?.value);
      if (validate) {
        this.getMessageError(
          'Número de formato NIT no válido', false, null
        );
        return;
      }
    }

    if (!people.individualId) {
      people.individualId = this.defaults.individualId;
    }
    people.number = this.controlNumber.value;
    people.domIndividualType = this.controlDomIndividualType.value;
    people.firstName = this.controlFirstName.value;
    people.middleName = this.controlMiddleName.value;
    people.lastName = this.controlLastName.value;
    people.otherLastName = this.controlOtherLastName.value;
    people.companyName = this.controlCompanyName.value;
    people.domIndividualSex = this.controlIndividualSex.value;
    people.domIndividualEthnicGroup = this.controlDomIndividualEthnicGroup.value;
    this.peopleService.userEdit(individualId.toString(), people).subscribe({
      next: (res: InfoPerson) => {
        if (res) {
          this.updateContact(res);
          return;
        }
        this.getMessageError(
          'Error al actualizar la informacion de la persona', false, null
        );
      },
      error: () => {
        this.getMessageError(
          'Error al actualizar la informacion de la persona', false, null
        );
      }
    });
  }

  updateContact(infoPersona: InfoPerson) {
    if (!this.defaults) {
      return;
    }
    const contact = this.form.value;
    if (!contact.individualId) {
      contact.individualId = this.defaults?.individualId;
    }

    contact.divpolLv1 = this.controlDepartment.value;
    contact.divpolLv2 = this.controlMunicipality.value;
    contact.divpolLv3 = null;
    contact.country = CONSTANT_COUNTRY_DEFAULT;
    contact.phoneNumber = this.controlPhoneNumber.value;
    contact.email = this.controlEmail.value;
    contact.address = this.controlAddress.value;
    contact.addressNotification = this.controlAddress.value;
    contact.notificationByEmail = false;
    this.peopleService.updateContact(this.defaults?.individualId, contact)
      .subscribe({
        next: (res: InfoContact) => {
          if (res) {
            infoPersona.contact = res;
            this.getMessageSuccess('Persona actualizada exitosamente', true, infoPersona);
            return;
          }
          this.getMessageSuccess(
            'Se logro actualizar la persona de forma exitosa, y se presento un error al actualizar la informacion de contacto', true,
            infoPersona);
        },
        error: () => {
          this.getMessageSuccess(
            'Se logro actualizar la persona de forma exitosa, y se presento un error al actualizar la informacion de contacto', true,
            infoPersona);
        }
      });

  }

  chargeInformation() {
    if (!this.defaults) {
      return;
    }
    this.changeInfo(this.defaults);
    this.form.patchValue(this.defaults);
    if (this.defaults?.contact?.divpolLv1) {
      this.loadMunicipalitiesInformation(this.defaults?.contact?.divpolLv1, false);
    }
    this.disableDocumentAndType();
    this.disableNaturalPerson();
    this.disableLegalPerson();
  }

  validateNit(nit: any): boolean {
    return /^\d{9}-\d$/.test(nit);
  }

  changeInfo(obj: ExtraInfoPerson): void {
    Object.entries(obj).forEach(([key, value]) => {
      if (this.form.controls[key]) {
        this.form.controls[key].setValue(value);
      }
    });
  }

  loadMunicipalitiesInformation(code: string, skipPreloadedValues: boolean | null) {
    if (!code || code?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataMunicipalities(code)
      .subscribe((result: Municipality[]) => this.captureMunicipalityInformation(result, skipPreloadedValues));
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDepartments()
      .subscribe((result: Department[]) => this.captureDepartmentInformation(result));
  }

  captureDepartmentInformation(result: Department[]): void {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparment = result;
  }

  captureMunicipalityInformation(result: Municipality[], skipPreloadedValues: boolean | null) {
    this.optionsMunicipalities = result.map((mncp: Municipality) => new Municipality(mncp));
    const selectedMunicipality = this.form.get('divpolLv2')?.value;
    if (!selectedMunicipality) {
      return;
    }
    if (!skipPreloadedValues) {
      const listOptions: Municipality[] = this.optionsMunicipalities.filter((option: Municipality) => option.divpolLvl2Code === selectedMunicipality);
      if (listOptions?.length > 0) {
        this.form.get('divpolLv2')?.patchValue(listOptions[0].codeName);
      }
    }
  }

  disableLegalPerson(): void {
    this.form.get('companyName')?.disable();
  }

  disableNaturalPerson(): void {
    this.form.get('firstName')?.disable();
    this.form.get('lastName')?.disable();
    this.form.get('middleName')?.disable();
    this.form.get('otherLastName')?.disable();
  }

  disableDocumentAndType(): void {
    this.form.get('number')?.disable();
    this.form.get('domIndividualTypeNumber')?.disable();
    this.form.get('domIndividualType')?.disable();
  }

  getMessageError(msg: string, closeModal: boolean, obj: any) {
    Swal.fire({
      text: msg,
      icon: 'error',
      showConfirmButton: false,
      timer: 10000
    }).then(() => {
      if (closeModal) {
        this.dialogRef.close(obj);
      }
    });
  }

  getMessageSuccess(msg: string, closeModal: boolean, obj: any) {
    Swal.fire({
      text: msg,
      icon: 'success',
      showConfirmButton: false,
      timer: 10000
    }).then(() => {
      if (closeModal) {
        this.dialogRef.close(obj);
      }
    });
  }

  get controlDomIndividualType() {
    return this.form.get('domIndividualType') as FormControl;
  }

  get controlDomIndividualTypeNumber() {
    return this.form.get('domIndividualTypeNumber') as FormControl;
  }

  get controlNumber() {
    return this.form.get('number') as FormControl;
  }

  get controlFirstName() {
    return this.form.get('firstName') as FormControl;
  }

  get controlMiddleName() {
    return this.form.get('middleName') as FormControl;
  }

  get controlLastName() {
    return this.form.get('lastName') as FormControl;
  }

  get controlOtherLastName() {
    return this.form.get('otherLastName') as FormControl;
  }

  get controlDomIndividualEthnicGroup() {
    return this.form.get('domIndividualEthnicGroup') as FormControl;
  }

  get controlIndividualSex() {
    return this.form.get('domIndividualSex') as FormControl;
  }

  get controlCompanyName() {
    return this.form.get('companyName') as FormControl;
  }

  get controlDepartment() {
    return this.form.get('divpolLv1') as FormControl;
  }

  get controlMunicipality() {
    return this.form.get('divpolLv2') as FormControl;
  }

  get controlPhoneNumber() {
    return this.form.get('phoneNumber') as FormControl;
  }

  get controlEmail() {
    return this.form.get('email') as FormControl;
  }

  get controlAddress() {
    return this.form.get('address') as FormControl;
  }

  ngOnDestroy(): void {
    this._obtainInfoContact.unsubscribe();
  }
}
