/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProTaskE } from '@shared/interfaces';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../../../../../../apps/pipes/truncate-pipe.pipe';
import {
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  SPACE
} from '../../../../../../apps/constants/general/constants';
import { environment as envi } from '../../../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { TasksPanelService } from '@features/bpm-workflows/services/tasks-panel.service';
import { DetailInformationTasksComponent } from '../detail-information-tasks/detail-information-tasks.component';
import { TaskResponseModel } from '@shared/interfaces';
import { PAGE, PAGE_SIZE } from '@shared/constants';
import { InformationPegeable } from '@shared/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { TaskRetailExecuteResponseModel } from '@shared/interfaces';

@Component({
  selector: 'vex-task-card',
  standalone: true,
  imports: [MatRippleModule, MatIconModule, MatButtonModule, TruncatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {
  @Input({ required: true }) public idCard: string | undefined = '';
  @Input({ required: true }) protaskE!: ProTaskE;
  @Input() public showHeader = false;
  @Output() openProtaskE: EventEmitter<ProTaskE> = new EventEmitter<ProTaskE>();
  @Output() openDetailProtaskE: EventEmitter<number | undefined> =
    new EventEmitter<ProTaskE['executionId']>();

  URL_ICON_BASE = `${envi.ulr_icon_base}`;

  page: number = PAGE;
  pageSize: number = PAGE_SIZE;

  public taskOne: TaskResponseModel = new TaskResponseModel();
  public taskExecuteDetail: TaskRetailExecuteResponseModel = new TaskRetailExecuteResponseModel();
  contentTasksInformations!: InformationPegeable;
  dataSource!: MatTableDataSource<TaskRetailExecuteResponseModel>;
  constructor(
    private dialog: MatDialog,
    private tasksPanelService: TasksPanelService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.idCard != null && this.idCard?.length > 0) {
      this.idCard = this.idCard + this.getRandomInt(10000);
    } else {
      this.idCard = this.getRandomInt(10000).toString();
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  seeTaskProperty(
    value: TaskResponseModel,
    // taskExecuteDetail: MatTableDataSource<TaskRetailExecuteResponseModel>,
    taskId: string
  ): void {
    this.dialog.open(DetailInformationTasksComponent, {
      // minWidth: '60%',
      // minHeight: '70%',
      // disableClose: true,
      // minWidth:'370px',
      ...MODAL_SMALL,
      data: {
        taskId: taskId,
        value,
        // taskExecuteDetail
      }
    });
  }

  viewDetailTask(value: any) {
    this.tasksPanelService.viewTaskId(value.executionId).subscribe((result) => {
      this.taskOne = result;
      this.seeTaskProperty(result, `${result.executionId!}`);
    });
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;
}
