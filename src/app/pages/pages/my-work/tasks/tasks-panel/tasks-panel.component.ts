// Angular framework
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AsyncPipe, LowerCasePipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Vex
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { VexLayoutService } from '@vex/services/vex-layout.service';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
// Custom
import { CONSTANT_NAME_ID } from '../../../../../apps/constants/general/constantLabels';
import { environment } from '../../../../../../environments/environments';
import { FluidHeightDirective } from '../../../../../apps/directives/fluid-height.directive';
import { HeaderTasksComponent } from '../components/header-tasks/header-tasks.component';
import { InformationPegeable } from '../../../../../apps/interfaces/general/information-pegeable.model';
import { LoadingAppComponent } from '../../../../../apps/components/general-components/loading-app/loading-app.component';
import {
  PAGE,
  PAGE_SIZE_OPTION_UNIQUE,
  PAGE_SIZE_TABLE_CADASTRAL,
  PAGE_SIZE_TABLE_UNIQUE,
  PANEL_ASSIGNED_TASKS,
  PANEL_DEVOLUTION_TASKS,
  PANEL_PRIORITIZED_TASKS
} from '../../../../../apps/constants/general/constants';
import { PageSearchData } from '../../../../../apps/interfaces/general/page-search-data.model';
import { ProTask } from '../../../../../apps/interfaces/bpm/pro-task';
import { ProTaskE } from '../../../../../apps/interfaces/bpm/pro-task-e';
import { SendInfoGeneralService } from '../../../../../apps/services/general/send-info-general.service';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { TasksPanelService } from '../../../../../apps/services/bpm/tasks-panel.service';
import { TaskResponseModel } from '../../../../../apps/interfaces/bpm/task-response.model';
import { TaskRetailExecuteResponseModel } from '../../../../../apps/interfaces/bpm/task-retail-execute-response.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DetailInformationTasksComponent } from '../components/detail-information-tasks/detail-information-tasks.component';
import {
  BpmProcessService,
  PermissionVailable
} from 'src/app/apps/services/bpm/bpm-process.service';
import { LoadingServiceService } from '../../../../../apps/services/general/loading-service.service';

@Component({
  selector: 'vex-assigned-tasks',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    AsyncPipe,
    LowerCasePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
    FluidHeightDirective,
    HeaderTasksComponent,
    LoadingAppComponent,
    TaskCardComponent
  ],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent implements OnInit {
  contentInformation!: InformationPegeable;
  contentTasksInformations!: InformationPegeable;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  isExistDataInformation = false;
  label = 'Tareas activas';
  listProTasksE: ProTaskE[] = [];
  listProTasksECards: ProTaskE[] = [];
  searchCtrl: UntypedFormControl = new UntypedFormControl('search');
  taskOne: TaskResponseModel = new TaskResponseModel();
  typePanel: string | null = null;

  // Paginator config
  protected readonly pageSizeOptions = PAGE_SIZE_OPTION_UNIQUE;
  dataSource!: MatTableDataSource<TaskRetailExecuteResponseModel>;
  page = PAGE;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  totalElements = 0;

  subjectContentInformation$: ReplaySubject<InformationPegeable> =
    new ReplaySubject<InformationPegeable>(1);
  dataContentInformation$: Observable<InformationPegeable> =
    this.subjectContentInformation$.asObservable();
  resources: string[] = [];
  verificPermissionAvaliable: PermissionVailable = {} as PermissionVailable;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private loadingServiceService: LoadingServiceService = inject(LoadingServiceService);

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private bpmProcessService: BpmProcessService,
    private router: Router,
    private readonly layoutService: VexLayoutService,
    private proTasksService: TasksPanelService,
    private infoGeneralService: SendInfoGeneralService
  ) {
    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
          this.onRouteChange();
        }
      });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.loadingServiceService.activateLoading(true);
    this.activatedRoute.params.subscribe((params) => {
      this.typePanel = params[CONSTANT_NAME_ID];
      this.resetPaginator();
      this.onFilterChargeInformationByPanel();
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        return this.onFilterChange(value);
      });

    this.dataContentInformation$
      .pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result) => {
        this.captureInformationSubscribe(result);
      });

    this.bpmProcessService.dataPermissions$
      .pipe(take(1), distinctUntilChanged())
      .subscribe((result) => {
        if (result && result.executionId && result.message) {
          this.verificPermissionAvaliable = result;
          this.viewDetailTask(+this.verificPermissionAvaliable?.executionId);
        }
      });
  }

  viewDetailTask(value: number) {
    this.proTasksService.viewProTaskId(value).subscribe((result) => {
      this.taskOne = result;
      this.viewExecuteTask(this.taskOne);
    });
  }

  viewExecuteTask(objOne: TaskResponseModel) {
    this.proTasksService
      .viewExecuteTaskId(
        this.generateObjectPageSearchDataTask(
          this.verificPermissionAvaliable?.executionId
        ),
        this.verificPermissionAvaliable?.executionId
      )
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (objTwo: InformationPegeable) =>
          this.captureInformationSubscribeTask(
            objOne,
            objTwo,
            +this.verificPermissionAvaliable?.executionId
          )
      });
  }

  private generateObjectPageSearchDataTask(baunitId: string): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, baunitId);
  }

  captureInformationSubscribeTask(
    objOne: TaskResponseModel,
    objTwo: InformationPegeable,
    id: number
  ): void {
    let data: TaskRetailExecuteResponseModel[];
    this.contentTasksInformations = objTwo;
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
      this.seeTaskProperty(objOne, id);
    }
  }

  seeTaskProperty(value: TaskResponseModel, taskId: number): void {
    this.dialog.open(DetailInformationTasksComponent, {
      // minWidth: '60%',
      // minHeight: '70%',
      // disableClose: true,
      // minWidth:'370px',
      width: '98%',
      height: '86%',
      data: {
        taskId: taskId,
        value,
        textAlert: this.verificPermissionAvaliable
          ? this.verificPermissionAvaliable
          : null
      }
    });
  }

  onFilterChargeInformationByPanel() {
    this.loadingServiceService.activateLoading(true);
    let state = false;

    if (!this.typePanel) {
      this.clearPanel();
      return state;
    }

    switch (this.typePanel) {
      case PANEL_ASSIGNED_TASKS: {
        this.label = 'Tareas activas';
        this.getInformationAssignedTasks();
        state = true;
        break;
      }
      case PANEL_DEVOLUTION_TASKS: {
        this.label = 'Tareas devueltas';
        this.getInformationTaskDevolution();
        state = true;
        break;
      }
      case PANEL_PRIORITIZED_TASKS: {
        this.label = 'Tareas priorizadas';
        this.getInformationTaskPriority();
        state = true;
        break;
      }

      default: {
        this.label = 'Información no encontrada';
        state = true;
        break;
      }
    }
    return state;
  }

  onFilterChange(value: string): void {
    if (!value) {
      this.listProTasksECards = this.listProTasksE;
      return;
    }

    value = value.trim();
    value = value.toLowerCase();
    this.listProTasksECards = this.listProTasksE.filter(
      (protaskE: ProTaskE) => {
        if (protaskE.proTask && value?.length >= 3) {
          return this.filterObject(protaskE.proTask, value);
        }
        return protaskE;
      }
    );
  }

  filterObject(proTask: ProTask, value: string) {
    return (
      proTask !== null &&
      proTask !== undefined &&
      (proTask.processName?.toLowerCase().includes(value) ||
        proTask.flowName?.toLowerCase().includes(value) ||
        proTask.daysBeginS?.toLowerCase().startsWith(value) ||
        proTask.flowDetail?.toLowerCase().startsWith(value))
    );
  }

  getInformationAssignedTasks() {
    this.proTasksService
      .getProTaskAssigned(this.generateObjectPageSearchData())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this.subjectContentInformation$.next(result)
      });
  }

  getInformationTaskPriority() {
    this.proTasksService
      .getProTaskPriority(this.generateObjectPageSearchData())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this.subjectContentInformation$.next(result)
      });
  }

  getInformationTaskDevolution() {
    this.proTasksService
      .getProTaskDevolution(this.generateObjectPageSearchData())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this.subjectContentInformation$.next(result)
      });
  }

  captureInformationSubscribeError(): void {
    this.isExistDataInformation = false;
    this.contentInformation = new InformationPegeable();
    this.listProTasksE = [];
    this.listProTasksECards = [];
    this.loadingServiceService.activateLoading(false);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.isExistDataInformation = true;
    this.contentInformation = result;
    this.orderByInformationSubscribe();
    this.loadingServiceService.activateLoading(false);
  }

  orderByInformationSubscribe() {
    let data: ProTaskE[];
    if (this.contentInformation?.content != null) {
      this.listProTasksE = this.contentInformation.content;
      data = this.contentInformation.content;
      data = data.map((row: ProTaskE) => new ProTaskE(row));
      this.listProTasksECards = data;

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
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, null);
  }

  trackByExecutionId(index: number, proTaskE: ProTaskE): number | undefined {
    return proTaskE.executionId;
  }

  openBpmCodeProtaskE(proTaskE: ProTaskE) {
    if (proTaskE && this.typePanel) {
      this.infoGeneralService.setFatherURL(this.typePanel);
      this.infoGeneralService.setInfoProTaskE(proTaskE);
      this.router
        .navigate([`${environment.bpm_bpmCore}`, proTaskE.executionId])
        .then();
    }
  }

  openDetailProtaskE(id: ProTaskE['executionId']) {
    if (this.listProTasksE?.length > 0) {
      const protaskE: ProTaskE | undefined = this.listProTasksE.find(
        (c) => c.executionId === id
      );
      if (protaskE) {
        protaskE.isBegin = !protaskE.isBegin;
      }
    }
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    const validate: boolean = this.onFilterChargeInformationByPanel();
    if (!validate) {
      throw new Error(
        'No fue posible actualizar los datos del panel de tareas'
      );
    }
  }

  clearPanel() {
    this.contentInformation = new InformationPegeable();
    this.listProTasksE = [];
    this.listProTasksECards = [];
    this.page = PAGE;
    this.totalElements = 0;
    this.pageSize = PAGE_SIZE_TABLE_CADASTRAL;
    this.label = 'Información no Encontrada';
  }

  private resetPaginator(): void {
    this.page = PAGE;
    this.pageSize = PAGE_SIZE_TABLE_UNIQUE;
    if (this.paginator) {
      this.paginator.firstPage();
      this.paginator.pageSize = this.pageSize;
    }
  }

  private onRouteChange() {
    this.loadingServiceService.activateLoading(true);
    this.resetPaginator();
    this.onFilterChargeInformationByPanel();

    this.proTasksService.getChargerProTaskCount();
  }
}
