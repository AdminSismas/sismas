import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { AttachmentService } from '../../../../services/bpm/core/document/main/attachment.service';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'vex-attachment-exel-massive',
  standalone: true,
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
    MatDialogTitle,
    MatProgressSpinner
  ],
  templateUrl: './attachment-excel-massive.component.html',
  styleUrl: './attachment-excel-massive.component.scss'
})
export class AttachmentExcelMassiveComponent implements OnInit {

  id: string = getRandomInt(1264).toString() + '-attachmentExcelMassive';
  isLoading = false;
  isUploading = false;
  file: File | null = null;
  uploadedFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<AttachmentExcelMassiveComponent>,
    @Inject(MAT_DIALOG_DATA) public executionId: number,
    private attachmentService: AttachmentService
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

    this.isLoading = true;
    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0]);
    formData.append('executionId', this.executionId.toString());

  }
}
