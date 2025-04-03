import { Component, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';
import { FormGroup } from '@angular/forms';
import { RecognitionPropertyService } from '../../../../../../../apps/services/bpm/recognition-property.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  RecognitionProperty,
  RecognitionPropertyBasic,
  TagsRecognition
} from '../../../../../../../apps/interfaces/bpm/recognitionProperty.interface';
import { getRandomInt } from '../../../../../../../apps/utils/general';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { FluidHeightDirective } from '../../../../../../../apps/directives/fluid-height.directive';
import { FluidMaxHeightDirective } from '../../../../../../../apps/directives/fluid-max-height.directive';
import {
  INPUT_FORM_VISIT,
  RES_VALIDATE_INPUTS
} from '../../../../../../../apps/constants/information-property/cadastral-recognition.constants';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ThirdPartyAffectedParticipant } from '../../../../../../../apps/interfaces/general/content-info';
import { ParticipantsServiceService } from '../../../../../../../apps/services/users/participants-service.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ParticipantTableDialogComponent
} from '../../../../../../../apps/components/bpm/participant-table-dialog/participant-table-dialog.component';
import { MODAL_MEDIUM } from '../../../../../../../apps/constants/general/constants';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import { LoadingServiceService } from '../../../../../../../apps/services/general/loading-service.service';
import {
  TableThirdPartyAffectedComponent
} from '../../../../../../../apps/components/general-components/table-third-party-affected/table-third-party-affected.component';

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
    SweetAlert2Module,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    FluidHeightDirective,
    FluidMaxHeightDirective,
    TableThirdPartyAffectedComponent
  ],
  templateUrl: './res-validate.component.html',
  styleUrl: './res-validate.component.scss'
})
export class ResValidateComponent implements OnInit {

  idComponent: string = getRandomInt(123459887).toString();
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
  initTags = signal<TagsRecognition | RecognitionProperty | RecognitionPropertyBasic | null>(null);

  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);
  private recognitionProperty: RecognitionPropertyService = inject(RecognitionPropertyService);
  private dialog: MatDialog = inject(MatDialog);
  private participantsService: ParticipantsServiceService = inject(ParticipantsServiceService);
  private loadingServiceService: LoadingServiceService = inject(LoadingServiceService);

  successSendTags = viewChild<SwalComponent>('successSendTags');
  errorSendTags = viewChild<SwalComponent>('errorSendTags');

  existThirdPartyAffected = signal(false);

  ngOnInit() {
    if (this.idComponent?.length > 0) {
      this.idComponent =
        this.idComponent + getRandomInt(1345789) + 'validate24' + getRandomInt(10);
    } else {
      this.idComponent = getRandomInt(987541) + 'validate24' + getRandomInt(10);
    }

    this.loadingServiceService.activateLoading(true);
    this.loadPdf();
    this.getTags();
    this.loadingServiceService.deActivate(1400);
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

  brToLineJumps(tags: TagsRecognition) {
    Object.keys(tags).forEach((key) => {
      const valueTag = (tags as Record<string, string>)[key];
      if (!valueTag) return;

      const tag = `${valueTag}`.replace(/<br>/g, '\n');
      (tags as Record<string, string>)[key] = tag;
      return;
    });
    this.initTags.set(tags);
  }

  getTags() {
    this.recognitionProperty.getRecognitionPropertyTags(this.executionId()).subscribe({
      next: (tags) => {
        this.brToLineJumps(tags);
      }
    });
  }

  lineJumpsToBr(tags: TagsRecognition) {
    Object.keys(tags).forEach((key) => {
      const valueTag = (tags as Record<string, string>)[key];
      if (!valueTag) return;

      const tag = `${valueTag}`.replace(/\n/g, '<br>');
      (tags as Record<string, string>)[key] = tag;
      return;
    });
  }

  saveTags() {
    const { value } = this.form();

    this.lineJumpsToBr(value);

    this.recognitionProperty
      .sendTags(this.executionId(), value)
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
  get inputs() {
    return RES_VALIDATE_INPUTS;
  }

}
