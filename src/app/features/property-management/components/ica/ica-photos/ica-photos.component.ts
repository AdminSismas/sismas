import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environments';
import { IcaDialogData } from '@features/property-management/models/ica';
import { IcaPhotosService } from '@features/property-management/services/ica/ica-photos.service';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
import { CarouselComponent } from '@shared/utils/carousel/carousel.component';
import { IcaAddPhotoComponent } from '../ica-add-photo/ica-add-photo.component';
import { MODAL_SMALL } from '@shared/constants/constants';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'ica-photos',
  standalone: true,
  imports: [
    ModalWindowComponent,
    CarouselComponent,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ica-photos.component.html',
  styles: ``
})
export class IcaPhotosComponent implements OnInit {
  /* ---- Injects ----- */
  public readonly icaDialogData: IcaDialogData & { edition: boolean } =
    inject(MAT_DIALOG_DATA);
  private readonly icaPhotosService = inject(IcaPhotosService);
  private readonly dialog = inject(MatDialog);

  /* ---- Properties ----- */
  public readonly title = `Fotos ICA ${this.icaDialogData.ica.nombreEstablecimiento}`;
  public readonly baunitId = this.icaDialogData.baunitId;

  /* ---- Signals ----- */
  images = signal<{ url: string; name: string }[]>([]);
  //   this.icaDialogData.photos.map((photo) => ({
  //     url: this.createImageUrl(photo),
  //     name: photo
  //   }))
  // );
  edition = signal(this.icaDialogData.edition);

  /* ---- Lifecycle ----- */
  ngOnInit(): void {
    this.getImages();
  }

  /* ---- Methods ----- */
  private getImages() {
    this.icaPhotosService
      .getIcaPhotos(
        this.baunitId,
        this.icaDialogData.ica.municipalityCode,
        this.icaDialogData.ica.prIcaId
      )
      .subscribe((images) => {
        this.images.set(
          images.map((image) => ({
            url: this.createImageUrl(image),
            name: image
          }))
        );
      });
  }

  private createImageUrl(filename: string): string {
    const { value: bpmAttachment, baunit } = environment.bpmAttachment;
    const { photos, url, port } = environment;

    const { baunitId } = this.icaDialogData;
    const { municipalityCode, prIcaId: icaId } = this.icaDialogData.ica;

    const urlWithoutParams = `${url}:${port}${bpmAttachment}${baunit}/${baunitId}${photos}/${filename}`;

    const params = new HttpParams()
      .set('municipioId', municipalityCode)
      .set('icaId', icaId);

    return `${urlWithoutParams}?${params.toString()}`;
  }

  public addImage() {
    this.dialog
      .open(IcaAddPhotoComponent, {
        ...MODAL_SMALL
      })
      .afterClosed()
      .subscribe((file: File) => {
        const baunitId = this.icaDialogData.baunitId;
        const { municipalityCode: municipioId, prIcaId: icaId } =
          this.icaDialogData.ica;

        const body: { file: File; municipioId: string; icaId: number } = {
          file: file,
          municipioId,
          icaId
        };

        this.icaPhotosService.addIcaPhoto(baunitId, body).subscribe(() => {
          this.showAlert('Foto agregada correctamente');
          this.getImages();
        });
      });
  }

  public deleteImage(urlImage: string) {
    this.showAlert('¿Está seguro de eliminar la foto?', 'warning', true).then(
      (response) => {
        if (response.isConfirmed) {
          this.icaPhotosService.deleteIcaPhoto(urlImage).subscribe(() => {
            this.showAlert('Foto eliminada correctamente');
            this.getImages();
          });
        }
      }
    );
  }

  private showAlert(
    message: string,
    icon: SweetAlertIcon = 'success',
    showCancelButton = false
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      text: message,
      icon,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      showCancelButton,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      timer: 20000
    });
  }
}
