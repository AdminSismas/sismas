import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  untracked
} from '@angular/core';
import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';
import { CREATE_CONTACT_FORM } from '../../../constants/people';
import { FormGroup } from '@angular/forms';
import { TerritorialOrganizationService } from '@shared/services/general/territorial-organization/territorial-organization.service';
import { InfoPerson } from '@features/property-management/models/owner/info-person';
import { CreatePersonService } from '../../../services/people/create-person.service';
import { map, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'create-contact-form',
  standalone: true,
  imports: [DynamicFormsComponent],
  templateUrl: './create-contact-form.component.html'
})
export class CreateContactFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  CREATE_CONTACT_FORM = CREATE_CONTACT_FORM;

  /* ---- Injects ---- */
  territorialOrganizationService = inject(TerritorialOrganizationService);
  createPersonService = inject(CreatePersonService);

  /* ---- Inputs ---- */
  enableContactForm = input.required<boolean>();
  sendContactForm = input.required<boolean>();
  contactFormIsValid = input.required<boolean>();
  infoContactInput = input<Partial<InfoPerson> | undefined>(undefined);

  /* ---- Outputs ---- */
  contactFormValid = output<boolean>();

  /* ---- Signals ---- */
  contactForm = signal<FormGroup | undefined>(undefined);
  departmentSelected = signal<string | undefined>(undefined);
  infoContact = signal<Partial<InfoPerson>>({});
  private departmentChange = signal<Subscription | undefined>(undefined);

  /* ---- Constructor ---- */
  constructor() {
    this.enableContactFormEffect();
    this.sendContactFormEffect();
    this.validContactFormEffect();
    this.infoContactInputEffect();
  }

  /* ---- Effects ---- */
  enableContactFormEffect() {
    effect(() => {
      if (this.enableContactForm()) {
        this.contactForm()!.enable();
      } else {
        this.contactForm()!.disable();
      }
    });
  }
  validContactFormEffect() {
    effect(() => {
      if (!this.contactFormIsValid() || !this.contactForm()) return;

      if (this.contactForm()!.invalid) {
        Swal.fire({
          text: 'El formulario de contacto, no es valido',
          icon: 'error',
          timer: 10000,
          timerProgressBar: true
        });
        this.contactFormValid.emit(false);
      } else {
        this.contactFormValid.emit(true);
      }
    });
  }
  sendContactFormEffect() {
    effect(() => {
      if (!this.sendContactForm()) return;

      if (this.contactForm()!.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Formulario inválido',
          text: 'Los datos de contacto son inválidos.'
        });

        return;
      }

      this.addContact();
    });
  }

  /**
   * Watches for changes in the infoContactInput from the parent.
   * When the parent finishes loading async data, this effect updates
   * the local infoContact signal and patches the form with the new values.
   */
  infoContactInputEffect() {
    effect(() => {
      const data = this.infoContactInput();
      if (!data) return;

      untracked(() => {
        this.infoContact.set(data);
        if (this.contactForm()) {
          this.contactForm()!.patchValue(data);

          // If divpolLv1 is present, trigger municipality loading
          if (data.divpolLv1) {
            this.getMunicipalityOptions(data.divpolLv1);
          }
        }
      });
    });
  }

  /* ---- Lifecycle Hooks ---- */
  ngOnInit(): void {
    this.getDepartmentOptions();
  }

  ngAfterViewInit(): void {
    this.departmentChange.set(
      this.contactForm()?.controls['divpolLv1'].valueChanges.subscribe(
        (dpto) => {
          this.getMunicipalityOptions(dpto);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.departmentChange()?.unsubscribe();
    this.departmentChange.set(undefined);
  }

  /* ---- Methods ---- */
  getDepartmentOptions() {
    this.territorialOrganizationService
      .getAllDataDepartments()
      .pipe(
        map((municipalities) =>
          municipalities.map((municipality) => ({
            value: municipality.divpolLvl1Code!,
            label: municipality.divpolLvl1Name!
          }))
        )
      )
      .subscribe((departments) => {
        const indexDepartmentControl = this.CREATE_CONTACT_FORM.findIndex(
          (control) => control.name === 'divpolLv1'
        );

        this.CREATE_CONTACT_FORM[indexDepartmentControl].options = departments;
      });
  }

  getMunicipalityOptions(dpto: string | undefined) {
    if (!dpto) return;

    this.territorialOrganizationService
      .getAllDataMunicipalities(dpto)
      .pipe(
        map((municipalities) =>
          municipalities.map((municipality) => ({
            value: municipality.divpolLvl2Code!.slice(2, 5),
            label: municipality.divpolLvl2Name!
          }))
        )
      )
      .subscribe((municipalities) => {
        const indexDepartmentControl = this.CREATE_CONTACT_FORM.findIndex(
          (control) => control.name === 'divpolLv2'
        );

        this.CREATE_CONTACT_FORM[indexDepartmentControl].options =
          municipalities;

        if (this.infoContact().divpolLv2) {
          const divpolLv2Control = this.contactForm()!.get('divpolLv2')!;
          divpolLv2Control.enable();
          divpolLv2Control.setValue(this.infoContact().divpolLv2);
        }
      });
  }

  addContact(): void {
    this.createPersonService.setInfoPersonData(this.contactForm()!.value);
    if (this.infoContact().individualId) {
      this.createPersonService
        .updateContact(this.infoContact().individualId!)
        .subscribe();
    } else {
      this.createPersonService.createContact().subscribe();
    }
  }
}
