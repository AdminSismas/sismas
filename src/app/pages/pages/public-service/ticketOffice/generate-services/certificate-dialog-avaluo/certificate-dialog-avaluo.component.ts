import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CustomSelectorComponent } from 'src/app/apps/components/custom-selector/custom-selector.component';
import { InputComponent } from 'src/app/apps/components/input/input.component';
import { Certificate } from '../interfaces/certificate.interface';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { TableCadastralSearchComponent } from 'src/app/apps/components/table-cadastral-search/table-cadastral-search.component';
import { CertificateTableComponent } from '../certificate-table/certificate-table.component';
import { TableCertificateSearchComponent } from 'src/app/apps/components/table-certificate-search-avaluos/table-certificate-search.component';
import { FilterCertificateSearchComponent } from 'src/app/apps/components/table-certificate-search-avaluos/filter-certificate-search/filter-certificate-search.component';
import { ViewFileDocumentManagementComponent } from 'src/app/apps/components/view-file-document-management/view-file-document-management.component';
import { LayoutCardCadastralInformationPropertyComponentComponent } from 'src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { TableCertificateSearchAppraisalsComponent } from 'src/app/apps/components/table-certificate-search-appraisals/table-certificate-search-appraisals.component';
import { FilterCertificateSearchAppraisalsComponent } from 'src/app/apps/components/table-certificate-search-appraisals/filter-certificate-search-appraisals/filter-certificate-search-appraisals.component';

@Component({
  selector: 'vex-certificate-dialog-avaluo',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
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
    CustomSelectorComponent,
    InputComponent,
    SweetAlert2Module,
    ComboxColletionComponent,
    CertificateTableComponent,
    TableCertificateSearchAppraisalsComponent,
    FilterCertificateSearchAppraisalsComponent,
    ViewFileDocumentManagementComponent,
    LayoutCardCadastralInformationPropertyComponentComponent
  ],
  templateUrl: './certificate-dialog-avaluo.component.html',
  styleUrl: './certificate-dialog-avaluo.component.scss'
})
export class CertificateDialogAvaluoComponent implements OnInit {

  currentView: 'table' | 'search' | 'property' | 'document' = 'table';
  title = 'Certificados';
  searchData: any = {};
  selectedProperty: any;
  selectedFile: any;
  certificate!: Certificate;
 


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Certificate,
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CertificateDialogAvaluoComponent>,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.certificate = this.data;
      console.log(this.certificate.type);
    }
  }

  onSearch(data?: any): void {
    this.currentView = 'search';
    this.title = 'Búsqueda Avanzada';
    this.searchData = data || {};
  }

  // Aplicar búsqueda
  applySearch(data: any): void {
    this.searchData = data;
    this.currentView = 'table';
    this.title = 'Certificados';
    // Actualiza la tabla con los resultados
  }

  // Visualizar información predial
  onViewProperty(property: any): void {
    this.currentView = 'property';
    this.title = 'Información Predial';
    this.selectedProperty = property;
  }

  // Visualizar documento
  onViewDocument(file: any): void {
    this.currentView = 'document';
    this.title = 'Visualizador de Documento';
    this.selectedFile = file;
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
