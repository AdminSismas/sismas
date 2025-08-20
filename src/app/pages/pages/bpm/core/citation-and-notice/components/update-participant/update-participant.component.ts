/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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
import {
  ExtraInfoPerson,
  InfoPerson
} from '../../../../../../../apps/interfaces/information-property/info-person';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ComboboxCollectionFormComponent } from '../../../../../../../apps/components/general-components/combobox-collection-form/combobox-collection-form.component';
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
import { TerritorialOrganizationService } from '../../../../../../../apps/services/territorial-organization/territorial-organization.service';
import { GeneralValidationsService } from '../../../../../../../apps/services/validations/general-validations.service';
import { Observable, ReplaySubject } from 'rxjs';
import { InfoContact } from '../../../../../../../apps/interfaces/information-property/info-contact';
import { filter } from 'rxjs/operators';
import { People } from 'src/app/apps/interfaces/users/people.model';

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
  templateUrl: './update-participant.component.html'
})
export class UpdateParticipantComponent implements OnInit, OnDestroy {
  label = 'Actualizar Participante';

  optionsDeparment: Department[] = [];
  optionsMunicipalities: Municipality[] = [];
  contact: InfoContact | null = null;

  form: FormGroup;
  mode: TypeOperationPeople | null = null;

  disableButtonSubmit = signal(true);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ExtraInfoPerson | undefined,
    private dialogRef: MatDialogRef<UpdateParticipantComponent>,
    private generalValidations: GeneralValidationsService,
    private territorialOrganizationService: TerritorialOrganizationService,
    private peopleService: PeopleService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({}); // Initialize empty form
  }

  _obtainInfoContact: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  obtainInfoContact$: Observable<boolean> =
    this._obtainInfoContact.asObservable();

  ngOnInit() {
    if (!this.defaults || this.defaults.mode === null) {
      return;
    }

    this.contact = this.defaults.contact;
    this.mode = this.defaults.mode;

    // Initialize form with validators
    this.initializeForm();

    this.loadDepartmentalInformation();
    if (this.mode !== 'peopleCreate') {
      this.sendPerson();
    }

    this.obtainInfoContact$.pipe(filter<boolean>(Boolean)).subscribe(() => {
      this.getContactParticipation();
    });

    if (this.mode === 'peopleCreate') {
      this.disableLegalPerson();
      this.disableNaturalPerson();
      this.disableContact();
    } else {
      this.disableButtonSubmit.set(false);
    }
  }

  private initializeForm() {
    const documentValidators = this.getValidators('document');
    const peopleValidators = this.getValidators('people');
    const contactValidators = this.getValidators('contact');

    this.form = this.fb.group({
      individualId: [this.defaults?.individualId ?? ''],

      // Document
      domIndividualTypeNumber: [
        this.defaults?.domIndividualTypeNumber ?? '',
        documentValidators
      ],
      number: [this.defaults?.number ?? '', documentValidators],

      // People
      firstName: [this.defaults?.firstName ?? '', peopleValidators],
      middleName: [this.defaults?.middleName ?? ''],
      lastName: [this.defaults?.lastName ?? '', peopleValidators],
      otherLastName: [this.defaults?.lastName ?? ''],
      companyName: [this.defaults?.companyName ?? ''],
      domIndividualSex: [
        this.defaults?.domIndividualSex ?? '',
        peopleValidators
      ],
      domIndividualType: [
        this.defaults?.domIndividualType ?? '',
        peopleValidators
      ],
      domIndividualEthnicGroup: [
        this.defaults?.domIndividualEthnicGroup ?? '',
        peopleValidators
      ],

      // Contact
      divpolLv1: [this.defaults?.contact?.divpolLv1 ?? '', contactValidators],
      divpolLv2: [this.defaults?.contact?.divpolLv2 ?? '', contactValidators],
      phoneNumber: [
        this.defaults?.contact?.phoneNumber ?? '',
        [
          this.generalValidations.onlyNumber(),
          ...(contactValidators ? [contactValidators] : [])
        ]
      ],
      email: [
        this.defaults?.contact?.email ?? '',
        [
          ...(contactValidators
            ? [contactValidators, this.generalValidations.emailValidator()]
            : [])
        ]
      ],
      address: [
        this.defaults?.contact?.address ?? '',
        [
          this.generalValidations.min03Characters(),
          ...(contactValidators ? [contactValidators] : [])
        ]
      ]
    });
  }

  private getValidators(groupControl: 'people' | 'contact' | 'document') {
    if (!this.defaults?.mode) {
      return null;
    }

    const mode = this.defaults.mode;
    const validators = [];

    if (
      (mode === 'peopleCreate' &&
        (groupControl === 'document' || groupControl === 'people')) ||
      (mode === 'peopleUpdate' && groupControl === 'people') ||
      (mode === 'update' && groupControl === 'contact')
    ) {
      validators.push(Validators.required);
    }

    return validators.length > 0 ? Validators.compose(validators) : null;
  }

  searchPerson() {
    const params = this.form.value;
    this.peopleService.getPersonByDocumentNumber(params).subscribe({
      next: () => {
        this.getMessageError(
          'Ya existe una persona con este número de documento',
          false,
          null
        );
        this.disableContact();
        this.disableLegalPerson();
        this.disableNaturalPerson();
        this.disableButtonSubmit.set(true);
      },
      error: (error: HttpErrorResponse): void => {
        if (error.status === 404) {
          this.form.enable();
          this.disableButtonSubmit.set(false);
        }
      }
    });
  }

  sendPerson() {
    if (
      this.defaults?.number == null ||
      !validateVariable(this.defaults?.number) ||
      this.defaults?.domIndividualTypeNumber == null ||
      !validateVariable(this.defaults?.domIndividualTypeNumber)
    ) {
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
      number: numberID,
      individualTypeNumber: typeDocument,
      page: PAGE,
      size: PAGE_SIZE
    };
    this.peopleService.getPersonByDocumentNumber(obj).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.getMessageError(
            'No se encontro persona a consultar.',
            true,
            null
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
          if (this.contact !== null && this.contact.individualId > 0) {
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
    this.peopleService
      .getContactByIndividualId(this.defaults?.individualId)
      .subscribe({
        next: (res: InfoContact) => {
        this.contact = res;
        if (
          this.contact != null &&
          this.contact.individualId > 0 &&
          this.defaults
        ) {
          this.defaults.contact = this.contact;
        }
        this.chargeInformation();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          Swal.close();
          this.contact = null;
        }
      }
    });
  }

  updatePeople() {
    if (this.form.invalid) {
      this.getMessageError(
        'Error no se encontro informacion del participante',
        false,
        null
      );
      return;
    }

    if (!this.defaults || this.mode === null) {
      this.getMessageError(
        'Error no se encontro informacion del participante',
        true,
        null
      );
      return;
    }
    const individualId = this.defaults.individualId;
    const person = this.defaults;
    if (this.mode !== 'peopleCreate' && (!individualId || individualId <= 0)) {
      this.getMessageError(
        'Error al tratar de actualizar el participante',
        true,
        null
      );
      return;
    }

    if (this.form.get('domIndividualTypeNumber')?.value === 'NIT') {
      const validate: boolean | null = this.validateNit(
        this.form.get('number')?.value
      );
      if (validate) {
        this.getMessageError('Número de formato NIT no válido', false, null);
        return;
      }
    }

    if (!person.individualId) {
      person.individualId = this.defaults.individualId;
    }

    person.number = this.controlNumber.value;
    person.domIndividualTypeNumber = this.controlDomIndividualTypeNumber.value;
    person.domIndividualType = this.controlDomIndividualType.value;
    person.firstName = this.controlFirstName.value;
    person.middleName = this.controlMiddleName.value;
    person.lastName = this.controlLastName.value;
    person.otherLastName = this.controlOtherLastName.value;
    person.companyName = this.controlCompanyName.value;
    person.domIndividualSex = this.controlIndividualSex.value;
    person.domIndividualEthnicGroup =
      this.controlDomIndividualEthnicGroup.value;

    if (this.mode === 'peopleUpdate' || this.mode === 'peopleCreate') {
      this.peopleManagement(person);
      return;
    }

    this.contactManagement(person);
  }

  peopleManagement(person: InfoPerson) {
    if (this.mode === 'peopleCreate') {
      this.createPerson(person);
      return;
    }

    this.updatePerson(person);
    return;
  }

  createPerson(person: InfoPerson) {
    const people = new People(person);
    this.peopleService.createPeople(people).subscribe({
      next: (response) => {
        this.contactManagement(response);
        this.getMessageSuccess('Persona creada exitosamente', true, response);
      },
      error: () => {
        this.getMessageError(
          'Error al actualizar la informacion de la persona',
          false,
          null
        );
      }
    });
  }

  updatePerson(person: InfoPerson) {
    this.peopleService
      .editPerson(person.individualId.toString(), person)
      .subscribe({
        next: (res) => {
          this.contactManagement(res);
        },
        error: () => {
          this.getMessageError(
            'Error al actualizar la informacion de la persona',
            false,
            null
          );
        }
      });
  }

  contactManagement(person: People | ExtraInfoPerson) {
    if (!person.individualId) return;

    this.peopleService.getContactByIndividualId(person.individualId).subscribe({
      next: (res) => {
        this.contact = res;
        const infoPerson: InfoPerson = { ...person, contact: res };

        this.updateContact(infoPerson);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.createContact(person.individualId);
        }
      }
    });
  }

  updateContact(infoPerson: InfoPerson) {
    if (!this.defaults) {
      return;
    }
    const contact: InfoContact = {
      individualId: infoPerson.individualId,
      divpolLv1: this.controlDepartment.value,
      divpolLv2: this.controlMunicipality.value,
      divpolLv3: '',
      country: CONSTANT_COUNTRY_DEFAULT,
      phoneNumber: this.controlPhoneNumber.value,
      email: this.controlEmail.value,
      address: this.controlAddress.value,
      addressNotification: this.controlAddress.value,
      notificationByEmail: false
    };

    contact.divpolLv1 = this.controlDepartment.value;
    contact.divpolLv2 = this.controlMunicipality.value;
    contact.divpolLv3 = null;
    contact.country = CONSTANT_COUNTRY_DEFAULT;
    contact.phoneNumber = this.controlPhoneNumber.value;
    contact.email = this.controlEmail.value;
    contact.address = this.controlAddress.value;
    contact.addressNotification = this.controlAddress.value;
    contact.notificationByEmail = false;

    this.peopleService
      .updateContact(infoPerson.individualId!, contact)
      .subscribe((res: InfoContact) => {
        if (res) {
          infoPerson.contact = res;
          this.getMessageSuccess(
            'Persona actualizada exitosamente',
            true,
            infoPerson
          );
          return;
        }
        this.getMessageSuccess(
          'Se logro actualizar la persona de forma exitosa, y se presento un error al actualizar la informacion de contacto',
          true,
          infoPerson
        );
      });
  }

  createContact(individualId: number) {
    const contact: Partial<InfoContact> = {
      individualId,
      divpolLv1: this.controlDepartment.value,
      divpolLv2: this.controlMunicipality.value,
      divpolLv3: '',
      country: CONSTANT_COUNTRY_DEFAULT,
      phoneNumber: this.controlPhoneNumber.value,
      email: this.controlEmail.value,
      address: this.controlAddress.value,
      addressNotification: this.controlAddress.value,
      notificationByEmail: false
    };

    this.peopleService.createContact(contact).subscribe();
  }

  chargeInformation() {
    if (!this.defaults) {
      return;
    }
    this.changeInfo(this.defaults);
    this.form.patchValue(this.defaults);
    if (this.defaults?.contact?.divpolLv1) {
      this.loadMunicipalitiesInformation(
        this.defaults?.contact?.divpolLv1,
        false
      );
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

  loadMunicipalitiesInformation(
    code: string,
    skipPreloadedValues: boolean | null
  ) {
    if (!code || code?.length <= 0) {
      return;
    }
    this.territorialOrganizationService
      .getDataMunicipalities(code)
      .subscribe((result: Municipality[]) =>
        this.captureMunicipalityInformation(result, skipPreloadedValues)
      );
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService
      .getDataDepartments()
      .subscribe((result: Department[]) =>
        this.captureDepartmentInformation(result)
      );
  }

  captureDepartmentInformation(result: Department[]): void {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparment = result;
  }

  captureMunicipalityInformation(
    result: Municipality[],
    skipPreloadedValues: boolean | null
  ) {
    this.optionsMunicipalities = result.map(
      (mncp: Municipality) => new Municipality(mncp)
    );
    const selectedMunicipality = this.form.get('divpolLv2')?.value;
    if (!selectedMunicipality) {
      return;
    }
    if (!skipPreloadedValues) {
      const listOptions: Municipality[] = this.optionsMunicipalities.filter(
        (option: Municipality) => option.divpolLvl2Code === selectedMunicipality
      );
      if (listOptions?.length > 0) {
        this.form.get('divpolLv2')?.patchValue(listOptions[0].codeName);
      }
    }
  }

  disableLegalPerson(): void {
    if (this.mode === 'peopleUpdate') return;

    this.form.get('companyName')?.disable();
  }

  disableNaturalPerson(): void {
    if (this.mode === 'peopleUpdate') return;

    this.form.get('firstName')?.disable();
    this.form.get('lastName')?.disable();
    this.form.get('middleName')?.disable();
    this.form.get('otherLastName')?.disable();
  }

  disableContact(): void {
    if (this.mode === 'peopleUpdate') return;

    this.form.get('domIndividualSex')?.disable();
    this.form.get('domIndividualEthnicGroup')?.disable();
    this.form.get('divpolLv1')?.disable();
    this.form.get('divpolLv2')?.disable();
    this.form.get('phoneNumber')?.disable();
    this.form.get('email')?.disable();
    this.form.get('address')?.disable();
  }

  disableDocumentAndType(): void {
    if (this.mode === 'peopleCreate') return;

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
