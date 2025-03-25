import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environments';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';
import { RES_VALIDATE_INPUTS } from 'src/app/apps/constants/bpm/res-validate.constants';
import { FormGroup } from '@angular/forms';
import { VisitaService } from 'src/app/apps/services/bpm/visita.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TagsReconocimiento } from 'src/app/apps/interfaces/bpm/visita.interface';

@Component({
  selector: 'vex-res-validate',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DynamicFormsComponent,
    SweetAlert2Module
  ],
  templateUrl: './res-validate.component.html',
  styles: `
    .tab-body {
      height: calc(100vh - 190px);
    }
  `
})
export class ResValidateComponent implements OnInit {
  executionId = input.required<string>();
  resources = input.required<string[]>();
  isLoading = signal<boolean>(true);
  id = signal<string>('');
  basic_url = signal(
    `${environment.url}:${environment.port}/${'bpmResolution'}/${'preview'}/`
  );
  pdfUrl = signal<SafeUrl>('');
  firstTab = signal<string>('Resolución generada');
  secondTab = signal<string>('Textos resolución');
  form = signal<FormGroup>(new FormGroup({}));
  initTags = signal<TagsReconocimiento>({});

  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);
  private visitaService = inject(VisitaService);

  successSendTags = viewChild<SwalComponent>('successSendTags');
  errorSendTags = viewChild<SwalComponent>('errorSendTags');

  get inputs() {
    return RES_VALIDATE_INPUTS;
  }

  ngOnInit() {
    this.loadPdf();
    this.getTags();
  }

  loadPdf() {
    const urlComplete = `${this.basic_url()}${this.executionId()}`;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(urlComplete, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(blob)
          )
        );
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        console.error('Error al cargar el documento PDF:');
        this.pdfUrl.set('error');
      }
    });
  }

  reloadPdf() {
    this.isLoading.set(true);
    this.loadPdf();
  }

  getTags() {
    this.visitaService.getTags(this.executionId()).subscribe({
      next: (response) => {
        console.log(response);
        this.initTags.set(response);
      }
    });
  }

  saveTags() {
    this.visitaService
      .sendTags(this.executionId(), this.form().value)
      .subscribe({
        next: () => {
          this.successSendTags()!.fire();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
          this.errorSendTags()!.fire();
        }
      });
  }
}
