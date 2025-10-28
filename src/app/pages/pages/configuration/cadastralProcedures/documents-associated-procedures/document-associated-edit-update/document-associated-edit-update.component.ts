import { Component, inject, OnInit } from '@angular/core';
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
import { InputComponent } from '@shared/ui/input/input.component';import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { MatIconButton } from '@angular/material/button';

export interface AddEditInformationDocumentAssociated {
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
  templateUrl: './document-associated-edit-update.component.html',
  styleUrls: [
    './document-associated-edit-update.component.scss',
  ],
})
export class DocumentAssociatedEditUpdateComponent implements OnInit {
 readonly defaults = inject<AddEditInformationDocumentAssociated>(MAT_DIALOG_DATA);
  userSesion:any | null = null;
  form = this.fb.group({
    content: new UntypedFormControl('', [Validators.required]),
    headerTemplateId: new UntypedFormControl('',),
    footerTemplateId: new UntypedFormControl('',),
    templateCode: new UntypedFormControl('', [Validators.required]),


  });

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
  };

   constructor(
      // @Inject(MAT_DIALOG_DATA) public defaults: any,
      private dialogRef: MatDialogRef<DocumentAssociatedEditUpdateComponent>,
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
        this.form.get('content')?.setValue(htmlService);

        const headerIdSet = this.defaults.documentAssociated?.headerTemplate?.outTemplateId;
        this.form.get('headerTemplateId')?.setValue(headerIdSet);

        const footerIdSet = this.defaults.documentAssociated?.footerTemplate?.outTemplateId;
        this.form.get('footerTemplateId')?.setValue(footerIdSet);

        this.form.get('templateCode')?.setValue(this.defaults.documentAssociated?.templateCode);

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


    saveTemplate(): any {
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
    public generateModelDirecctionModel(value: any): OutFormatModel | undefined {
      if (this.defaults.type === 'new') {
        const todayDay = new Date();
        const createBasicInformationAddress: OutFormatModel = {

            // outTemplateId: ,
            templateCode: this.templateCode?.value ? this.templateCode?.value : '',
            htmlTemplate: this.content?.value ? this.content?.value : '',


            isSinged: value.isSinged ? value.isSinged : false,
            createdBy:  value.createdBy ? value.createdBy : this.userSesion?.sub,
            createdAt:  value.createdAt ? value.createdAt : this.getCurrentFormattedDate(),

            updatedBy: value.updatedBy ? value.updatedBy : null,
            updatedAt: value.updatedAt ? value.updatedAt : null,
            // schema:  value.schema ? value.schema : '',
            // page: value.page ? value.page : '',
            // size:  value.size ? value.size : '',


        };
        if(this.headerTemplateId?.value){
          createBasicInformationAddress.headerTemplate = new HeaderTemplateModel(this.headerTemplateId?.value ? Number(this.headerTemplateId?.value) : undefined);

        }
        // headerTemplateId: this.headerTemplateId?.value ? this.headerTemplateId?.value : '',

        // footerTemplateId:  this.footerTemplateId?.value ? this.footerTemplateId?.value : '',
        if(this.footerTemplateId?.value){
        createBasicInformationAddress.footerTemplate =  new FooterTemplateModel(this.footerTemplateId?.value ? Number(this.footerTemplateId?.value) : undefined);
        }

        return createBasicInformationAddress;

      }else{

          if(this.defaults.outTemplateId){

            const createBasicInformationAddress: OutFormatModel = {

              outTemplateId: this.defaults.outTemplateId ? this.defaults.outTemplateId : undefined,
              templateCode: this.templateCode?.value ? this.templateCode?.value : '',
              htmlTemplate: this.content?.value ? this.content?.value : '',
              // headerTemplate: new HeaderTemplateModel(this.headerTemplateId?.value ? Number(this.headerTemplateId?.value) : undefined),
              // footerTemplate:  new FooterTemplateModel(this.footerTemplateId?.value ? Number(this.footerTemplateId?.value) : undefined),


              isSinged: this.defaults.documentAssociated?.isSinged ? this.defaults.documentAssociated?.isSinged : false,
              createdBy:  this.defaults.documentAssociated?.createdBy ? this.defaults.documentAssociated?.createdBy : '',
              createdAt:  this.defaults.documentAssociated?.createdAt ? this.defaults.documentAssociated?.createdAt : '',
              updatedBy: this.defaults.documentAssociated?.updatedBy ? this.defaults.documentAssociated?.updatedBy : undefined,
              updatedAt: this.defaults.documentAssociated?.updatedAt ? this.defaults.documentAssociated?.updatedAt : undefined,

          };

          if(this.headerTemplateId?.value){
            createBasicInformationAddress.headerTemplate = new HeaderTemplateModel(this.headerTemplateId?.value ? Number(this.headerTemplateId?.value) : undefined);

          }
          if(this.footerTemplateId?.value){
          createBasicInformationAddress.footerTemplate =  new FooterTemplateModel(this.footerTemplateId?.value ? Number(this.footerTemplateId?.value) : undefined);
          }

          return createBasicInformationAddress;


          }

      }
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
