import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  inject,
  computed
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

@Component({
  selector: 'vex-report-master',
  standalone: true,
  imports: [
    MuncipalityCodePipe,
    MatFormField,
    MatIconModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './report-master.component.html'
})
export class ReportMasterComponent implements OnInit {
  reportManagerService = inject(ReportManagerService);

  dataSource = signal<MatTableDataSource<ReportType>>(new MatTableDataSource());

  protected readonly columns: TableColumn<ReportType>[] = [
    { property: 'action', label: 'Accion', type: 'button' },
    { property: 'name', label: 'Nombre', type: 'text' },
    { property: 'municipality', label: 'Municipio', type: 'text' },
    { property: 'outputFormat', label: 'Tipo de archivo', type: 'text' }
  ];

  displayedColumns = computed(() => {
    return this.columns.map((column) => column.property);
  });

  @Output() viewDetail = new EventEmitter<boolean>();
  @Output() selectedCategory = new EventEmitter<ReportCategory>();

  ngOnInit(): void {
    this.loadCategories();
  }

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

    console.log(reportId);

    if ([3, 4].includes(reportId)) {
      const zoneType: 'rural' | 'urbano' = reportId === 3 ? 'urbano' : 'rural';
      this.reportManagerService.getUpdateReport(municipality, environment.departments, zoneType)
      .subscribe((response) => {
        const nameMunicipality = municipalityCodePipe.transform(municipality);
        const filename = `${name.toUpperCase()} ${nameMunicipality.toUpperCase()}.xlsx`;
        const type = response.headers.get('content-type') as string;
        this.downloadFile(response.body!, type, filename);
      });
      return;
    }

    this.reportManagerService.getExcelReport(urlEnd, municipality).subscribe({
      next: (response) => {
        const nameMunicipality = municipalityCodePipe.transform(municipality);
        const filename = `${name.toUpperCase()} ${nameMunicipality.toUpperCase()}.xlsx`;
        const type = response.headers.get('content-type') as string;
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
