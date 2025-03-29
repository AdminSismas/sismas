import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { getRandomInt } from '../../../../utils/general';
import { LIST_EXTENSION_MASIVE_EXCEL } from '../../../../constants/general/constants';
import Swal from 'sweetalert2';
import { AlfaMainService } from '../../../../services/bpm/core/alfa-main.service';
import { LoadingServiceService } from '../../../../services/general/loading-service.service';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-attachment-exel-massive',
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
    MatDialogClose,
    MatIconButton,
    MatIcon,
    MatDivider,
    MatDialogContent,
    NgxDropzoneModule,
    VexPageLayoutContentDirective,
    VexPageLayoutComponent,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogTitle
  ],
  templateUrl: './attachment-excel-massive.component.html',
  styleUrl: './attachment-excel-massive.component.scss'
})
export class AttachmentExcelMassiveComponent implements OnInit {

  id: string = getRandomInt(1264).toString() + '-attachmentExcelMassive';
  isUploading = false;
  file: File | null = null;
  uploadedFiles: File[] = [];

  private loadingServiceService: LoadingServiceService = inject(LoadingServiceService);

  constructor(
    public dialogRef: MatDialogRef<AttachmentExcelMassiveComponent>,
    @Inject(MAT_DIALOG_DATA) public executionId: number,
    private alfaMainService: AlfaMainService
  ) {
  }

  ngOnInit(): void {
    if (!this.executionId || this.executionId === undefined) {
      return;
    }
    if (this.id?.length > 0) {
      this.id =
        this.id + getRandomInt(2584) + 'AttachmentExcelMassiveComponent' + getRandomInt(88);
    } else {
      this.id = getRandomInt(9687) + 'AttachmentExcelMassiveComponent' + getRandomInt(77);
    }
  }

  onRemove(event: any) {
    const index = this.uploadedFiles.indexOf(event);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  onSelect(event: any) {
    const maxSize = 50 * 1024 * 1024; // 50MB en bytes
    const alreadySelectedFiles = [];
    const oversizedFiles = [];
    const validFilesExtension = event.addedFiles.filter((nuevoArchivo: File) => {
      const extension = nuevoArchivo.name.split('.')[1].toLowerCase();
      return !LIST_EXTENSION_MASIVE_EXCEL.includes(extension);
    });

    if (validFilesExtension !== null && validFilesExtension.length > 0) {
      Swal.fire({
        text: 'Error, archivos con formato invalido',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then();
      return;
    }

    const validFiles = event.addedFiles.filter((nuevoArchivo: File) => {
      const alreadySelected = this.uploadedFiles.some(
        (archivoExistente: File) =>
          archivoExistente.name === nuevoArchivo.name && archivoExistente.size === nuevoArchivo.size
      );

      if (alreadySelected) {
        alreadySelectedFiles.push(nuevoArchivo);
      }
      if (nuevoArchivo.size > maxSize) {
        oversizedFiles.push(nuevoArchivo);
      }
      return !alreadySelected && nuevoArchivo.size <= maxSize;
    });


    if (alreadySelectedFiles.length > 0) {
      Swal.fire({
        text: 'Error, Algunos archivos estan duplicados',
        icon: 'error',
        showConfirmButton: false,
        timer: 5000
      }).then();
      return;
    }

    if (oversizedFiles.length > 0) {
      Swal.fire({
        text: 'Error, Algunos archivos exceden el límite de tamaño de 50MB.',
        icon: 'error',
        showConfirmButton: false,
        timer: 5000
      }).then();
      return;
    }

    if (validFiles.length > 0) {
      this.uploadedFiles.push(...validFiles);
    }
  }

  downloadExcel(): void {
    if (this.uploadedFiles == null || this.uploadedFiles?.length <= 0 || !this.executionId) {
      return;
    }

    this.loadingServiceService.chargeTextLoading('Cargardo Excel Masivo...');
    this.loadingServiceService.activateLoading(true);
    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0]);
    formData.append('executionId', this.executionId.toString());

    this.alfaMainService.loadingExcelMassive(this.executionId.toString(), formData).subscribe({
      next: () => {
        this.cancelLoading();
        Swal.fire({
          text: 'Archivo cargado correctamente en el tramite',
          icon: 'success',
          showConfirmButton: false,
          timer: 4000
        }).then(() => this.cancelUpload(true));
      },
      error: () => {
        this.cancelLoading();
        Swal.fire({
          text: 'Error al cargar excel masivo, consulte al administrador',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000
        }).then(() => this.cancelUpload(null));
      }
    });
  }

  cancelLoading(){
    this.loadingServiceService.activateLoading(false);
    this.loadingServiceService.chargeTextLoading('');
  }

  cancelUpload(value:boolean | null) {
    this.isUploading = false;
    this.dialogRef.close(value);
  }
}
