import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import Swal from 'sweetalert2';

@Component({
  selector: 'ica-add-photo',
  standalone: true,
  imports: [ModalWindowComponent, NgxDropzoneModule],
  templateUrl: './ica-add-photo.component.html'
})
export class IcaAddPhotoComponent {
  /* ---- Injects ----- */
  private readonly dialogRef = inject(MatDialogRef<IcaAddPhotoComponent>);

  /* ---- Signals ----- */
  public readonly file = signal<File | null>(null);

  /* ---- Methods ----- */
  public submitPhoto() {
    if (!this.file()) {
      this.showAlertError('No se ha seleccionado ningún archivo');
      return;
    }

    this.dialogRef.close(this.file());
  }

  public onSelect(event: NgxDropzoneChangeEvent) {
    const file = event.addedFiles[0];

    if (file.size > 50 * 1024 * 1024) {
      this.showAlertError('El archivo supera el tamaño máximo de 50 MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      this.showAlertError('El archivo no es una imagen o PDF permitido');
      return;
    }

    this.file.set(file);
  }

  public onRemove() {
    if (this.file()) {
      this.showAlertError('No hay un archivo seleccionado para eliminar');
      return;
    }

    this.file.set(null);
  }

  private showAlertError(message: string): void {
    Swal.fire({
      text: message,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      timer: 20000
    });
  }
}
