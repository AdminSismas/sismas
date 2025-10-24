import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions
} from '@angular/material/form-field';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ProcessParticipant } from '@shared/interfaces';
import { PageSearchData } from '@shared/interfaces';
import { ParticipantsProcessService } from '@shared/services';
import { filter } from 'rxjs/operators';
import { InformationPegeable } from '@shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable, ReplaySubject } from 'rxjs';
import { CitationNoticeCardComponent } from '../components/citation-notice-card/citation-notice-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  PAGE} from '@shared/constants';
import { validateVariable } from '../../../../../../apps/utils/general';
import { TypeProcessParticipant } from '@shared/interfaces';
import { LoadingServiceService } from '@shared/services';
@Component({
  selector: 'vex-citation-notice-grid',
  templateUrl: './citation-notice-grid.component.html',
  styleUrl: './citation-notice-grid.component.scss',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill'
      } as MatFormFieldDefaultOptions
    }
  ],
  animations: [stagger20ms, fadeInUp400ms, scaleFadeIn400ms],
  standalone: true,
  imports: [
    AsyncPipe,
    CitationNoticeCardComponent,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatTabsModule,
    MatTooltipModule,
  ]
})
export class CitationNoticeGridComponent implements OnInit, OnDestroy {
  // Injects
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );
  private participantsProcess: ParticipantsProcessService = inject(
    ParticipantsProcessService
  );

  // Inputs
  executionId = input.required<string>();
  typeProcess = input.required<TypeProcessParticipant>();
  searchCtrl = input.required<string>();

  // Outputs
  openDetailProcessParticipant = output<ProcessParticipant>();
  changePageSearchData = output<PageSearchData>();

  // Properties
  readonly notFoundImageSrc = 'assets/img/illustrations/idea.svg';

  // Signals
  page = signal(PAGE);
  pageSize = signal(100);
  contentInformation = signal<InformationPegeable>(new InformationPegeable());
  totalElements = signal<number>(0);
  listParticipants = signal<ProcessParticipant[]>([]);

  // Viewchilds
  paginator? = viewChild(MatPaginator);

  // Subjects
  _dataContentInformations$: ReplaySubject<InformationPegeable> =
    new ReplaySubject<InformationPegeable>(1);
  dataContentInformations$: Observable<InformationPegeable> =
    this._dataContentInformations$.asObservable();

  _listParticipantsCards$: ReplaySubject<ProcessParticipant[]> =
    new ReplaySubject<ProcessParticipant[]>(1);
  listParticipantsCards$: Observable<ProcessParticipant[]> =
    this._listParticipantsCards$.asObservable();

  constructor() {
    this.destroyRef.onDestroy(() => {
      // Empty block
    });

    effect(() => {
      this.validateExecuteTypeProcess(this.typeProcess());
    });

    effect(() => {
      this.onFilterChange(this.searchCtrl() ?? '');
    }, { allowSignalWrites: true });
  }

  refreshData() {
    this.loadingServiceService.activateLoading(true);
    // Limpiar temporalmente la lista para forzar la actualización
    this._listParticipantsCards$.next([]);

    this.getInitParticipantsData();
    this.getInformationAssignedTasks();
    this.loadingServiceService.deActivate(500);
  }

  ngOnInit() {
    this.refreshData();
  }

  getInitParticipantsData() {
    this.participantsProcess
      .validateParticipants(
        this.executionId(),
        this.generateObjectPageSearchData()
      )
      .subscribe(() => {
        this.getDataContentInformations();
      });
  }

  getDataContentInformations() {
    this.dataContentInformations$
      .pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result: InformationPegeable) => {
        if (
          result != null &&
          (result.content == null || result.content.length <= 0)
        ) {
          this.captureNotInformationSubscribeError();
          return;
        }
        this.captureInformationSubscribe(result);
      });
  }

  validateExecuteTypeProcess(typeProcess: TypeProcessParticipant) {
    if (!typeProcess) {
      return;
    }
    switch (typeProcess) {
      case 'CITADO':
        return this.getInformationCitedAssigned();
      case 'NOTIFICADO':
        return this.getInformationNotifiedAssigned();
      case 'AVISO':
        return this.getInformationWarningAssigned();
      default:
        return this.getInformationAssignedTasks();
    }
  }

  getInformationWarningAssigned() {
    this.participantsProcess
      .getParticipantsWarningProcess(
        this.executionId(),
        this.generateObjectPageSearchData()
      )
      .subscribe({
        error: () => this.captureNotInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this._dataContentInformations$.next(result)
      });
  }

  getInformationAssignedTasks() {
    this.participantsProcess
      .getParticipantsProcess(
        this.generateObjectPageSearchData(),
        this.executionId()
      )
      .subscribe({
        error: () => this.captureNotInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this._dataContentInformations$.next(result)
      });
  }

  getInformationCitedAssigned() {
    this.participantsProcess
      .getParticipantsCitedProcess(
        this.generateObjectPageSearchData(),
        this.executionId()
      )
      .subscribe({
        error: () => this.captureNotInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this._dataContentInformations$.next(result)
      });
  }

  getInformationNotifiedAssigned() {
    this.participantsProcess
      .getParticipantsNotifiedProcess(
        this.generateObjectPageSearchData(),
        this.executionId()
      )
      .subscribe({
        error: () => this.captureNotInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this._dataContentInformations$.next(result)
      });
  }

  getInformationNotifyAssigned() {
    this.participantsProcess
      .getParticipantsNotifyProcess(
        this.generateObjectPageSearchData(),
        this.executionId()
      )
      .subscribe({
        error: () => this.captureNotInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this._dataContentInformations$.next(result)
      });
  }

  captureNotInformationSubscribeError(): void {
    this.listParticipants.set([]);
    this.contentInformation.set(new InformationPegeable());
    this._listParticipantsCards$.next([]);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation.set(result);
    this.orderByInformationSubscribe();
  }

  orderByInformationSubscribe() {
    let data: ProcessParticipant[];
    if (this.contentInformation()?.content != null) {
      data = this.contentInformation()?.content;
      data = data.map((row: ProcessParticipant) => {
        const dt = new ProcessParticipant(row);
        dt.executionId = this.executionId();
        return dt;
      });
      this.listParticipants.set(data);
      this._listParticipantsCards$.next(data);
      if (this.contentInformation() == null) {
        this.page.set(PAGE);
        return;
      }

      if (this.contentInformation()?.totalElements) {
        this.totalElements.set(this.contentInformation()?.totalElements ?? 0);
      }

      if (this.contentInformation()?.pageable == null) {
        this.page.set(PAGE);
        return;
      }

      if (this.contentInformation()?.pageable?.pageNumber != null) {
        this.page.set(this.contentInformation()?.pageable?.pageNumber ?? PAGE);
      }
    }
  }

  onFilterChange(value: string): void {
    let listParticipantsChange: ProcessParticipant[] = [];
    if (!validateVariable(value)) {
      this._listParticipantsCards$.next(this.listParticipants());
      return;
    }

    value = value.trim();
    value = value.toLowerCase();
    listParticipantsChange = this.listParticipants().filter(
      (participant: ProcessParticipant) => this.filterObject(participant, value)
    );
    this._listParticipantsCards$.next(listParticipantsChange);
  }

  filterObject(participant: ProcessParticipant, value: string) {
    if (value?.length <= 3) {
      return participant;
    }
    return (
      participant !== null &&
      participant !== undefined &&
      (participant.fullName?.toLowerCase().includes(value) ||
        participant.individualNumber?.toLowerCase().includes(value))
    );
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(this.page(), this.pageSize(), null);
  }

  trackByParticipationId(
    index: number,
    participant: ProcessParticipant
  ): number | undefined {
    return participant.participationId;
  }

  changePage(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.changePageSearchData.emit(this.generateObjectPageSearchData());
  }

  ngOnDestroy(): void {
    this._dataContentInformations$.unsubscribe();
    this._listParticipantsCards$.unsubscribe();
  }
}
