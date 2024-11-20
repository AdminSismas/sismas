import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProTaskE } from '../../../../../apps/interfaces/pro-task-e';
import { TasksPanelService } from '../../../../../apps/services/bpm/tasks-panel.service';
import { InformationPegeable } from '../../../../../apps/interfaces/information-pegeable.model';
import { PageSearchData } from '../../../../../apps/interfaces/page-search-data.model';
import {
  PAGE,
  PAGE_SIZE_OPTION_UNIQUE,
  PAGE_SIZE_TABLE_CADASTRAL,
  PAGE_SIZE_TABLE_UNIQUE,
  PANEL_ASSIGNED_TASKS,
  PANEL_DEVOLUTION_TASKS,
  PANEL_PRIORITIZED_TASKS
} from '../../../../../apps/constants/constant';
import { Observable, of, ReplaySubject } from 'rxjs';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProTask } from '../../../../../apps/interfaces/pro-task';
import { HeaderTasksComponent } from '../components/header-tasks/header-tasks.component';
import { FooterComponent } from '../../../../../layouts/components/footer/footer.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { filter, take } from 'rxjs/operators';
import { LoadingAppComponent } from '../../../../../apps/components/loading-app/loading-app.component';
import { FluidHeightDirective } from '../../../../../apps/directives/fluid-height.directive';
import { environment } from '../../../../../../environments/environments';
import { CONSTANT_NAME_ID } from '../../../../../apps/constants/constantLabels';
import { SendInfoGeneralService } from '../../../../../apps/services/general/send-info-general.service';

@Component({
  selector: 'vex-assigned-tasks',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms],
  imports: [
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatIconModule,
    MatTabsModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    TaskCardComponent,
    NgIf,
    NgFor,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatInputModule,
    ReactiveFormsModule,
    HeaderTasksComponent,
    FooterComponent,
    MatPaginatorModule,
    LoadingAppComponent,
    FluidHeightDirective
  ],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent implements OnInit {

  protected readonly pageSizeOptions = PAGE_SIZE_OPTION_UNIQUE;

  isExistDataInformations: boolean = false;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;
  listProTasksE: ProTaskE[] = [];
  listProTasksECards: ProTaskE[] = [];
  page = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  typePanel: string | null = null;
  label: string = 'Tareas Activas';

  searchCtrl: UntypedFormControl = new UntypedFormControl('search');

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  subjectContentInformations$: ReplaySubject<InformationPegeable> = new ReplaySubject<InformationPegeable>(1);
  dataContentInformations$: Observable<InformationPegeable> = this.subjectContentInformations$.asObservable();
  isExistDataInformations$: Observable<boolean> = of(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly layoutService: VexLayoutService,
    private proTasksService: TasksPanelService,
    private infoGeneralService:SendInfoGeneralService
  ) {
  }

  ngOnInit() {
    this.activateLoading();
    this.activatedRoute.params.subscribe(params => {
      this.typePanel = params[CONSTANT_NAME_ID];
      this.onFilterChargeInformationByPanel();
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        return this.onFilterChange(value);
      });

    this.dataContentInformations$.pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result) => {
        this.captureInformationSubscribe(result);
      });
  }

  onFilterChargeInformationByPanel() {
    this.activateLoading();
    let state: boolean = false;
    if (!this.typePanel) {
      this.clearPanel();
      return state;
    }

    switch (this.typePanel) {
      case PANEL_ASSIGNED_TASKS: {
        this.label = 'Tareas Activas';
        this.getInformationAssignedTasks();
        state = true;
        break;
      }
      case PANEL_DEVOLUTION_TASKS: {
        this.label = 'Tareas Devueltas';
        this.getInformationTaskDevolution();
        state = true;
        break;
      }
      case PANEL_PRIORITIZED_TASKS: {
        this.label = 'Tareas Priorizadas';
        this.getInformationTaskPriority();
        state = true;
        break;
      }

      default: {
        this.label = 'Información No Encontrada';
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
    this.listProTasksECards = this.listProTasksE
      .filter((protaskE: ProTaskE) => {
        if (protaskE.proTask && value?.length >= 3) {
          return this.filterObject(protaskE.proTask, value);
        }
        return protaskE;
      });
  }

  filterObject(proTask: ProTask, value: string) {
    return proTask !== null && proTask !== undefined && (
      proTask.processName?.toLowerCase().includes(value) ||
      proTask.flowName?.toLowerCase().includes(value) ||
      proTask.daysBeginS?.toLowerCase().startsWith(value) ||
      proTask.flowDetail?.toLowerCase().startsWith(value)
    );
  }

  getInformationAssignedTasks() {
    this.proTasksService.getProTaskAssigned(this.generateObjectPageSearchData())
      .subscribe(
        {
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.subjectContentInformations$.next(result)
        }
      );
  }

  getInformationTaskPriority() {
    this.proTasksService.getProTaskPriority(this.generateObjectPageSearchData())
      .subscribe(
        {
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.subjectContentInformations$.next(result)
        }
      );
  }

  getInformationTaskDevolution() {
    this.proTasksService.getProTaskDevolution(this.generateObjectPageSearchData())
      .subscribe(
        {
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.subjectContentInformations$.next(result)
        }
      );
  }

  captureInformationSubscribeError(): void {
    this.isExistDataInformations = false;
    this.contentInformations = new InformationPegeable();
    this.listProTasksE = [];
    this.listProTasksECards= [];
    this.activateLoading(true);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.isExistDataInformations = true;
    this.contentInformations = result;
    this.orderByInformationSubscribe();
    this.activateLoading(true);
  }

  orderByInformationSubscribe() {
    let data: ProTaskE[];
    if (this.contentInformations?.content != null) {
      this.listProTasksE = this.contentInformations.content;
      data = this.contentInformations.content;
      data = data.map((row: ProTaskE) => new ProTaskE(row));
      this.listProTasksECards = data;

      if (this.contentInformations == null) {
        this.page = PAGE;
        return;
      }

      if (this.contentInformations.totalElements) {
        this.totalElements = this.contentInformations.totalElements;
      }

      if (this.contentInformations.pageable == null) {
        this.page = PAGE;
        return;
      }

      if (this.contentInformations.pageable.pageNumber != null) {
        this.page = this.contentInformations.pageable.pageNumber;
      }
    }
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, null);
  }

  trackByExecutionId(index: number, proTaskE: ProTaskE): number | undefined {
    return proTaskE.executionId;
  }

  openBpmCodeProtaskE(proTaskE?: ProTaskE) {
    if (proTaskE && this.typePanel) {
      this.infoGeneralService.setFatherURL(this.typePanel);
      this.infoGeneralService.setInfoProTaskE(proTaskE);
      this.router.navigate([`${environment.bpm_bpmCore}`, proTaskE.executionId])
        .then(r => {});
    }
  }

  openDetailProtaskE(id: ProTaskE['executionId']) {
    if (this.listProTasksE?.length > 0) {
      let protaskE: ProTaskE | undefined = this.listProTasksE.find((c) => c.executionId === id);
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
      throw new Error('No fue posible actualizar los datos del panel de tareas');

    }
  }

  clearPanel() {
    this.contentInformations = new InformationPegeable();
    this.listProTasksE = [];
    this.listProTasksECards = [];
    this.page = PAGE;
    this.totalElements = 0;
    this.pageSize = PAGE_SIZE_TABLE_CADASTRAL;
    this.label = 'Información No Encontrada';
  }

  activateLoading(value: boolean = false) {
    const valid = of(value);
    this.isExistDataInformations$ = valid.pipe(take(3));
  }
}
