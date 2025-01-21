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
import { filter, take } from 'rxjs/operators';
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
import { CONSTANT_NAME_ID } from '../../../../../apps/constants/constantLabels';
import { environment } from '../../../../../../environments/environments';
import { FluidHeightDirective } from '../../../../../apps/directives/fluid-height.directive';
import { HeaderTasksComponent } from '../components/header-tasks/header-tasks.component';
import { InformationPegeable } from '../../../../../apps/interfaces/information-pegeable.model';
import { LoadingAppComponent } from '../../../../../apps/components/loading-app/loading-app.component';
import {
  PAGE,
  PAGE_SIZE_OPTION_UNIQUE,
  PAGE_SIZE_TABLE_CADASTRAL,
  PAGE_SIZE_TABLE_UNIQUE,
  PANEL_ASSIGNED_TASKS,
  PANEL_DEVOLUTION_TASKS,
  PANEL_PRIORITIZED_TASKS
} from '../../../../../apps/constants/constant';
import { PageSearchData } from '../../../../../apps/interfaces/page-search-data.model';
import { ProTask } from '../../../../../apps/interfaces/pro-task';
import { ProTaskE } from '../../../../../apps/interfaces/pro-task-e';
import { SendInfoGeneralService } from '../../../../../apps/services/general/send-info-general.service';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { TasksPanelService } from '../../../../../apps/services/bpm/tasks-panel.service';

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
  protected readonly pageSizeOptions = PAGE_SIZE_OPTION_UNIQUE;

  isExistDataInformation = false;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;
  listProTasksE: ProTaskE[] = [];
  listProTasksECards: ProTaskE[] = [];
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  typePanel: string | null = null;
  label = 'Tareas activas';

  searchCtrl: UntypedFormControl = new UntypedFormControl('search');

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  subjectContentInformation$: ReplaySubject<InformationPegeable> =
    new ReplaySubject<InformationPegeable>(1);
  dataContentInformation$: Observable<InformationPegeable> =
    this.subjectContentInformation$.asObservable();
  isExistDataInformation$: Observable<boolean> = of(false);
  resources: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly layoutService: VexLayoutService,
    private proTasksService: TasksPanelService,
    private infoGeneralService: SendInfoGeneralService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const token = sessionStorage.getItem('token');
      if (token) {
        this.onRouteChange();
      }
    });
  }

  ngOnInit() {
    this.activateLoading();
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
  }

  onFilterChargeInformationByPanel() {
    this.activateLoading();
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
    this.activateLoading(true);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.isExistDataInformation = true;
    this.contentInformation = result;
    this.orderByInformationSubscribe();
    this.activateLoading(true);
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

  activateLoading(value = false) {
    const valid = of(value);
    this.isExistDataInformation$ = valid.pipe(take(3));
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
    this.activateLoading();
    this.resetPaginator();
    this.onFilterChargeInformationByPanel();

    this.proTasksService.getChargerProTaskCount();
  }

}
