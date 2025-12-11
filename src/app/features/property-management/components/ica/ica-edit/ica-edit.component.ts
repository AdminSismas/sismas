import { Component, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICA_EDIT_INPUTS } from '@features/property-management/constants/ica/ica-edit.constant';
import { IcaResponse } from '@shared/interfaces';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'ica-edit',
  standalone: true,
  imports: [ModalWindowComponent, DynamicFormsComponent],
  templateUrl: './ica-edit.component.html',
  styles: ``
})
export class IcaEditComponent {
  /* ---- Properties ----- */
  inputs = ICA_EDIT_INPUTS;

  /* ---- Injects ---- */
  public readonly icaDetails: IcaResponse | undefined = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<IcaEditComponent>);

  /* ---- Signals ---- */
  title = signal<string>(this.createTitle());
  editIcaForm = signal<FormGroup>(new FormGroup({}));

  /* ---- Methods ---- */
  private createTitle(): string {
    if (!this.icaDetails) return 'Creando registro ICA';

    if (this.icaDetails.prIcaId)
      return `Editando ICA ${this.icaDetails.prIcaId}`;

    return 'Creando registro ICA';
  }

  public sendEditIcaForm(): void {
    if (this.validateForm()) {
      const icaDetails = {
        ...this.icaDetails,
        prIcaId: this.icaDetails?.prIcaId ?? -1
      };

      const icaResponse: Partial<IcaResponse> = {
        ...icaDetails,
        ...this.editIcaForm().value,
        fechaEdicion: new Date().toISOString().split('T')[0]
      };

      this.dialogRef.close({ response: true, data: icaResponse });
    }
  }

  private validateForm(): boolean {
    this.editIcaForm().markAllAsTouched();

    this.manageFormErrors();

    return this.editIcaForm().valid;
  }

  private manageFormErrors(): void {
    const {
      primerNombre,
      primerApellido,
      domActividadPrincipal,
      domIndividualType,
      domIndividualTypeNumber,
      documentoIdentidad,
      notificacionElectronica,
      inscritoCc,
      granContribuyente
    } = this.editIcaForm().value as Partial<IcaResponse>;

    if (!domActividadPrincipal) {
      this.errorAlert('La actividad principal es obligatoria');
      return;
    }

    if (!primerNombre || !primerApellido) {
      this.errorAlert('El primer nombre y primer apellido son obligatorios');
      return;
    }

    if (!domIndividualType || !domIndividualTypeNumber || !documentoIdentidad) {
      this.errorAlert(
        'El tipo de persona, tipo de documento y número de documento son obligatorios'
      );
      return;
    }

    // Validar que notificacionElectronica, inscritoCc y granContribuyente haya sido indicado con el selector
    if (typeof inscritoCc !== 'boolean') {
      this.errorAlert('No se ha indicado si tiene un documento inscrito CC');
      return;
    }

    if (typeof notificacionElectronica !== 'boolean') {
      this.errorAlert(
        'No se ha indicado si se ha hecho la notificación electrónica'
      );
      return;
    }

    if (typeof granContribuyente !== 'boolean') {
      this.errorAlert('No se ha indicado el estado del gran contribuyente');
      return;
    }

    // Ya que hemos descartado todos los otros validadores y el formulario no es válido, el único error que encontramos es que el correo electrónico no tiene un formato adecuado
    if (this.editIcaForm().invalid) {
      this.errorAlert('El correo electrónico no tiene un formato adecuado');
      return;
    }
  }

  private errorAlert(message: string): void {
    Swal.fire({
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      timer: 15000
    });
  }
}
