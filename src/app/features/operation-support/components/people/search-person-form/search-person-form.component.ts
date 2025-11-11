import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';import { SEARCH_PERSON_FORM } from '../../../constants/people';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { CreatePersonService } from '../../../services/people/create-person.service';

@Component({
  selector: 'search-person-form',
  standalone: true,
  imports: [DynamicFormsComponent, MatButtonModule, MatIconModule],
  templateUrl: './search-person-form.component.html'
})
export class SearchPersonFormComponent implements AfterViewInit, OnDestroy {
  /* ---- Properties ---- */
  readonly SEARCH_PERSON_FORM = SEARCH_PERSON_FORM;

  /* ---- Injects ---- */
  createPersonService = inject(CreatePersonService);

  /* ---- Inputs ---- */
  enableSearchForm = input.required<boolean>();

  // Outputs
  search = output<void>();

  /* ---- Signals ---- */
  searchForm = signal<FormGroup | null>(null);
  buttonProperties = signal<{ label: string; icon: string; color: string }>({
    label: 'Buscar',
    icon: 'mat:search',
    color: 'primary'
  });
  disableButton = signal<boolean>(false);

  /* ---- Subscription ---- */
  private individualTypeNumber: Subscription | undefined = undefined;

  ngAfterViewInit() {
    this.subscribeToTypeNumber();

    this.searchForm()?.reset(this.createPersonService.infoPersonData);
  }

  ngOnDestroy() {
    this.individualTypeNumber?.unsubscribe();
  }

  constructor() {
    this.enableFormEffect();
  }

  /* ---- Effects ---- */
  private enableFormEffect() {
    effect(() => {
      if (this.enableSearchForm()) {
        this.searchForm()!.enable();
      } else {
        this.searchForm()!.disable();
      }
    });
  }

  /* ---- Methods ---- */
  private subscribeToTypeNumber() {
    const numberControl = this.searchForm()!.get('number')!;

    this.individualTypeNumber = this.searchForm()
      ?.get('domIndividualTypeNumber')!
      .valueChanges.subscribe((value) => {
        if (value === 'Secuencial') {
          this.buttonProperties.set({
            label: 'Generar',
            icon: 'mat:add',
            color: 'accent'
          });
          numberControl.disable();
          numberControl.clearValidators();
          return;
        }

        this.buttonProperties.set({
          label: 'Buscar',
          icon: 'mat:search',
          color: 'primary'
        });
        numberControl.enable();
        numberControl.setValue(this.createPersonService.infoPersonData.number);
        numberControl.setValidators([Validators.required]);
      });
  }

  onSearch() {
    if (!this.searchForm()) return;

    if (this.searchForm()!.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Por favor, completa todos los campos requeridos.',
        timer: 5000,
        showConfirmButton: false
      });
      return;
    }

    if (
      this.searchForm()!.get('domIndividualTypeNumber')!.value === 'Secuencial'
    ) {
      this.createSecuentialPerson();
    }

    this.createPersonService.setInfoPersonData(this.searchForm()!.value);

    this.search.emit();
  }

  createSecuentialPerson() {
    this.createPersonService.getSequencialCode().subscribe((result: string) => {
      this.searchForm()!.get('number')!.enable();
      this.searchForm()!.get('number')!.setValue(result);
      this.searchForm()!.get('number')!.disable();
    });
  }
}
