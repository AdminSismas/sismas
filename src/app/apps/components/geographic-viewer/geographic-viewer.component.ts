import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { QueryParametersGeographicVie } from '../../interfaces/query-parameters-geographic-vie';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentInfoSchema } from '../../interfaces/content-info-schema';
import { MatInputModule } from '@angular/material/input';
import { BaunitHead } from '../../interfaces/information-property/baunit-head.model';
import { InformationGeographicService } from '../../services/territorial-organization/information-geographic.service';
import { environment as envi } from '../../../../environments/environments';
import { InputComponent } from '../input/input.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { LoadingAppComponent } from '../loading-app/loading-app.component';

@Component({
  selector: 'vex-geographic-viewer-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    NgIf,
    MatButtonModule,
    MatDialogClose,
    MatDividerModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    MatInputModule,
    InputComponent,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
    LoadingAppComponent
  ],
  templateUrl: './geographic-viewer.component.html'
})
export class GeographicViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('postForm', { static: true }) postForm?: ElementRef;
  queryParameters!: QueryParametersGeographicVie;
  baunitHead!: BaunitHead;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema | undefined,
    private dialogRef: MatDialogRef<GeographicViewerComponent>,
    private geographicService: InformationGeographicService
  ) {
  }

  ngOnInit(): void {
    if (!this.defaults) {
      this.closed();
      return;
    }
    this.baunitHead = this.defaults?.content;

    if (this.baunitHead.cadastralNumber == null) {
      this.closed();
    }
  }

  ngAfterViewInit(): void {
    this.getInformationGeographicViewer();
  }

  getInformationGeographicViewer() {
    if(!this.baunitHead || !this.baunitHead.cadastralNumber){
      return;
    }
    this.geographicService.getInfoGeographicViewer(this.baunitHead.cadastralNumber, '')
      .subscribe(
        {
          error: () => this.queryParameters = new QueryParametersGeographicVie(),
          next: (result: QueryParametersGeographicVie) => {
            this.queryParameters = new QueryParametersGeographicVie(result);
            this.formatElementOfForm();
          }
        }
      );
  }

  formatElementOfForm() {
    if (this.queryParameters == null) {
      return;
    }
    if (this.queryParameters.page == null || this.queryParameters.page?.length < 0) {
      this.queryParameters.page = `${envi.query_parameters_page}`;
    }
    if (this.queryParameters.zoom == null || this.queryParameters.zoom == 0) {
      this.queryParameters.zoom = 30;
    }
    for (const [parametersKey, parametersValue] of Object.entries(this.queryParameters)) {
      let value = typeof parametersValue === 'object' || Array.isArray(parametersValue) ? JSON.stringify(parametersValue) : parametersValue;
      let element: HTMLInputElement | null = document.getElementById(parametersKey) as HTMLInputElement;
      if (element != null && parametersValue != null) {
        element.value = value;
        element.textContent = value;
      }
      let elementArea: HTMLTextAreaElement | null = document.getElementById(parametersKey) as HTMLTextAreaElement;
      if (elementArea != null && parametersValue != null) {
        elementArea.value = value;
        elementArea.textContent = value;
      }
    }
    this.openGeographicViewerMain();
  }

  openGeographicViewerMain(): void {
    if (this.postForm === null || this.postForm === undefined) {
      return;
    }
    const method: string = this.postForm?.nativeElement.method;
    if (method === 'POST' || method === 'post') {
      this.postForm.nativeElement.target = 'info_current';
    }
    this.postForm.nativeElement.action = `${envi.url_viewer}${envi.post_path_viewer}`;
    this.postForm.nativeElement.submit();
    console.log(this.postForm.nativeElement);
    this.closed();
  }

  closed() {
    this.dialogRef.close();
  }

}
