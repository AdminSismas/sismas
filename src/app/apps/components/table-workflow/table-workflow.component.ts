import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// recursos de vex
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexPageLayoutComponent } from "../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { VexPageLayoutContentDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";

// recursos de angular material
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// recursos de archivos locales
import { contentInfoWorkflow } from '../../interfaces/content-info-workflow.model';
import { CreateWorkflowComponent } from '../workflow/create-workflow/create-workflow.component';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from '../../constants/workflow.constant';
import { PageSortByData } from '../../interfaces/page-sortBy-data.model';
import { WorkflowCollection } from '../../interfaces/workflow.model';
import { WorkflowService } from '../../services/workflow.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class TableWorkflowComponent implements OnInit, AfterViewInit {
  /* ============== ATTRIBUTES ============== */
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  dataSource!: MatTableDataSource<WorkflowCollection>;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input()
  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  columns: TableColumn<contentInfoWorkflow>[] = TABLE_COLUMN_PROPERTIES;

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;
  layoutCtrl = new UntypedFormControl('boxed');

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  /* ============== CONSTRUCTOR ============== */
  constructor(
    private workflowService: WorkflowService,
    private readonly layoutService: VexLayoutService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

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

  refreshInformationPaginator(event: any): void {
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
    const columns = ['icon', ...this.columns
      .filter((column) => column.visible)
      .map((column) => column.property)];

    columns.push('actions');
    return columns;
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
    const sortBy = 'name';
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
    this.contentInformation = data;
    this.captureInformationWorkflowData();
  }

  captureInformationWorkflowData() {
    let data: contentInfoWorkflow[];
    if (this.contentInformation != null && this.contentInformation.content != null) {
      // data = this.contentInformations.content.map((row: contentInfoWorkflow) => new contentInfoWorkflow(row));
      data = this.contentInformation.content;
      console.log("data: ", data);
      this.dataSource.data = data;
    }

    if (this.contentInformation == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation.totalElements) {
      this.totalElements = this.contentInformation.totalElements;
    }

    if (this.contentInformation.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation.pageable.pageNumber != null) {
      this.page = this.contentInformation.pageable.pageNumber;
    }
  }

  openCreateWorkflowDialog() {
    this.dialog.open(CreateWorkflowComponent,{
      data: {
        mode: 'create'
      }
    })
      .afterClosed()
      .subscribe((result: { result: boolean, data: WorkflowCollection }) => {
        if (!result.result) return;
        this.createWorkflow(result.data);
      });
  }

  createWorkflow(params: WorkflowCollection) {
    if (params.validBeginAt != null) {
      params.validBeginAt = new Date(params.validBeginAt).toISOString().split('T')[0];
    }

    if (params.validToAt != null) {
      params.validToAt = new Date(params.validToAt).toISOString().split('T')[0];
    }

    this.workflowService.createWorkflow(params)
      .subscribe({
        next: (result: WorkflowCollection) => {
          console.log("result: ", result);
          this.getDataFromWorkflowService();
          this.snackbar.open('Flujo de trabajo creado', 'CLOSE', { duration: 10000 });
        },
        error: () => {
          this.snackbar.open('Hubo un error al crear el flujo de trabajo', 'CLOSE', { duration: 10000 });
        },
      });
  }

  openEditWorkflowDialog(row: WorkflowCollection) {
    this.dialog.open(CreateWorkflowComponent, {
      data: {
        initValues: row,
        mode: 'edit'
      }
    }).afterClosed()
      .subscribe((result: { result: boolean, data: WorkflowCollection }) => {
        if (!result.result) return;
        this.editWorkFlow(result.data);
      });
  }

  editWorkFlow(params: WorkflowCollection) {
    this.workflowService.updateWorkflow(params)
      .subscribe({
        next: (result: WorkflowCollection) => {
          this.getDataFromWorkflowService();
          this.snackbar.open('Flujo de trabajo actualizado', 'CLOSE', { duration: 10000 });
        },
        error: () => {
          this.snackbar.open('Hubo un error al actualizar el flujo de trabajo', 'CLOSE', { duration: 10000 });
        },
      });
  }
}
