import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Certificate, CertificateDialogData } from '../../interfaces';
import { ViewFileDocumentManagementComponent } from '@shared/components/view-file-document-management/view-file-document-management.component';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from 'src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import {
  TableCertificateSearchComponent
} from 'src/app/apps/components/tables/table-certificate-search/table-certificate-search.component';
import {
  FilterCertificateSearchComponent
} from 'src/app/apps/components/tables/table-certificate-search/filter-certificate-search/filter-certificate-search.component';

@Component({
  selector: 'vex-certificate-dialog',
  standalone: true,
  imports: [
    // CommonModule,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatStepperModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
    SweetAlert2Module,
    TableCertificateSearchComponent,
    FilterCertificateSearchComponent,
    ViewFileDocumentManagementComponent,
    LayoutCardCadastralInformationPropertyComponentComponent
  ],
  templateUrl: './certificate-dialog.component.html',
  styleUrl: './certificate-dialog.component.scss'
})
export class CertificateDialogComponent implements OnInit {

  currentView: 'table' | 'search' | 'property' | 'document' = 'search';
  title = 'Certificados';
  searchData: Event = {} as Event;
  certificate!: Certificate;


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: CertificateDialogData,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.certificate = this.data.certificate;
    }
  }

  // Aplicar búsqueda
  applySearch(data: Event): void {
    this.searchData = data;
    this.currentView = 'table';
    this.title = 'Certificados';
    // Actualiza la tabla con los resultados
  }

  // Cerrar vistas secundarias
  closeSearch(): void {
    this.currentView = 'table';
    this.title = 'Certificados';
  }

  closePropertyView(): void {
    this.currentView = 'table';
    this.title = 'Certificados';
  }

  closeDocumentView(): void {
    this.currentView = 'table';
    this.title = 'Certificados';
  }


}
