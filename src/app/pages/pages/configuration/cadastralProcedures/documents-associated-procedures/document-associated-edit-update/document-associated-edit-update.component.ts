import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DocumentAsocietyModel } from 'src/app/apps/interfaces/document-asociety.model';

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
    FormsModule,
     NgClass,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './document-associated-edit-update.component.html',
  styleUrls: [
    './document-associated-edit-update.component.scss',
  ],
})
export class DocumentAssociatedEditUpdateComponent {

  form = this.fb.group({
    content: new UntypedFormControl('', [])
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
      console.log('defaults: ', this.defaults);
      this.form.get('content')?.setValue(this.defaults?.htmlTemplate
      )
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
      console.log('Form',this.form.value);
    }

    
}
