import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// recursos de vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';

// recursos de angular material
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

// recursos de archivos locales
import { contentInfoAttachment } from 'src/app/apps/interfaces/content-info-attachment.model';
import { environment } from 'src/environments/environments';
import { MODEL_METADATA_PROPERTIES } from '../../constants/attachment.constant';





@Component({
  selector: 'vex-view-file-document-management',
  templateUrl: './view-file-document-management.component.html',
  styleUrl: './view-file-document-management.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatTabsModule,
    NgClass,
    NgFor,
    NgIf
  ],
})



export class ViewFileDocumentManagementComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  showMetadataView:boolean = false;
  metadata: contentInfoAttachment;
  properties = MODEL_METADATA_PROPERTIES;

  executionId: string = "37";
  idAtachment: number;
  originalFileName: string;

  basic_url: string = `${environment.url}:${environment.port}${environment.bpmAttachment}`;
  urlSafe: SafeUrl = '';



  /* ============== CONSTRUCTOR ============== */
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ViewFileDocumentManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: contentInfoAttachment,
  ) {
    this.metadata = data;
    this.idAtachment = this.metadata.id;
    this.originalFileName = this.metadata.originalFileName;
  }



  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.urlSafe = this.urlPdfViewer();
  }



  /* ------- Meth. HTML ------- */
  switchViewDocMetaData(): void {
    this.showMetadataView = !this.showMetadataView;

    if (this.showMetadataView) {
      this.dialogRef.updateSize('98%', 'auto');
      this.dialogRef.updatePosition({ top: '5%' });
    } else {
      this.dialogRef.updateSize('98%', '86%');
      this.dialogRef.updatePosition({ top: '5%' });
    }
  }



  /* ------- Meth. Common ------- */
  urlPdfViewer(): SafeUrl {
    const urlComplete: string = `${this.basic_url}/${this.executionId}/${this.idAtachment}/${this.originalFileName}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlComplete);
  }



  /* ------- Meth. Modal load file ------- */



  /* ------- Meth. Services ------- */
  


}
