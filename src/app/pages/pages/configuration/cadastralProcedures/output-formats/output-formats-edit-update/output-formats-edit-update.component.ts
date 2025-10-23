import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  FooterTemplateModel,
  HeaderTemplateModel,
  OutFormatModel
} from '@shared/interfaces';

import { QuillEditorComponent } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputComponent } from '@shared/components';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { STRUCTURE_HTML_FOOTER, STRUCTURE_HTML_HEADER } from '../../../../../../apps/constants/general/constants';
import { MatIconButton } from '@angular/material/button';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';


// AddEditInformationDocumentAssociated
export interface AddOutputFormats{
  type: 'edit' | 'new';
  documentAssociated: OutFormatModel | undefined;
  outTemplateId: number | undefined;
}

@Component({
  selector: 'vex-document-associated-edit-update',
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
    CommonModule,
    MatIconModule,
    QuillEditorComponent,
    MatDialogModule,
    MatCardModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    InputComponent,
    MatIconButton
  ],
  templateUrl: './output-formats-edit-update.component.html',
  styleUrls: [
    './output-formats-edit-update.component.scss',
  ],
})
export class OutputFormatsEditUpdateComponent implements OnInit {
 readonly defaults = inject<AddOutputFormats>(MAT_DIALOG_DATA);
  userSesion:DecodeJwt | null = null;
  form = this.fb.group({
    content: new UntypedFormControl('', [Validators.required]),
    headerTemplateId: new UntypedFormControl('',),
    footerTemplateId: new UntypedFormControl('',),
    templateCode: new UntypedFormControl('', [Validators.required]),
  });


  headerTemplate:string = STRUCTURE_HTML_HEADER ;
  footerTemplate:string = STRUCTURE_HTML_FOOTER;

  @ViewChild('quillEditor', { static: false }) quillEditor?: QuillEditorComponent;

  editorConfig = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Tamaños de encabezado
      ['bold', 'italic', 'underline', 'strike'], // Estilos de texto
      [{ color: [] }, { background: [] }], // Colores de texto y fondo
      [{ align: [] }], // Alineación
      ['blockquote', 'code-block'], // Bloques de cita y código
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas
      ['link', 'image', 'video'], // Enlaces, imágenes, videos
      ['clean'], // Botón para limpiar el formato
      ['table'], // Opción para tablas (requiere un módulo extra)
    ],
    clipboard: {
      matchVisual: false, // Evita modificaciones visuales en el DOM
    },
  };

   constructor(
      // @Inject(MAT_DIALOG_DATA) public defaults: any,
      private dialogRef: MatDialogRef<AddOutputFormats>,
      private fb: FormBuilder,
      private sanitizer: DomSanitizer,
       private userService:UserService
    ) {
      this.form.get('content')?.setValue(this.defaults.documentAssociated?.htmlTemplate
      );
    }

    ngOnInit() {
      this.getUserSession();
      if (this.defaults.type === 'edit') {
        const htmlService = `${this.defaults.documentAssociated?.htmlTemplate}`;

         // Establecer HTML como contenido inicial
        // Configurar contenido inicial para Quill
        this.setQuillContent(htmlService);
        this.form.get('content')?.setValue(htmlService);
        const headerIdSet = this.defaults.documentAssociated?.headerTemplate?.outTemplateId;
        this.form.get('headerTemplateId')?.setValue(headerIdSet);

        const footerIdSet = this.defaults.documentAssociated?.footerTemplate?.outTemplateId;
        this.form.get('footerTemplateId')?.setValue(footerIdSet);

        this.form.get('templateCode')?.setValue(this.defaults.documentAssociated?.templateCode);

      }
    }

    private setQuillContent(html: string) {
      if (this.quillEditor?.quillEditor) {
        this.quillEditor.quillEditor.clipboard.dangerouslyPasteHTML(html);
      } else {
        console.error('La instancia de QuillEditor no está disponible.');
      }
    }

    public getUserSession(){
      this.userSesion = this.userService.getUser();
    }

    sanitizeHtml(html?: string): SafeHtml {
      return this.sanitizer.bypassSecurityTrustHtml(html || '');
    }

    handleDialogClose(): void {
      // if (this.editForm.dirty || this.traditionalRatingForm.dirty) {
      //   this.closingDialog.fire().then((result) => {
      //     if (result.isConfirmed) {
      //       this.dialogRef.close();
      //     }
      //   });
      // } else {
      // }
      this.dialogRef.close();
    }


    saveTemplate() {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      if (this.defaults.type === 'new') {
        const createdAssociatedDocument = this.generateModelDirecctionModel(this.form.value);
        this.dialogRef.close(createdAssociatedDocument);
      }else{

        const createdAssociatedDocument = this.generateModelDirecctionModel(this.form.value,);
        this.dialogRef.close(createdAssociatedDocument);
      }
    }


    // PROCESO ACTUALIZAR MODELO DE DATOS DetailBasicInformationAddress
    public generateModelDirecctionModel(value: Record<string, string | boolean>): OutFormatModel | undefined {
      // Obtener el contenido HTML desde el editor Quill
      let textFormatHtml = '';
      if (this.quillEditor?.quillEditor) {
        textFormatHtml = this.quillEditor.quillEditor.root.innerHTML;
      } else {
        console.error('La instancia de QuillEditor no está disponible.');
      }
      const fullHtmlDocument = this.cleanHtml(this.headerTemplate +textFormatHtml + this.footerTemplate);
      if (this.defaults.type === 'new') {
        const createBasicInformationAddress: OutFormatModel = {
          templateCode: this.templateCode?.value || '',
          htmlTemplate: fullHtmlDocument || '',
          isSinged: value['isSinged'] as boolean ?? false,
          createdBy: value['createdBy'] as string ?? this.userSesion?.sub,
          createdAt: value['createdAt'] as string ?? this.getCurrentFormattedDate(),
          updatedBy: value['updatedBy'] as string ?? null,
          updatedAt: value['updatedAt'] as string ?? null,
        };

        if (this.headerTemplateId?.value) {
          createBasicInformationAddress.headerTemplate = new HeaderTemplateModel(
            Number(this.headerTemplateId.value)
          );
        }
        if (this.footerTemplateId?.value) {
          createBasicInformationAddress.footerTemplate = new FooterTemplateModel(
            Number(this.footerTemplateId.value)
          );
        }

        return createBasicInformationAddress;
      } else if (this.defaults.type === 'edit') {

        const fullHtmlDocument = this.cleanHtml(this.headerTemplate + textFormatHtml + this.footerTemplate);
        const createBasicInformationAddress: OutFormatModel = {
          outTemplateId: this.defaults.outTemplateId,
          templateCode: this.templateCode?.value || '',
          htmlTemplate: fullHtmlDocument || '',
          isSinged: this.defaults.documentAssociated?.isSinged || false,
          createdBy: this.defaults.documentAssociated?.createdBy || '',
          createdAt: this.defaults.documentAssociated?.createdAt || '',
          updatedBy: this.userSesion?.sub || '',
          updatedAt: this.getCurrentFormattedDate(),
        };

        if (this.headerTemplateId?.value) {
          createBasicInformationAddress.headerTemplate = new HeaderTemplateModel(
            Number(this.headerTemplateId.value)
          );
        }
        if (this.footerTemplateId?.value) {
          createBasicInformationAddress.footerTemplate = new FooterTemplateModel(
            Number(this.footerTemplateId.value)
          );
        }

        return createBasicInformationAddress;
      }

      return undefined;
    }

    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    getCurrentFormattedDate(): string {
      const now = new Date();
      return this.formatDate(now);
    }

    cleanHtml(html: string): string {
     // 1. Elimina etiquetas <span> innecesarias
      let cleanedHtml = html.replace(/<span[^>]*>|<\/span>/g, '');

      // 2. Elimina <p>{style}</p> si está inmediatamente después de <body>
      cleanedHtml = cleanedHtml.replace(/(<body[^>]*>\s*)<p>\{style\}<\/p>\s*/i, '$1');

      return cleanedHtml;
    }


    get content(){
      return this.form.get('content');
    }

    get headerTemplateId(){
      return this.form.get('headerTemplateId');
    }
    get footerTemplateId(){
      return this.form.get('footerTemplateId');
    }

    get templateCode(){
      return this.form.get('templateCode');
    }
}
