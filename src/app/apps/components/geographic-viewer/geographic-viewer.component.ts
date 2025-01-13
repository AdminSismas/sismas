import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { CommonModule, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { QueryParametersGeographicVie } from '../../interfaces/query-parameters-geographic-vie';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentInfoSchema } from '../../interfaces/content-info-schema';
import { BaunitHead } from '../../interfaces/information-property/baunit-head.model';
import { InformationGeographicService } from '../../services/territorial-organization/information-geographic.service';
import { environment as envi } from '../../../../environments/environments';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { LoadingAppComponent } from '../loading-app/loading-app.component';

@Component({
  selector: 'vex-geographic-viewer-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatDialogClose,
    MatDividerModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatDialogContent,
    MatDialogTitle,
    MatIconModule,
    LoadingAppComponent,
    CommonModule
  ],
  templateUrl: './geographic-viewer.component.html'
})
export class GeographicViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('postForm', { static: true }) postForm?: ElementRef;
  queryParameters!: QueryParametersGeographicVie;
  baunitHead!: BaunitHead;
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';

  get dialogTitle(): string {
    return this.hasError ? 'Error' : 'Visor Geográfico';
  }



  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema | undefined,
    private dialogRef: MatDialogRef<GeographicViewerComponent>,
    private geographicService: InformationGeographicService,
    private cdr: ChangeDetectorRef
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

  getInformationGeographicViewer(): void {
    if (!this.baunitHead || !this.baunitHead.cadastralNumber) {
      this.handleError('Datos insuficientes para realizar la consulta.');
      return;
    }

    this.geographicService.getInfoGeographicViewer(this.baunitHead.cadastralNumber, '')
  .subscribe({
    next: (result: QueryParametersGeographicVie) => {
      this.isLoading = false;
      this.hasError = false;
      this.queryParameters = new QueryParametersGeographicVie(result);
      this.formatElementOfForm();
    },
    error: (error) => {
      this.handleError(error.message);
    }
  });
  }


  formatElementOfForm(): void {
    if (!this.queryParameters) {
      return;
    }
    for (const [key, value] of Object.entries(this.queryParameters)) {
      const element = document.getElementById(key) as HTMLInputElement | HTMLTextAreaElement | null;
      if (element) {
        const formattedValue = typeof value === 'object' || Array.isArray(value) ? JSON.stringify(value) : value;
        element.value = formattedValue || '';
        element.textContent = formattedValue || '';
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

  handleError(message: string, error?: any): void {
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = message;
    console.error('Error en la solicitud:', error);
    this.cdr.detectChanges();
  }

  closed() {
    this.dialogRef.close();
  }

}
