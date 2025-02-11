/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProTaskE } from '../../../../../../apps/interfaces/bpm/pro-task-e';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../../../../../../apps/pipes/truncate-pipe.pipe';
import {
  MODAL_LARGE,
  NAME_NO_DISPONIBLE,
  SPACE
} from '../../../../../../apps/constants/general/constant';
import { environment as envi } from '../../../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { TasksPanelService } from 'src/app/apps/services/bpm/tasks-panel.service';
import { DetailInformationTasksComponent } from '../detail-information-tasks/detail-information-tasks.component';
import { TaskResponseModel } from '../../../../../../apps/interfaces/bpm/task-response.model';
import { PageSearchData } from '../../../../../../apps/interfaces/general/page-search-data.model';
import { PAGE, PAGE_SIZE } from '../../../../../../apps/constants/general/procedures.constant';
import { InformationPegeable } from '../../../../../../apps/interfaces/general/information-pegeable.model';
import { MatTableDataSource } from '@angular/material/table';
import { TaskRetailExecuteResponseModel } from '../../../../../../apps/interfaces/bpm/task-retail-execute-response.model';

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
    taskExecuteDetail: any,
    taskId: number
  ): void {
    this.dialog.open(DetailInformationTasksComponent, {
      // minWidth: '60%',
      // minHeight: '70%',
      // disableClose: true,
      // minWidth:'370px',
      ...MODAL_LARGE,
      data: {
        taskId: taskId,
        value,
        taskExecuteDetail
      }
    });
  }

  viewDetailTask(value: any) {
    this.tasksPanelService.viewTaskId(value.executionId).subscribe((result) => {
      this.taskOne = result;
      this.viewExecuteTask(this.taskOne);
    });
    console.log('viewDetailTask', value);
  }

  viewExecuteTask(objOne: any) {
    this.tasksPanelService
      .viewExecuteTaskId(
        this.generateObjectPageSearchData(objOne.executionId),
        objOne.executionId
      )
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (objTwo: InformationPegeable) =>
          this.captureInformationSubscribe(objOne, objTwo, objOne.executionId)
      });
  }

  captureInformationSubscribe(
    objOne: any,
    objTwo: InformationPegeable,
    id: number
  ): void {
    let data: TaskRetailExecuteResponseModel[];
    this.contentTasksInformations = objTwo;
    console.log('objTwo', objTwo.content);

    if (
      this.contentTasksInformations &&
      this.contentTasksInformations.content
    ) {
      data = this.contentTasksInformations.content;
      data = data.map(
        (row: TaskRetailExecuteResponseModel) =>
          new TaskRetailExecuteResponseModel(row)
      );
      this.dataSource.data = data;
      this.seeTaskProperty(objOne, this.dataSource, id);
    }
  }

  captureInformationSubscribeError(): void {
    this.contentTasksInformations = new InformationPegeable();
    this.dataSource.data = [];
  }

  private generateObjectPageSearchData(baunitId: string): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, baunitId);
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;
}
