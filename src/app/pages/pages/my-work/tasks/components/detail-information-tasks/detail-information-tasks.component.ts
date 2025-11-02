
import {
  Component,
  Inject,
  signal
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { TasksPanelService } from '@features/bpm-workflows/services';
import { TaskResponseModel } from '@shared/interfaces';
import { ActivatedRoute } from '@angular/router';
import { TableThirdPartyAffectedComponent } from '@shared/components/table-third-party-affected/table-third-party-affected.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { PermissionVailable } from '@features/bpm-workflows/services/core/bpm-process.service';
import { DetailsHeaderComponent } from '../details-header/details-header.component';
import { TasksExecutedComponent } from '../tasks-executed/tasks-executed.component';
import { TaskMetadataComponent } from '../task-metadata/task-metadata.component';


export interface DetailInformationData {
  taskId: string;
  value: TaskResponseModel;
  textAlert?: PermissionVailable;
}

@Component({
  selector: 'vex-detail-information-tasks',
  standalone: true,
  imports: [
    DetailsHeaderComponent,
    MatDialogContent,
    MatDividerModule,
    MatTabsModule,
    TableThirdPartyAffectedComponent,
    TaskDetailsComponent,
    TasksExecutedComponent,
    TaskMetadataComponent
],
  templateUrl: './detail-information-tasks.component.html',
})
export class DetailInformationTasksComponent {

  /* ---- Signals ---- */
  executionId = signal(this.data.taskId);
  message = signal<string | null>(null);
  showAlert = signal(false);
  assignedSee = signal('');

  /* ---- Constructor ----- */
  constructor(
    private route: ActivatedRoute,
    private tasksPanelService: TasksPanelService,
    public dialogRef: MatDialogRef<DetailInformationTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailInformationData,
  ) {
    route.queryParamMap.subscribe((params) => {
      if (params.get('executionId')) {
        this.executionId.set(params.get('executionId') ?? '');
      }
    });

    // Accede a los parámetros de la url
    if (data && data.textAlert && data?.textAlert.message) {
      this.message.set(data?.textAlert.message);
      this.showAlert.set(true);
    }

    if (this.executionId()) {
      this.viewDetallyTaskExecuId(this.executionId());
    }
  }

  /* ---- Methods ----- */
  viewDetallyTaskExecuId(executionId: string) {
    this.tasksPanelService.viewProTaskId(+executionId).subscribe((result) => {
      this.assignedSee.set(result.assignee ?? '');
    });
  }
}
