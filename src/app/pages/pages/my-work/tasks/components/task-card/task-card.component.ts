import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProTaskE } from '../../../../../../apps/interfaces/pro-task-e';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { TruncatePipe } from '../../../../../../apps/pipes/truncate-pipe.pipe';
import { NAME_NO_DISPONIBLE, SPACE } from '../../../../../../apps/constants/constant';
import { environment as envi } from '../../../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { TasksPanelService } from 'src/app/apps/services/bpm/tasks-panel.service';
import { DetailInformationTasksComponent } from '../detail-information-tasks/detail-information-tasks.component';
import { TaskResponseModel } from 'src/app/apps/interfaces/task-response.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'vex-task-card',
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    TruncatePipe
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {

  @Input({ required: true }) public idCard: string |undefined = '';
  @Input({ required: true }) protaskE!: ProTaskE;
  @Output() openProtaskE: EventEmitter<ProTaskE> = new EventEmitter<ProTaskE>();
  @Output() openDetailProtaskE: EventEmitter<number | undefined> = new EventEmitter<ProTaskE['executionId']>();

  URL_ICON_BASE: string = `${envi.ulr_icon_base}`;

  public taskOne:TaskResponseModel= new TaskResponseModel();

  constructor(
    private dialog: MatDialog,
    private tasksPanelService: TasksPanelService
  ) {
  }

  ngOnInit() {
    if (this.idCard != null && this.idCard?.length>0) {
      this.idCard = this.idCard + this.getRandomInt(10000)
    } else {
      this.idCard = this.getRandomInt(10000).toString();
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  seeTaskProperty(value:TaskResponseModel,taskId:number):void {
    this.dialog.open(DetailInformationTasksComponent, {
      width: '50%',
      // minWidth:'370px',
      //   width:'98%',
      //   height: '86%',
      data: { taskId: taskId ,value }
    });
  }

  
  
  
  
  viewDetallyTask(value:any){
    this.tasksPanelService.viewTaskId(
      value.executionId)
      .subscribe( result => {
        this.taskOne = result;
          this.seeTaskProperty(this.taskOne,value.executionId)
        
      });
  }


  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;
}
