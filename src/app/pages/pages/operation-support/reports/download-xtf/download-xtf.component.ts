import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { XtfFiles } from '../services/xtf-service.service';
import { XtfServiceService } from '../services/xtf-service.service';
import { UserService } from '../../../auth/login/services/user.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from 'src/app/apps/components/general-components/loader/loader.component';

@Component({
  selector: 'vex-download-xtf',
  standalone: true,
  imports: [
    LoaderComponent,
    MatButtonModule,
    MatFormField,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    VexBreadcrumbsComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexSecondaryToolbarComponent,
  ],
  templateUrl: './download-xtf.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DownloadXtfComponent implements OnInit {
  // Injects
  xtfService = inject(XtfServiceService);
  userService = inject(UserService);

  // Properties
  readonly columns: TableColumn<XtfFiles>[] = [
    { property: 'name', label: 'Nombre', type: 'text' },
    { property: 'user', label: 'Usuario', type: 'text' },
    { property: 'type', label: 'Tipo', type: 'text' }
  ];

  // Signals
  dataSource = signal<MatTableDataSource<XtfFiles>>(
    new MatTableDataSource<XtfFiles>()
  );
  isLoading = signal<boolean>(false);

  // Computed
  displayedColumns = computed(() => [
    'actions',
    ...this.columns.map((column) => column.property)
  ]);

  ngOnInit(): void {
    this.getXtfFiles();
  }

  getXtfFiles(): void {
    this.isLoading.set(true);
    this.xtfService.getXtfFileList().subscribe({
      next: (result) => {
        this.dataSource.update((data) => {
          data.data = result;
          return data;
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource().filter = filterValue;
  }

  downloadXtf(file: XtfFiles): void {
    this.isLoading.set(true);

    this.xtfService.downloadXtfFile(file.name).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/zip' });
        this.createDownloadLink(blob, file.name);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  createDownloadLink(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  fileNameTable(file: XtfFiles): string {
    return file.name.split('.')[0];
  }
}
