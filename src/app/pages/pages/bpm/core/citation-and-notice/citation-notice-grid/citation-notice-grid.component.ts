import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
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
import { Observable, ReplaySubject } from 'rxjs';
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
    NgIf,
    NgForOf,
    MatPaginatorModule
  ]

})
export class CitationNoticeGridComponent implements OnInit, OnChanges {

  protected readonly pageSizeOptions = PAGE_SIZE_OPTION_UNIQUE;

  @Input({ required: true }) public id: string | undefined = '';
  @Input({ required: true }) executionId!: string;
  @Input({ required: true }) typeProcess!: TypeProcessParticipant;
  @Input() searchCtrl: string = '';

  listParticipants: ProcessParticipant[] = [];
  totalElements: number = 0;
  page = PAGE;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;

  @Output() toggleStar = new EventEmitter<ProcessParticipant['participationId']>();
  @Output() openDetailProcessParticipant = new EventEmitter<ProcessParticipant>();
  @Output() changePageSearchData = new EventEmitter<PageSearchData>();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;

  _dataContentInformations$: ReplaySubject<InformationPegeable> = new ReplaySubject<InformationPegeable>(1);
  dataContentInformations$: Observable<InformationPegeable> = this._dataContentInformations$.asObservable();

  _listParticipantsCards$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<ProcessParticipant[]>(1);
  listParticipantsCards$: Observable<ProcessParticipant[]> = this._listParticipantsCards$.asObservable();

  isExistDataInformations: boolean = false;
  contentInformations!: InformationPegeable;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private participantsProcess: ParticipantsProcessService
  ) {
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + getRandomInt(10000);
    } else {
      this.id = getRandomInt(10000).toString();
    }

    this.dataContentInformations$.pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result: InformationPegeable) => {
        if (result != null && (result.content == null || result.content.length > 0)) {
          this.captureInformationSubscribeError();
          return;
        }
        this.captureInformationSubscribe(result);
      });
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
    }
    if (this.typeProcess === 'NOTIFICADO') {
      return this.getInformationNotifiedAssigned();
    }
    if (this.typeProcess === 'AVISO') {
      return this.getInformationNotifyAssigned();
    }
    return this.getInformationAssignedTasks();
  }

  getInformationAssignedTasks() {
    this.participantsProcess.getParticipantsProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe(
        {
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  getInformationCitedAssigned() {
    this.participantsProcess.getParticipantsCitedProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe(
        {
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  getInformationNotifiedAssigned() {
    this.participantsProcess.getParticipantsNotifiedProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe(
        {
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  getInformationNotifyAssigned() {
    this.participantsProcess.getParticipantsNotifyProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe({
          error: (err: any) => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this._dataContentInformations$.next(result)
        }
      );
  }

  captureInformationSubscribeError(): void {
    this.isExistDataInformations = false;
    this.contentInformations = new InformationPegeable();
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.isExistDataInformations = true;
    this.contentInformations = result;
    this.orderByInformationSubscribe();
  }

  orderByInformationSubscribe() {
    let data: ProcessParticipant[];
    if (this.contentInformations?.content != null) {
      data = this.contentInformations.content;
      data = data.map((row: ProcessParticipant) => new ProcessParticipant(row));
      this.listParticipants = data;
      this._listParticipantsCards$.next(data);

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

  emitToggleStar(id: ProcessParticipant['participationId']) {
    this.toggleStar.emit(id);
  }

  trackByParticipationId(index: number, participant: ProcessParticipant): number | undefined {
    return participant.participationId;
  }

}
