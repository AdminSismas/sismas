import { Component, effect, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CompleteDocsService } from '@features/bpm-workflows/services/complete/complete-docs.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TitleCasePipe } from '@angular/common';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { PayloadCompleteDocs } from '@features/bpm-workflows/interfaces/complete/payload-complete-docs.interface';
import { Requirement } from '@features/bpm-workflows/interfaces/complete/requirements.interface';
import Swal from 'sweetalert2';
import { SimpleResponse } from '@shared/models';

@Component({
  selector: 'bpm-complete-docs',
  standalone: true,
  host: {
    class: 'h-full w-full overflow-hidden block'
  },
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormField,
    MatInputModule,
    MatProgressSpinnerModule,
    TitleCasePipe,
    MatButtonModule
  ],
  templateUrl: './complete-docs.component.html'
})
export class CompleteDocsComponent {
  /* ---- Injects ---- */
  private readonly _fb = inject(FormBuilder);
  private readonly completeDocsService = inject(CompleteDocsService);
  private readonly sanitizer = inject(DomSanitizer);

  /* ---- Inputs ---- */
  readonly resources = input.required<string[]>();
  readonly executionId = input.required<string>();
  readonly mode = input.required<number>();

  /* ----- Signals ----- */
  paragraphs = signal<(Requirement & { idStr: string })[] | null>(null);
  documentForm = signal<FormGroup>(this._fb.group({}));
  documentUrl = signal<SafeUrl | null>(null);
  documentIsLoading = signal<boolean>(false);

  /* ---- Constructor ---- */
  constructor() {
    this.executionIdEffect();
    this.documentFormEffect();
  }

  /* ---- Effects ---- */
  executionIdEffect() {
    effect(
      () => {
        if (this.executionId()) {
          this.getRequirements();
          this.getDocument({ requirements: [] });
        }
      },
      { allowSignalWrites: true }
    );
  }

  documentFormEffect() {
    effect(
      () => {
        if (!this.paragraphs() || this.paragraphs()!.length === 0) {
          this.documentForm.set(this._fb.group({}));
          return;
        }

        const documentFormObject: Record<string, FormControl> = {};

        this.paragraphs()!.forEach((paragraph) => {
          documentFormObject[paragraph.idStr] = new FormControl(false);
          documentFormObject[paragraph.idStr + ' additionalText'] =
            new FormControl('');
        });

        this.documentForm.set(this._fb.group(documentFormObject));
      },
      { allowSignalWrites: true }
    );
  }

  /* ---- Methods ---- */
  getRequirements() {
    this.completeDocsService
      .getRequirements(this.executionId())
      .pipe(
        map((reqs) =>
          reqs.map((req) => ({
            ...req,
            idStr: `${req.reqId}`
          }))
        )
      )
      .subscribe((paragraphs) => {
        this.paragraphs.set(paragraphs);
      });
  }

  getDocument(payload: PayloadCompleteDocs) {
    this.documentIsLoading.set(true);
    this.completeDocsService
      .getCompleteDocs(this.executionId(), payload)
      .subscribe({
        next:(blob) => {
        Swal.fire({
          icon: 'success',
          text: 'Se ha modificado el documento correctamente',
          timer: 20000,
          showConfirmButton: false
        });
        this.documentUrl.set(this.sanitizerUrl(blob));
        this.documentIsLoading.set(false);
      },
      error: async (blob: Blob) => {
        const errorString = await blob.text();
        const errorJson: SimpleResponse = JSON.parse(errorString);
        Swal.fire({
          icon: 'error',
          text: errorJson.message ?? 'Error al generar el documento',
          timer: 30000,
          showConfirmButton: true
        });
        this.documentIsLoading.set(false);
        throw errorJson.message;
      }
    });
  }

  sanitizerUrl(blob: Blob): SafeUrl {
    const newBlob = new Blob([blob], { type: 'application/pdf' });
    const url = URL.createObjectURL(newBlob);

    // Usar HttpParams para construir los parámetros de visualización del PDF
    const params = new HttpParams()
      .set('pagemode', 'none')
      .set('navpanes', '0');

    // Agregar parámetros como fragmento de URL para el visor de PDF
    const urlWithParams = `${url}#${params.toString()}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
  }

  onAccept() {
    if (!this.executionId()) return;

    const payload = this.createPayload();

    this.getDocument(payload);
  }

  createPayload() {
    const payload: PayloadCompleteDocs = {
      requirements: []
    };

    const formValues = this.documentForm().value as Record<
      string,
      boolean | string
    >;

    Object.keys(formValues).forEach((key) => {
      if (key.endsWith(' additionalText')) return;

      const isChecked = formValues[key] as boolean;
      const additionalText = formValues[key + ' additionalText'] as string;

      if (isChecked) {
        payload.requirements.push({
          requirementId: +key,
          additionalText: additionalText ?? ''
        });
      }
    });
    return payload;
  }
}
