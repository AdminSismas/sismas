import {
  AfterViewInit,
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { FluidHeightDirective } from '../../../../../../apps/directives/fluid-height.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { PageSearchData } from '../../../../../../apps/interfaces/general/page-search-data.model';
import { ProcessParticipant } from '../../../../../../apps/interfaces/bpm/process-participant';
import { InformationPegeable } from '../../../../../../apps/interfaces/general/information-pegeable.model';
import {
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_UNIQUE,
  TABLE_CITATION_NOTICE_COLUMN
} from '../../../../../../apps/constants/general/constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { ParticipantsProcessService } from '../../../../../../apps/services/bpm/core/participants-process.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'vex-citation-notice-table',
  templateUrl: './citation-and-notice-table.component.html',
  styleUrls: ['./citation-and-notice-table.component.scss'],
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
    VexScrollbarComponent,
    MatTableModule,
    MatSortModule,
    NgIf,
    NgClass,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    FluidHeightDirective,
    DatePipe
  ]
})
export class CitationAndNoticeTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input({ required: true }) public id: string | undefined = '';
  @Input({ required: true }) executionId!: string;
  @Input({ required: true }) typeProcess: string | undefined = '';
  @Input() searchStr = '';
  @Input()
  columns: TableColumn<ProcessParticipant>[] = TABLE_CITATION_NOTICE_COLUMN;

  totalElements = 0;
  page = PAGE;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;

  @Output() toggleStar = new EventEmitter<ProcessParticipant['participationId']>();
  @Output() openDetailProcessParticipant = new EventEmitter<ProcessParticipant['participationId']>();
  @Output() changePageSearchData = new EventEmitter<PageSearchData>();

  dataSource!: MatTableDataSource<ProcessParticipant>;
  selection: SelectionModel<ProcessParticipant> = new SelectionModel<ProcessParticipant>(true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  _dataContentInformations$: ReplaySubject<InformationPegeable> = new ReplaySubject<InformationPegeable>(1);
  dataContentInformations$: Observable<InformationPegeable> = this._dataContentInformations$.asObservable();

  isExistDataInformations = false;
  contentInformations!: InformationPegeable;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private participantsProcess: ParticipantsProcessService
  ) {
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(10000);
    } else {
      this.id = this.getRandomInt(10000).toString();
    }
    this.dataSource = new MatTableDataSource();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.dataContentInformations$.pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result) => {
        this.captureInformationSubscribe(result);
      });
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.filter = (value || '').trim().toLowerCase();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeProcess']) {
      if (this.typeProcess == 'ALL') {
        this.getInformationAssignedTasks();
      }
    }
    console.log(changes);
  }

  emitToggleStar(event: Event, id: ProcessParticipant['participationId']) {
    event.stopPropagation();
    this.toggleStar.emit(id);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  masterToggle(): void {
    if(this.isAllSelected()){
      this.selection.clear();
      return;
    }
    this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  getInformationAssignedTasks() {
    this.participantsProcess.getParticipantsProcess(this.generateObjectPageSearchData(), this.executionId)
      .subscribe(
        {
          error: () => this.captureInformationSubscribeError(),
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
    this.captureInformationData();
  }

  captureInformationData(): void {
    let data: ProcessParticipant[];
    if (this.contentInformations?.content != null) {
      data = this.contentInformations.content;
      data = data.map((row: ProcessParticipant) => new ProcessParticipant(row));
      this.dataSource.data = data;
    }

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

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, null);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

}
