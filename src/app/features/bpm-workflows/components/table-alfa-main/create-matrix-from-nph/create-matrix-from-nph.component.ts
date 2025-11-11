import { Component, signal } from '@angular/core';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';import { JSONInput } from '@shared/interfaces/forms';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-create-matrix-from-nph',
  standalone: true,
  imports: [ModalWindowComponent, DynamicFormsComponent],
  templateUrl: './create-matrix-from-nph.component.html'
})
export class CreateMatrixFromNphComponent {
  protected readonly inputForm: JSONInput[] = [
    {
      name: 'domBaunitCondition',
      label: 'Condición',
      placeholder: 'Seleccione la condición de la matriz',
      element: 'select',
      type: '',
      options: [
        { value: '(Condominio) Matriz', label: '(Condominio) Matriz' },
        {
          value: '(Propiedad horizontal) Matriz',
          label: '(Propiedad horizontal) Matriz'
        },
        {
          value: '(Parque cementerio) Matriz',
          label: '(Parque cementerio) Matriz'
        }
      ],
      validators: [Validators.required]
    }
  ];

  formGroup = signal<FormGroup>(new FormGroup({}));
  dialog = signal<MatDialogRef<ModalWindowComponent> | null>(null);

  onAccept() {
    if (this.formGroup().invalid) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Debe seleccionar una condición',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        timer: 5000
      });
      return;
    }
    this.dialog()?.close({ response: true, data: this.formGroup().value });
  }
}
