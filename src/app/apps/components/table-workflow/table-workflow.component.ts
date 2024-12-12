import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
import { VexPageLayoutComponent } from "../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { VexPageLayoutContentDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

// recursos de angular material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

// recursos de archivos locales
import { WorkflowCollection } from '../../interfaces/workflow.model';
import { contentInfoWorkflow } from '../../interfaces/content-info-workflow.model';

import { WorkflowService } from '../../services/workflow.service';
import { PageSortByData } from '../../interfaces/page-sortBy-data.model';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from '../../constants/workflow.constant';

@Component({
  selector: 'vex-table-workflow',
  templateUrl: './table-workflow.component.html',
  styleUrl: './table-workflow.component.scss',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgFor,
    NgClass,
    NgIf
  ]
})
export class TableWorkflowComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  dataSource!: MatTableDataSource<WorkflowCollection>;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input()
  page:number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements: number = 0;
  columns: TableColumn<contentInfoWorkflow>[] = TABLE_COLUMN_PROPERTIES;

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;
  layoutCtrl = new UntypedFormControl('boxed');

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  /* ============== CONSTRUCTOR ============== */
  constructor(
    private workflowService: WorkflowService,
    private readonly layoutService: VexLayoutService,
  ) {}

  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.getDataFromWorkflowService();
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
  toggleColumnVisibility(column: TableColumn<contentInfoWorkflow>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  refreshInformationpaginator(event: any): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getDataFromWorkflowService();
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return ['icon', ...this.columns
    .filter((column) => column.visible)
    .map((column) => column.property)];
  }


  /* ------- Meth. Common ------- */
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  generateObjectPageWorkflowData(): PageSortByData {
    const sortBy: string = 'name';
    return new PageSortByData(this.page, this.pageSize, sortBy);
  }


  /* ------- Meth. Services ------- */
  getDataFromWorkflowService() {
    const paramsWF: PageSortByData = this.generateObjectPageWorkflowData();
    this.workflowService.getDataPropertyByWorkflow(paramsWF)
    .subscribe({
      next: (result: any) => {
        console.log("datos de api: ", result);
        this.captureInformationSubscribe(result);
      },
      error: (error) => {
        console.error('Hubo un error al obtener los datos: ', error);
      },
      complete: () => {
        console.log('Carga completa de datos');
      }
    });
  }

  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data;
    this.captureInformationWorkflowData();
  }

  captureInformationWorkflowData() {
    let data: contentInfoWorkflow[];
    if (this.contentInformations != null && this.contentInformations.content != null) {
      data = this.contentInformations.content.map((row: contentInfoWorkflow) => new contentInfoWorkflow(row));
      console.log("data: ", data);
      this.dataSource.data = data;
    }

    if (this.contentInformations == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.totalElements) {
      this.totalElements = this.contentInformations.totalElements;
    }

    if (this.contentInformations.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.pageable.pageNumber != null) {
      this.page = this.contentInformations.pageable.pageNumber;
    }
  }
}
