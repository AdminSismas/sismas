import {
  Component,
  forwardRef,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from '@features/property-management/components/shared/header-cadastral-information/header-cadastral-information-property.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { PhotosService } from '@features/property-management/services';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { CarouselComponent } from '../../../../shared/utils/carousel/carousel.component';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { MODAL_SMALL_XS } from '@shared/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-photos',
  standalone: true,
  imports: [
    MatExpansionModule,
    HeaderCadastralInformationPropertyComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    CommonModule,
    CarouselComponent
  ],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotosComponent),
      multi: true
    }
  ]
})
export class PhotosComponent {
  // Inject services
  photosService = inject(PhotosService);
  dialog = inject(MatDialog);

  // Signals
  images = signal<{ url: string, name: string }[]>([]);
  loading = signal(true);
  resetCarousel = signal(false);

  // Inputs
  expandedComponent = input<boolean>(false);
  baunitId = input<string>('');
  schema = input<string>('');
  executionId = input<string | null | undefined>('');
  typeInformation = input<string>('');
  npn = input.required<string>();

  // Outputs
  emitExpandedComponent = output<number>();

  isExpandPanel() {
    this.emitExpandedComponent.emit(12);
    this.loadPhotos();
  }

  loadPhotos() {
    if (!this.baunitId()) {
      console.error('baunitId no definido.');
      this.loading.set(false);
      return;
    }

    const municipioId = this.npn().slice(2, 5);

    this.photosService.listNamePhotos(this.baunitId(), municipioId).subscribe({
      next: (response) => {
        this.images.set(response);
        this.loading.set(false);
      }
    });
  }

  openAddPhotoDialog() {
    this.dialog
      .open(AddPhotoComponent, {
        ...MODAL_SMALL_XS
      })
      .afterClosed()
      .subscribe((result: { response: boolean; data?: FormData }) => {
        if (result.response) {
          const formData = result.data!;
          formData.append('municipioId', this.npn().slice(2, 5));

          this.photosService.uploadPhoto(formData, this.baunitId()).subscribe({
            next: (mesage) => {
              this.onImagesChange(mesage);
            }
          });
        }
      });
  }

  onDeleteImage(urlFile: string) {
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar foto?',
      text: '¿Está seguro de eliminar la foto?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteImage(urlFile);
        this.resetCarousel.update((prev) => !prev);
        setTimeout(() => this.resetCarousel.update((prev) => !prev), 100);
      } else {
        return;
      }
    });
  }

  deleteImage(urlFile: string) {
    this.photosService.deletePhoto(urlFile).subscribe({
      next: (mesage) => {
        this.onImagesChange(mesage);
      }
    });
  }

  onImagesChange(mesage: string) {
    Swal.fire({
      icon: 'success',
      title: 'Exito',
      text: mesage,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      showCancelButton: false
    });
    this.loadPhotos();
  }
}
