import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

// recursos de angular material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

// recursos de archivos locales
import { AttachmentService } from '../../services/documnet-management/document-management.service';
import { AttachmentCollection } from '../../interfaces/documnet-management/attachment.model';
import { contentInfoAttachment } from '../../interfaces/general/content-info-attachment.model';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';
import {
  ViewFileDocumentManagementComponent
} from '../general-components/view-file-document-management/view-file-document-management.component';
import {
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION,
  TABLE_COLUMN_PROPERTIES
} from '../../constants/general/attachment.constant';
import { MODAL_SMALL } from '../../constants/general/constants';


@Component({
  templateUrl: './documnet-management.component.html',
  styleUrl: './documnet-management.component.scss',
  selector: 'vex-documnet-management',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    VexBreadcrumbsComponent,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgClass,
    NgIf
]
})
export class DocumnetManagementComponent implements OnInit, AfterViewInit {
  /* ============== ATRIBUTES ============== */
  numRegister = 0;
  disablePaginator = true;

  layoutCtrl = new UntypedFormControl('boxed');
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  dataSource!: MatTableDataSource<AttachmentCollection>;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;


  @Input()
  page:number = PAGE;
  pageSize: number = PAGE_SIZE;
  totalElements = 0;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<contentInfoAttachment>[] = TABLE_COLUMN_PROPERTIES;

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;


  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  dialogRef!: MatDialogRef<ViewFileDocumentManagementComponent>;


  /* ============== CONSTRUCTOR ============== */
  constructor(
    private dialog: MatDialog,
    private attachmentService: AttachmentService,
    private readonly layoutService: VexLayoutService,
  ) {}



  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.getDataFromDocumentManagementService();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }


  /* ------- Meth. HTML ------- */
  toggleColumnVisibility(column: TableColumn<contentInfoAttachment>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  refreshInformationpaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }

    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }


  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }


  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }



  /* ------- Meth. Common ------- */
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



  /* ------- Meth. Modal load file ------- */
  viewFile(metaData: contentInfoAttachment): void {
    this.dialog
      .open(ViewFileDocumentManagementComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: metaData,
      });

      this.dialogRef.afterClosed().subscribe(() => {
      });
    }



  /* ------- Meth. Services ------- */
  getDataFromDocumentManagementService(): void {
    this.attachmentService.getDataPropertyByAttachment("37").subscribe({
      next: (data: AttachmentCollection[]) => {
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


