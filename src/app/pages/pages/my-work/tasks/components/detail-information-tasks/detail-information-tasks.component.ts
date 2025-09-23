 
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnInit,
  Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
  TYPE_INFORMATION_EDITION} from '../../../../../../apps/constants/general/constants';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgClass } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { InformationPegeable } from '../../../../../../apps/interfaces/general/information-pegeable.model';
import { TypeInformation } from '../../../../../../apps/interfaces/general/content-info';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TasksPanelService } from 'src/app/apps/services/bpm/tasks-panel.service';
import { TaskResponseModel } from '../../../../../../apps/interfaces/bpm/task-response.model';
import { ActivatedRoute } from '@angular/router';
import { TableThirdPartyAffectedComponent } from 'src/app/apps/components/general-components/table-third-party-affected/table-third-party-affected.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { PermissionVailable } from 'src/app/apps/services/bpm/bpm-process.service';
import { DetailsHeaderComponent } from '../details-header/details-header.component';
import { TasksExecutedComponent } from '../tasks-executed/tasks-executed.component';
import { TaskMetadataComponent } from '../task-metadata/task-metadata.component';


interface DetailInformationData {
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
    MatExpansionModule,
    MatTabsModule,
    NgClass,
    TableThirdPartyAffectedComponent,
    TaskDetailsComponent,
    TasksExecutedComponent,
    TaskMetadataComponent
],
  templateUrl: './detail-information-tasks.component.html',
})
export class DetailInformationTasksComponent implements OnInit {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentTasksInformations!: InformationPegeable;
  public taskDetails: TaskResponseModel = new TaskResponseModel();
  assignedSee = '';

  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId = this.data.taskId;

  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() message: string | null = null;
  @Input() color = 'bg-blue-500';

  @Output() closeModal = new EventEmitter<void>();

  showAlert = false;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private tasksPanelService: TasksPanelService,
    public dialogRef: MatDialogRef<DetailInformationTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailInformationData,
    private readonly layoutService: VexLayoutService
  ) {}

  // implementacion de tabla

  ngOnInit() {
    // Accede a los parámetros de consulta
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('executionId')) {
        this.executionId = params.get('executionId') ?? '';
      }
    });
    if (this.data && this.data.textAlert && this.data?.textAlert.message) {
      this.message = this.data?.textAlert.message;
      this.showAlert = true;
    }
    
    if (this.executionId) {
      this.viewDetallyTaskExecuId(this.executionId);
    }

    if (this.baunitId == null) {
      return;
    }
  }

  viewDetallyTaskExecuId(executionId: string) {
    this.tasksPanelService.viewProTaskId(+executionId).subscribe((result) => {
      this.assignedSee = result.assignee;
    });
  }
}
