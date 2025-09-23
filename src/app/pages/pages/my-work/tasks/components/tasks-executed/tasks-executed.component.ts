import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TaskRetailExecuteResponseModel } from 'src/app/apps/interfaces/bpm/task-retail-execute-response.model';
import { DetailExecutedTasksComponent } from '../detail-executed-tasks/detail-executed-tasks.component';
import {
  MODAL_SMALL,
  PAGE_OPTION_UNIQUE,
  PAGE_SIZE_OPTION
} from 'src/app/apps/constants/general/constants';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { TABLE_COLUMN_PROPERTIES_EXECUTED } from '../../constants';
import { TasksPanelService } from 'src/app/apps/services/bpm/tasks-panel.service';
import { PageSearchData } from 'src/app/apps/interfaces/general/page-search-data.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger80ms, stagger40ms } from '@vex/animations/stagger.animation';

@Component({
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  selector: 'tasks-executed',
  standalone: true,
  imports: [MatIcon, MatPaginator, MatTableModule, NgClass, DatePipe],
  templateUrl: './tasks-executed.component.html'
})
export class TasksExecutedComponent implements OnInit {
  /* ---- Properties ---- */
  readonly pageSizeOptions = PAGE_SIZE_OPTION;
  readonly columns: TableColumn<TaskRetailExecuteResponseModel>[] =
    TABLE_COLUMN_PROPERTIES_EXECUTED;

  /* ---- Injects ---- */
  private dialog = inject(MatDialog);
  private tasksPanelService = inject(TasksPanelService);

  /* ---- Inputs ---- */
  executionId = input.required<string>();

  /*  ---- Signals ---- */
  dataSource = signal<MatTableDataSource<TaskRetailExecuteResponseModel>>(
    new MatTableDataSource([] as TaskRetailExecuteResponseModel[])
  );
  totalElements = signal(0);
  pageSize = signal(PAGE_OPTION_UNIQUE);
  page = signal(0);

  /* ---- Computed ---- */
  visibleColumns = computed(() => {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  });

  /* ---- LifeCycle ---- */
  ngOnInit(): void {
    if (this.executionId()) {
      this.viewExcuteTask(this.executionId());
    }
  }

  /* ---- Methods ---- */
  private viewExcuteTask(executionId: string) {
    this.tasksPanelService
      .viewExecuteTaskId(
        this.generateObjectPageSearchData(executionId),
        executionId
      )
      .subscribe((executeTask: InformationPegeable) => {
        this.captureInformationSubscribeB(executeTask);
      });
  }

  private generateObjectPageSearchData(executionId: string): PageSearchData {
    return new PageSearchData(this.page(), this.pageSize(), executionId);
  }

  private captureInformationSubscribeB(executeTask: InformationPegeable): void {
    if (!executeTask || executeTask.content.length === 0) {
      this.dataSource.set(new MatTableDataSource([] as TaskRetailExecuteResponseModel[]));
      this.totalElements.set(0);
      return;
    }
    this.dataSource.set(
      new MatTableDataSource(
        executeTask.content as TaskRetailExecuteResponseModel[]
      )
    );
    this.totalElements.set(executeTask.totalElements!);
    this.page.set(executeTask.pageable!.pageNumber!);
    this.pageSize.set(executeTask.pageable!.pageSize!);
  }

  openDetailInTaks(data: TaskRetailExecuteResponseModel) {
    this.dialog
      .open(DetailExecutedTasksComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: data
      })
      .afterClosed();
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    if (this.executionId()) {
      this.viewExcuteTask(this.executionId());
    }
  }
}
