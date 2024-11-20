import { ChangeDetectionStrategy, Component, DestroyRef, inject, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AttachmentCollection } from 'src/app/apps/interfaces/attachment.model';
import { UntypedFormControl } from '@angular/forms';
import { PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from 'src/app/apps/constants/constant';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoAttachment } from 'src/app/apps/interfaces/content-info-attachment.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AttachmentService } from 'src/app/apps/services/document-management.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vex-document-table',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule
  ],
  templateUrl: './document-table.component.html',
  styleUrl: './document-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTableComponent implements OnInit{

  public dataSource!: MatTableDataSource<AttachmentCollection>
  public searchControl: UntypedFormControl = new UntypedFormControl();
  public disablePaginator: boolean = true;

  @Input()
  page: number = 0;
  pageSize: number = PAGE_SIZE;
  totalElements: number = 0;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<contentInfoAttachment>[] = TABLE_COLUMN_PROPERTIES;

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  public dialogRef!: MatDialogRef<DocumentTableComponent>

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private attachmentService: AttachmentService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.getDataFromDocumentManagementService();
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    //this.dataSource.filter = value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewPaginator(numRegister: number): void {
    if (numRegister < 3) {
      this.disablePaginator = false;
    }
  }

  getDataFromDocumentManagementService(): void {
    this.attachmentService.getDataPropertyByAttachment("37").subscribe({
      next: (data: any) => {
        console.log("Datos recibidos de la API1:", data);
        this.dataSource.data = data;
        this.totalElements = data.length;

        this.viewPaginator(data.length);
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }
}
