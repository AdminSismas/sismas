import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeopleService } from '../../../../../../apps/services/users/people.service';
import Swal from 'sweetalert2';
import { InfoPerson } from '../../../../../../apps/interfaces/information-property/info-person';
import { catchError } from 'rxjs/operators';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { CreatePersonFormComponent } from '../create-person-form/create-person-form.component';
import { SearchPersonFormComponent } from '../search-person-form/search-person-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateContactFormComponent } from '../create-contact-form/create-contact-form.component';
import { CreatePersonService } from '../../services/create-person.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

export interface DefaultDataCreatePerson extends Partial<InfoPerson> {
  mode: 'create' | 'update';
}

@Component({
  selector: 'vex-create-people',
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
    CreateContactFormComponent,
    CreatePersonFormComponent,
    MatProgressSpinner,
    ModalWindowComponent,
    SearchPersonFormComponent
  ],
  templateUrl: './create-people.component.html',
  styleUrl: './create-people.component.scss'
})
export class CreatePeopleComponent implements OnInit, OnDestroy {
  /* ---- Injects ---- */
  defaults = inject<DefaultDataCreatePerson | undefined>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<CreatePeopleComponent>);
  peopleService = inject(PeopleService);
  createPersonService = inject(CreatePersonService);

  mode: 'create' | 'update' = 'create';

  /* ---- Signals ---- */
  loading = signal<boolean>(true);
  contactFormValid = signal<boolean>(false);
  validateContactForm = signal<boolean>(false);
  enableCreateContactForm = signal<boolean>(true);
  enableCreatePersonForm = signal<boolean>(true);
  enableSearchForm = signal<boolean>(false);
  sendContactForm = signal<boolean>(false);

  /* ---- Computeds ---- */
  getCreatePersonFormValues = computed<boolean>(() => this.contactFormValid());
  modalTitle = computed<string>(() => {
    let title = 'Crear persona';
    const { firstName, lastName } = this.defaults!;

    if (firstName || lastName) {
      title = firstName + ' ' + lastName;
    }

    return title;
  });

  constructor() {
    effect(() => {
      console.log(this.validateContactForm());
    });
  }

  ngOnInit() {
    this.mode = this.defaults?.mode ?? 'create';
    if (this.mode === 'create') {
      this.enableSearchForm.set(true);
      this.enableCreatePersonForm.set(false);
      this.enableCreateContactForm.set(false);
    }
    this.createPersonService.initInfoPersonObject();
    this.createPersonService.setInfoPersonData(this.defaults ?? {});
    this.getContactInfo();
  }

  ngOnDestroy(): void {
    this.createPersonService.clearInfoPersonData();
  }

  save() {
    this.validateContactForm.set(true);
    setTimeout(() => {
      this.validateContactForm.set(false);
    }, 50);
    return;
  }

  createPerson(isValid: boolean) {
    if (!isValid) {
      this.contactFormValid.set(false);
      return;
    }
    /* NOTA: validamos el usuario */
    if (this.mode === 'create') {
      this.sendCreatePeople();
    } else {
      this.updatePeople();
    }
  }

  sendCreatePeople() {
    const { infoPersonData } = this.createPersonService;
    if (
      !infoPersonData.number ||
      !infoPersonData.domIndividualTypeNumber ||
      !infoPersonData.domIndividualType
    )
      return;

    this.peopleService.createPeople(infoPersonData).subscribe((response) => {
      this.createPersonService.setInfoPersonData(response);
      this.sendContactForm.set(true);
      setTimeout(() => {
        this.sendContactForm.set(false);
      }, 50);
      Swal.fire({
        text: 'Persona registrada',
        icon: 'success',
        showConfirmButton: false,
        timer: 10000
      }).then(() => {
        this.dialogRef.close(this.createPersonService.infoPersonData);
      });
    });
  }

  getPerson() {
    const { number, domIndividualTypeNumber, domIndividualType } =
      this.createPersonService.infoPersonData;

    if (domIndividualTypeNumber === 'Secuencial') {
      this.enableCreatePersonForm.set(true);
      this.enableCreateContactForm.set(true);
      this.enableSearchForm.set(false);
      return;
    }

    this.peopleService
      .getPersonByDocumentNumber({
        number,
        domIndividualTypeNumber,
        domIndividualType
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.enableCreatePersonForm.set(true);
            this.enableCreateContactForm.set(true);
            this.enableSearchForm.set(false);
          }
          throw error;
        })
      )
      .subscribe((result: InfoPerson) => {
        if (this.mode === 'create' && result) {
          this.enableCreatePersonForm.set(false);
          this.enableCreateContactForm.set(false);
          Swal.fire({
            icon: 'error',
            text: 'La persona ya se encuentra registrada',
            showConfirmButton: false,
            timer: 10000
          });
          return;
        }
      });
  }

  updatePeople() {
    if (!this.createPersonService.infoPersonData) return;

    const individualId = `${this.createPersonService.infoPersonData.individualId}`;
    const people = {
      ...this.defaults,
      ...this.createPersonService.infoPersonData
    };
    if (!individualId) {
      return;
    }

    this.peopleService
      .editPerson(individualId, people)
      .subscribe((response) => {
        this.createPersonService.setInfoPersonData(response);
        this.sendContactForm.set(true);
        setTimeout(() => {
          this.sendContactForm.set(false);
        }, 50);
        Swal.fire({
          text: 'Persona actualizada',
          icon: 'success',
          showConfirmButton: false,
          timer: 10000
        }).then(() => this.dialogRef.close(this.createPersonService.infoPersonData));
      });
  }

  getContactInfo() {
    if (!this.defaults?.individualId) {
      this.loading.set(false);
      return;
    }

    const { individualId } = this.defaults;
    this.peopleService.getContactByIndividualId(individualId).subscribe({
      next: (contact) => {
        this.createPersonService.setInfoPersonData(contact);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(true);
      }
    });
  }
}
