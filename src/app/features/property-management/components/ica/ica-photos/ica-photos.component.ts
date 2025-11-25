import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IcaDialogData } from '@features/property-management/models/ica';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
import { CarouselComponent } from '@shared/utils/carousel/carousel.component';

@Component({
  selector: 'ica-photos',
  standalone: true,
  imports: [ModalWindowComponent, CarouselComponent],
  templateUrl: './ica-photos.component.html',
  styles: ``
})
export class IcaPhotosComponent {
  /* ---- Injects ----- */
  public readonly icaDialogData: IcaDialogData = inject(MAT_DIALOG_DATA);

  /* ---- Properties ----- */
  public readonly title = `Fotos ICA ${this.icaDialogData.ica.nombreEstablecimiento}`;
  public readonly baunitId = this.icaDialogData.baunitId;

  /* ---- Signals ----- */
  images = signal<{ url: string; name: string }[]>(
    this.icaDialogData.photos.map((photo, index) => ({
      url: photo,
      name: `Foto ${index}`
    }))
  );
}
