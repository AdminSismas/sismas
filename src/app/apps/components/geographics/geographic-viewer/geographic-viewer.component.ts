// Angular framework
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// Vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
// Material
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
// Custom
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { ContentInfoSchema } from '../../../interfaces/content-info-schema';
import { environment as envi } from '../../../../../environments/environments';
import { InformationGeographicService } from '../../../services/geographics/information-geographic.service';
import { QueryParametersGeographicVie } from '../../../interfaces/query-parameters-geographic-vie';

@Component({
  selector: 'vex-geographic-viewer-main',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    // Material
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    // Custom
  ],
  templateUrl: './geographic-viewer.component.html'
})
export class GeographicViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('postForm', { static: true }) postForm?: ElementRef;
  @ViewChild('ErrorMap') private errorMap!: SwalComponent;
  queryParameters!: QueryParametersGeographicVie;
  baunitHead!: BaunitHead;
  errorMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema | undefined,
    private dialogRef: MatDialogRef<GeographicViewerComponent>,
    private geographicService: InformationGeographicService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.defaults) {
      this.dialogRef.close();
      return;
    }
    this.baunitHead = this.defaults?.content;

    if (this.baunitHead.cadastralNumber == null) {
      this.dialogRef.close();
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

    this.geographicService
      .getInfoGeographicViewer(this.baunitHead.cadastralNumber, '')
      .subscribe({
        next: (result: QueryParametersGeographicVie) => {
          this.queryParameters = new QueryParametersGeographicVie(result);
          console.log(result);
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
      const element = document.getElementById(key) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (element) {
        const formattedValue =
          typeof value === 'object' || Array.isArray(value)
            ? JSON.stringify(value)
            : value;
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
    this.dialogRef.close();
  }

  handleError(message: string, error?: any): void {
    this.errorMessage = message;
    console.error('Error en la solicitud:', error);
    this.errorMap.fire().then(() => {
      this.dialogRef.close();
    });
    this.cdr.detectChanges();
  }
}
