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
import { error } from 'console';
import { DetailInformationTasksComponent } from '../detail-information-tasks/detail-information-tasks.component';
import { TaskResponseModel } from 'src/app/apps/interfaces/task-response.model';

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
      width: '40%',
      // minWidth:'370px',
      //   width:'98%',
      //   height: '86%',
      data: { taskId: taskId ,value }
    });
  //   .afterClosed()
  //     .subscribe({
  //       next: (result: TaskResponseModel) => {
  //         console.log(result);
  //         // setTimeout(() => this.data = result, 300);
  //       }
  //     })
  }

  
  // deleteInformations(basicInformationAddress: BasicInformationAddress): void {
  //   const dialogRef = this.dialog.open(this.confirmDialog);

  //   dialogRef.afterClosed().subscribe(async (data: any) => {
  //     if (data === 'delete' && basicInformationAddress.direccionId) {
  //       let msg: string = 'Información eliminada con éxito';
  //       try {
  //         // await lastValueFrom(
  //         //   this.informationPropertyService.deleteBasicInformationPropertyAddress(
  //         //     basicInformationAddress.direccionId
  //         //   )
  //         // );
  //         this.dataSource.data = this.dataSource.data.filter((row: BasicInformationAddress) => {
  //           return row.direccionId !== basicInformationAddress.direccionId;
  //         });
  //       } catch (e) {
  //         msg = 'Error, no se pudo eliminar la dirección';
  //       }
  //       this.snackBar.open(msg, 'CLOSE', { duration: 2000 });
  //     }
  //   });
  // }
  
  
  viewDetallyTask(value:any){
    console.log('Abrir modal',value.executionId);
    // if(!this.schema || !this.baunitId) {
    //   return;
    // }
  
    this.tasksPanelService.viewTaskId(
      value.executionId)
      .subscribe( result => {
        this.taskOne = result;
          console.log(result,'RESPUESTA SERVICIO');
          this.seeTaskProperty(this.taskOne,value.executionId)
        
      });
  }


  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;
}
