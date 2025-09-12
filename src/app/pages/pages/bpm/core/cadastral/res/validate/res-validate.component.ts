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
import { HttpErrorResponse } from '@angular/common/http';
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
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { FluidHeightDirective } from '../../../../../../../apps/directives/fluid-height.directive';
import { FluidMaxHeightDirective } from '../../../../../../../apps/directives/fluid-max-height.directive';
import { RES_VALIDATE_INPUTS } from '../../../../../../../apps/constants/information-property/cadastral-recognition.constants';
import { LoadingServiceService } from '../../../../../../../apps/services/general/loading-service.service';
import { TableThirdPartyAffectedComponent } from '../../../../../../../apps/components/general-components/table-third-party-affected/table-third-party-affected.component';
import { ResService } from 'src/app/apps/services/bpm/core/res.service';
import { Observable } from 'rxjs';

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
  executionId = input.required<string>();
  resources = input.required<string[]>();
  mode = input.required<1 | 2>();

  private sanitizer = inject(DomSanitizer);
  private resService = inject(ResService);
  private recognitionProperty: RecognitionPropertyService = inject(
    RecognitionPropertyService
  );
  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );

  isLoading = signal<boolean>(true);
  id = signal<string>('');
  basic_url = signal(
    `${environment.url}:${environment.port}/${'bpmResolution'}/${'preview'}/`
  );
  pdfUrl = signal<SafeUrl>('');
  firstTab = signal<string>('Resolución generada');
  secondTab = signal<string>('Textos resolución');
  thirdTab = signal<string>('Participantes');
  form = signal<FormGroup>(new FormGroup({}));
  initTags = signal<
    TagsRecognition | RecognitionProperty | RecognitionPropertyBasic | null
  >(null);
  existThirdPartyAffected = signal(false);

  successSendTags = viewChild<SwalComponent>('successSendTags');
  errorSendTags = viewChild<SwalComponent>('errorSendTags');

  ngOnInit() {
    this.loadingServiceService.activateLoading(true);
    this.loadPdf();
    this.getTags();
    this.loadingServiceService.deActivate(1400);
  }

  loadPdf() {

    let subscription: Observable<Blob>;
    if (this.mode() === 1){
      subscription = this.resService.getResValidateDoc(this.executionId());
    } else {
      subscription = this.resService.getNoProcedeDoc(this.executionId());
    }

    console.log(subscription);

    subscription.subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(blob)
          )
        );
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.pdfUrl.set('error');
        
        throw error;
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
    this.recognitionProperty
      .getRecognitionPropertyTags(this.executionId())
      .subscribe({
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

    this.recognitionProperty.sendTags(this.executionId(), value).subscribe({
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
