import { AfterViewInit, Component, DestroyRef, Inject, inject, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DocumentAsocietyModel, FooterTemplateModel, HeaderTemplateModel } from 'src/app/apps/interfaces/document-asociety.model';

import { QuillEditorComponent } from 'ngx-quill';
import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatIconModule } from '@angular/material/icon';

import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputComponent } from 'src/app/apps/components/input/input.component';


export interface AddEditInformationDocumentAssociated {
  type: 'edit' | 'new';
  basicInformationConstruction: DocumentAsocietyModel | undefined;
  outTempplateId: string | undefined;
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
     NgClass,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    InputComponent,
  ],
  templateUrl: './document-associated-edit-update.component.html',
  styleUrls: [
    './document-associated-edit-update.component.scss',
  ],
})
export class DocumentAssociatedEditUpdateComponent implements OnInit {
//  readonly addEditDocumentInformationData = inject<AddEditInformationDocumentAssociated>(MAT_DIALOG_DATA);
  form = this.fb.group({
    content: new UntypedFormControl('', [Validators.required]),
    headerTemplateId: new UntypedFormControl('', [Validators.required]),
    footerTemplateId: new UntypedFormControl('', [Validators.required]),

  });

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'], // Formatos básicos
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas
      [{ header: [1, 2, 3, false] }], // Encabezados
      ['link', 'image'], // Enlaces e imágenes
    ],
  };

   constructor(
      @Inject(MAT_DIALOG_DATA) public defaults: any,
      private dialogRef: MatDialogRef<DocumentAssociatedEditUpdateComponent>,
      private fb: FormBuilder,
    ) {
      // console.log('addEditDocumentInformationData: ', this.addEditDocumentInformationData);
      console.log('defaults: ', this.defaults);

      this.form.get('content')?.setValue(this.defaults?.htmlTemplate
      )
    }

    ngOnInit() {
      console.log('defaults: ', this.defaults);
      if (this.defaults.type === 'edit') {

        this.form.get('content')?.setValue(this.defaults?.htmlTemplate);
        this.form.get('headerTemplateId')?.setValue(this.defaults?.headerTemplateId?.outTemplateId);
        this.form.get('footerTemplateId')?.setValue(this.defaults?.footerTemplateId?.outTemplateId);

      }
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
        return
      }
      if (this.defaults.type === 'new') {
        let createdAssociatedDocument = this.generateModelDirecctionModel(this.form.value);
        this.dialogRef.close(createdAssociatedDocument);
      }else{

        let createdAssociatedDocument = this.generateModelDirecctionModel(this.form.value,);
        this.dialogRef.close(createdAssociatedDocument);
      }
    }


    // PROCESO ACTUALIZAR MODELO DE DATOS DetailBasicInformationAddress 
    public generateModelDirecctionModel(value:any):DocumentAsocietyModel{
      const createBasicInformationAddress: DocumentAsocietyModel = {
    
          outTempplateId: value.outTempplateId ? value.outTempplateId : '',
          templateCode: value.templateCode ? value.templateCode : '',
          htmlTemplate: this.content?.value ? this.content?.value : '',

          headerTemplateId: new HeaderTemplateModel(this.headerTemplateId?.value ? this.headerTemplateId?.value : ''),
          // headerTemplateId: this.headerTemplateId?.value ? this.headerTemplateId?.value : '',

          // footerTemplateId:  this.footerTemplateId?.value ? this.footerTemplateId?.value : '',
          footerTemplateId:  new FooterTemplateModel(this.footerTemplateId?.value ? this.footerTemplateId?.value : ''),

          isSinged: value.isSinged ? value.isSinged : false,
          createdBy:  value.createdBy ? value.createdBy : '',
          createdAt:  value.createdAt ? value.createdAt : '',
          updatedBy: value.updatedBy ? value.updatedBy : '',
          updatedAt: value.updatedAt ? value.updatedAt : '',
          schema:  value.schema ? value.schema : '',
          page: value.page ? value.page : '',
          size:  value.size ? value.size : '',
    
      
      };
      return createBasicInformationAddress;
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
}
