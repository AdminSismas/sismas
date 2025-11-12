import {
  Component,
  OnInit,
  inject,
  computed,
  output
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReportCategory } from '@features/operation-support/models/reports';
import {
  ReportManagerService,
  ReportType
} from '@features/operation-support/services/reports/report-manager.service';
import { environment } from '@environments/environments';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { signal } from '@angular/core';
import { MuncipalityCodePipe } from '@shared/pipes/muncipality-code.pipe';
import { LoaderComponent } from '@shared/ui/loader/loader.component';

@Component({
  selector: 'vex-report-master',
  standalone: true,
  imports: [
    MuncipalityCodePipe,
    MatFormField,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    LoaderComponent
  ],
  templateUrl: './report-master.component.html'
})
export class ReportMasterComponent implements OnInit {
  /* ---- Injects ---- */
  reportManagerService = inject(ReportManagerService);

  /* ---- Signals ---- */
  dataSource = signal<MatTableDataSource<ReportType>>(new MatTableDataSource());
  downloadLoading = signal<boolean>(false);

  /* ---- Columns ---- */
  protected readonly columns: TableColumn<ReportType>[] = [
    { property: 'action', label: 'Accion', type: 'button' },
    { property: 'name', label: 'Nombre', type: 'text' },
    { property: 'municipality', label: 'Municipio', type: 'text' },
    { property: 'outputFormat', label: 'Tipo de archivo', type: 'text' }
  ];

  /* ---- Computed ---- */
  displayedColumns = computed(() => {
    return this.columns.map((column) => column.property);
  });

  /* ---- Outputs ---- */
  viewDetail = output<boolean>();
  selectedCategory = output<ReportCategory>();

  /* ---- Lifecycle ---- */
  ngOnInit(): void {
    this.loadCategories();
  }

  /* ---- Methods ---- */
  loadCategories() {
    this.reportManagerService
      .getCategories(environment.municipalities)
      .subscribe((categories) => {
        this.dataSource().data = categories;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource().filter = filterValue;
  }

  selectCategory(urlEnd: string, name: string, municipality: string, reportId: number) {
    const municipalityCodePipe = new MuncipalityCodePipe();

    this.downloadLoading.set(true);

    if ([3, 4].includes(reportId)) {
      const zoneType: 'rural' | 'urbano' = reportId === 3 ? 'urbano' : 'rural';
      this.reportManagerService.getUpdateReport(municipality, environment.departments, zoneType)
      .subscribe((response) => {
        const nameMunicipality = municipalityCodePipe.transform(municipality);
        const filename = `${name.toUpperCase()} ${nameMunicipality.toUpperCase()}.xlsx`;
        const type = response.headers.get('content-type') as string;

        this.downloadLoading.set(false);

        this.downloadFile(response.body!, type, filename);
      });
      return;
    }

    this.reportManagerService.getExcelReport(urlEnd, municipality).subscribe({
      next: (response) => {
        const nameMunicipality = municipalityCodePipe.transform(municipality);
        const filename = `${name.toUpperCase()} ${nameMunicipality.toUpperCase()}.xlsx`;
        const type = response.headers.get('content-type') as string;

        this.downloadLoading.set(false);

        this.downloadFile(response.body!, type, filename);
      }
    });
  }

  downloadFile(data: Blob, type: string, filename: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
