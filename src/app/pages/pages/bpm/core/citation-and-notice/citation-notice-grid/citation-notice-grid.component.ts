import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output, signal,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ProcessParticipant } from '../../../../../../apps/interfaces/bpm/process-participant';
import { PageSearchData } from '../../../../../../apps/interfaces/general/page-search-data.model';
import { ParticipantsProcessService } from '../../../../../../apps/services/bpm/core/participants-process.service';
import { filter } from 'rxjs/operators';
import { InformationPegeable } from '../../../../../../apps/interfaces/general/information-pegeable.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EMPTY, Observable, ReplaySubject } from 'rxjs';
import { CitationNoticeCardComponent } from '../components/citation-notice-card/citation-notice-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  PAGE,
  PAGE_SIZE_OPTION_UNIQUE,
  PAGE_SIZE_TABLE_UNIQUE
} from '../../../../../../apps/constants/general/constants';
import { getRandomInt, validateVariable } from '../../../../../../apps/utils/general';
import {
  TypeProcessParticipant
} from '../../../../../../apps/interfaces/bpm/citation-and-notice/info-participants.interface';
import { LoadingServiceService } from '../../../../../../apps/services/general/loading-service.service';

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
    MatIconModule,
    MatTabsModule,
    CitationNoticeCardComponent,
    MatButtonModule,
    MatTooltipModule,
    NgForOf,
    MatPaginatorModule
  ]

})
export class CitationNoticeGridComponent implements OnInit, OnChanges {

  listParticipants: ProcessParticipant[] = [];
  totalElements: number = 0;
  page = PAGE;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  contentInformation!: InformationPegeable;
  notFoundImageSrc = signal('assets/img/illustrations/idea.svg');

  @Input({ required: true }) public id: string | undefined = '';
  @Input({ required: true }) executionId!: string;
  @Input({ required: true }) typeProcess!: TypeProcessParticipant;
  @Input() searchCtrl: string = '';

  @Output() openDetailProcessParticipant = new EventEmitter<ProcessParticipant>();
  @Output() changePageSearchData = new EventEmitter<PageSearchData>();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;

  _dataContentInformations$: ReplaySubject<InformationPegeable> = new ReplaySubject<InformationPegeable>(1);
  dataContentInformations$: Observable<InformationPegeable> = this._dataContentInformations$.asObservable();

  _listParticipantsCards$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<ProcessParticipant[]>(1);
  listParticipantsCards$: Observable<ProcessParticipant[]> = this._listParticipantsCards$.asObservable();

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private loadingServiceService: LoadingServiceService = inject(LoadingServiceService);
  private participantsProcess: ParticipantsProcessService = inject(ParticipantsProcessService);

  constructor() {
    this.destroyRef.onDestroy(() => {
    });
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + getRandomInt(10000);
    } else {
      this.id = getRandomInt(10000).toString();
    }
    this.loadingServiceService.activateLoading(true);

    this.dataContentInformations$.pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result: InformationPegeable) => {
        if (result != null && (result.content == null || result.content.length <= 0)) {
          this.captureNotInformationSubscribeError();
          return;
        }
        this.captureInformationSubscribe(result);
      });

    this.loadingServiceService.deActivate(1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeProcess']) {
      this.validateExecuteTypeProcess();
    }
    if (changes['searchCtrl'] && this.searchCtrl != null) {
      this.onFilterChange(this.searchCtrl);
    }
  }

  validateExecuteTypeProcess() {
    if (!this.typeProcess) {
      return;
    }
    if (this.typeProcess === 'CITADO') {
      return this.getInformationCitedAssigned();
    } else if (this.typeProcess === 'NOTIFICADO') {
      return this.getInformationNotifiedAssigned();
    } else if (this.typeProcess === 'AVISO') {
      return this.getInformationNotifyAssigned();
    } else {
      return this.getInformationAssignedTasks();
    }
  }

  getInformationAssignedTasks() {
    this.participantsProcess.getParticipantsProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe({
        error: (err: any) => this.captureNotInformationSubscribeError(),
        next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
      });
  }

  getInformationCitedAssigned() {
    this.participantsProcess.getParticipantsCitedProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe({
          error: (err: any) => this.captureNotInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  getInformationNotifiedAssigned() {
    this.participantsProcess.getParticipantsNotifiedProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe(
        {
          error: (err: any) => this.captureNotInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  getInformationNotifyAssigned() {
    this.participantsProcess.getParticipantsNotifyProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe({
          error: (err: any) => this.captureNotInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  captureNotInformationSubscribeError(): void {
    this.listParticipants = [];
    this.contentInformation = new InformationPegeable();
    this._listParticipantsCards$.next([]);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.orderByInformationSubscribe();
  }

  orderByInformationSubscribe() {
    let data: ProcessParticipant[];
    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      data = data.map((row: ProcessParticipant) => {
        let dt = new ProcessParticipant(row);
        dt.executionId = this.executionId;
        return dt;
      });
      this.listParticipants = data;
      this._listParticipantsCards$.next(data);
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

  onFilterChange(value: string): void {
    let listParticipantsChange: ProcessParticipant[] = [];
    if (!validateVariable(value)) {
      this._listParticipantsCards$.next(this.listParticipants);
      return;
    }

    value = value.trim();
    value = value.toLowerCase();
    listParticipantsChange = this.listParticipants
      .filter((participant: ProcessParticipant) => this.filterObject(participant, value));
    this._listParticipantsCards$.next(listParticipantsChange);
  }

  filterObject(participant: ProcessParticipant, value: string) {
    if (value?.length <= 3) {
      return participant;
    }
    return participant !== null && participant !== undefined && (
      participant.fullName?.toLowerCase().includes(value) ||
      participant.individualNumber?.toLowerCase().includes(value));
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, null);
  }

  trackByParticipationId(index: number, participant: ProcessParticipant): number | undefined {
    return participant.participationId;
  }

  protected readonly pageSizeOptions = PAGE_SIZE_OPTION_UNIQUE;
}
