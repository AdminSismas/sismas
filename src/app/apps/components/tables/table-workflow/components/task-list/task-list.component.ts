import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';import { taskListColumns } from 'src/app/apps/components/tables/table-workflow/constants/task-list.constants';
import {
  Proflow,
  TaskListData
} from '@shared/interfaces';
import { LaneNamesPipe } from 'src/app/apps/components/tables/table-workflow/pipe/lane-names.pipe';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WorkflowService } from '@features/bpm-workflows/services/workflow.service';
import { EditTaskComponent } from 'src/app/apps/components/tables/table-workflow/components/edit-task/edit-task.component';
import { MODAL_SMALL_XS } from '@shared/constants';
import Swal from 'sweetalert2';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [
    // Angular Material
    MatTableModule,
    MatIcon,
    MatMenuModule,
    MatButtonModule,
    // Custom
    ModalWindowComponent,
    LaneNamesPipe
  ],
  templateUrl: './task-list.component.html',
  animations: [fadeInUp400ms, stagger40ms]
})
export class TaskListComponent {
  // Attributes
  columns = taskListColumns;
  actions = [
    {
      label: 'Editar tarea',
      icon: 'mat:edit',
      action: (row: Proflow) => this.getTask(row)
    }
  ];

  // Injects
  data = inject<TaskListData>(MAT_DIALOG_DATA);
  workflowService = inject(WorkflowService);
  dialog = inject(MatDialog);

  // Signals
  dataSource = signal<MatTableDataSource<Proflow>>(
    new MatTableDataSource<Proflow>(this.data.tasks)
  );

  // Computed
  visibleColumns = computed(() => {
    const columns = this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);

    columns.push('actions');
    return columns;
  });

  // Methods
  getTask(row: Proflow) {
    this.workflowService
      .getTaskById(row.flowId.toString())
      .subscribe((task) => {
        this.editTask(task);
      });
  }

  editTask(row: Proflow) {
    const rowEdit = {
      ...row,
      haveQuestion: row.question ? true : false,
      preformId: row.preform.preformId.toString()
    };
    this.workflowService.getPreforms().subscribe((preforms) => {
      this.dialog
        .open(EditTaskComponent, {
          ...MODAL_SMALL_XS,
          data: { proflow: rowEdit, preformOptions: preforms.content }
        })
        .afterClosed()
        .subscribe((result) => {
          if (!result.response) return;
          this.updateTask(result.data, row.flowId.toString());
        });
    });
  }

  updateTask(
    body: Partial<Proflow & { haveQuestion: boolean; preformId: number }>,
    flowId: string
  ) {
    const newBody: Partial<Proflow> = {
      ...body,
      question: body.haveQuestion ? body.question : '',
      questionFlow: body.haveQuestion ? body.questionFlow : '',
      preform: { preformId: body.preformId! },
    };

    this.workflowService.updateTask(flowId, newBody).subscribe(() => {
      this.workflowService.getTasksList(this.data.processId).subscribe(() => {
        Swal.fire({
          title: 'Tarea actualizada',
          icon: 'success',
          showConfirmButton: false,
          timer: 10000
        });
        this.workflowService
          .getTasksList(this.data.processId)
          .subscribe((tasks) => {
            this.dataSource().data = tasks;
          });
      });
    });
  }

  createTask() {
    this.workflowService.getPreforms().subscribe((preforms) => {
      this.dialog
        .open(EditTaskComponent, {
          ...MODAL_SMALL_XS,
          data: { proflow: { haveQuestion: false }, preformOptions: preforms.content }
        })
        .afterClosed()
        .subscribe((result) => {
          if (!result.response) return;
          this.postTask(result.data);
        });
    });
  }

  postTask(
    body: Partial<Proflow & { haveQuestion: boolean; preformId: number }>
  ) {
    const newBody: Partial<Proflow> = {
      ...body,
      question: body.haveQuestion ? body.question : '',
      questionFlow: body.haveQuestion ? body.questionFlow : '',
      preform: { preformId: body.preformId! },
      key: this.data.key
    };

    this.workflowService
      .createTask(this.data.processId, newBody)
      .subscribe(() => {
        this.workflowService.getTasksList(this.data.processId).subscribe(() => {
          Swal.fire({
            title: 'Tarea creada',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            timer: 10000
          });
          this.workflowService
            .getTasksList(this.data.processId)
            .subscribe((tasks) => {
              this.dataSource().data = tasks;
            });
        });
      });
  }
}
