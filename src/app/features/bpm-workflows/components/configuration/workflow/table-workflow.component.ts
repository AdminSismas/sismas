import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// recursos de vex
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';

// recursos de angular material
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// recursos de archivos locales
import { contentInfoWorkflow } from '@features/bpm-workflows/models/content-info-workflow.model';
import { CreateWorkflowComponent } from './create-workflow/create-workflow.component';
import { InformationPegeable, PageSortByData } from '@shared/models/pageable';
import { TABLE_COLUMN_WORKFLOW } from '@features/bpm-workflows/constants/workflow/workflow.constant';
import { PAGE, PAGE_SIZE } from '@shared/constants/constants';
import { WorkflowCollection } from '@features/bpm-workflows/models/workflow.model';
import { WorkflowService } from '@features/bpm-workflows/services/core/workflow.service';
import { MODAL_LARGE, PAGE_SIZE_OPTION } from '@shared/constants/constants';
import Swal from 'sweetalert2';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'vex-table-workflow',
  templateUrl: './table-workflow.component.html',
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
    NgClass,
  ]
})
export class TableWorkflowComponent implements OnInit {
  /* ---- Injects ---- */
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly layoutService = inject(VexLayoutService);
  private workflowService = inject(WorkflowService);
  private dialog = inject(MatDialog);

  /* ---- Computed ---- */
  visibleColumns = computed(() => {
    const columns = [
      'icon',
      ...this.columns
        .filter((column) => column.visible)
        .map((column) => column.property)
    ];

    columns.push('actions');
    return columns;
  });

  /* ---- Attributes ---- */
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  dataSource!: MatTableDataSource<WorkflowCollection>;
  actions = [
    {
      label: 'Editar Trámite',
      icon: 'mat:edit',
      action: (row: WorkflowCollection) => this.openEditWorkflowDialog(row)
    },
    {
      label: 'Ver tareas',
      icon: 'mat:task',
      action: (row: WorkflowCollection) => this.detailTasks(row)
    }
  ];

  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  columns: TableColumn<contentInfoWorkflow>[] = TABLE_COLUMN_WORKFLOW;

  isNotDesktop$: Observable<boolean> = this.layoutService.isDesktop$.pipe(
    map((isDesktop) => !isDesktop)
  );
  contentInformation!: InformationPegeable;
  layoutCtrl = new UntypedFormControl('boxed');

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;


  /* ------- Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.getDataFromWorkflowService();
  }

  /* ---- Methods ---- */
  refreshInformationPaginator(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getDataFromWorkflowService();
  }

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

  getDataFromWorkflowService() {
    const paramsWF: PageSortByData = this.generateObjectPageWorkflowData();
    this.workflowService.getDataPropertyByWorkflow(paramsWF).subscribe({
      next: (result) => {
        this.captureInformationSubscribe(result);
      }
    });
  }

  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformation = data;
    this.captureInformationWorkflowData();
  }

  captureInformationWorkflowData() {
    let data: contentInfoWorkflow[];
    if (
      this.contentInformation != null &&
      this.contentInformation.content != null
    ) {
      // data = this.contentInformations.content.map((row: contentInfoWorkflow) => new contentInfoWorkflow(row));
      data = this.contentInformation.content;
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
    this.dialog
      .open(CreateWorkflowComponent, {
        data: {
          mode: 'create'
        }
      })
      .afterClosed()
      .subscribe((result: { result: boolean; data: WorkflowCollection }) => {
        if (!result.result) return;
        this.createWorkflow(result.data);
      });
  }

  createWorkflow(params: WorkflowCollection) {
    this.workflowService.createWorkflow(params).subscribe({
      next: () => {
        this.getDataFromWorkflowService();
        Swal.fire({
          title: 'Flujo de trabajo creado',
          icon: 'success',
          showConfirmButton: false,
          timer: 10000
        });
      },
      error: () => {
        Swal.fire({
          title: 'Hubo un error al crear el flujo de trabajo',
          icon: 'error',
          showConfirmButton: false,
          timer: 10000
        });
      }
    });
  }

  openEditWorkflowDialog(row: WorkflowCollection) {
    this.dialog
      .open(CreateWorkflowComponent, {
        data: {
          initValues: row,
          mode: 'edit'
        }
      })
      .afterClosed()
      .subscribe((result: { result: boolean; data: WorkflowCollection }) => {
        if (!result.result) return;
        this.editWorkFlow(result.data);
      });
  }

  editWorkFlow(params: WorkflowCollection) {
    this.workflowService.updateWorkflow(params).subscribe({
      next: () => {
        this.getDataFromWorkflowService();
        Swal.fire({
          title: 'Flujo de trabajo actualizado',
          icon: 'success',
          showConfirmButton: false,
          timer: 10000
        });
      },
      error: () => {
        Swal.fire({
          title: 'Hubo un error al actualizar el flujo de trabajo',
          icon: 'error',
          showConfirmButton: false,
          timer: 10000
        });
      }
    });
  }

  detailTasks(row: WorkflowCollection) {
    if (!row || !row.processId) return;

    this.workflowService
      .getTasksList(row.processId.toString())
      .subscribe((proflowList) => {
        this.dialog.open(TaskListComponent, {
          ...MODAL_LARGE,
          data: {
            tasks: proflowList,
            processId: row.processId,
            name: row.name,
            key: row.key
          }
        });
      });
  }
}
