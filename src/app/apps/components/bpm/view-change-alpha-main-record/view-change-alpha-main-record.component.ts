import { AfterViewInit, Component, DestroyRef, inject, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { AlfaMainService } from '../../../services/bpm/core/alfa-main.service';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { DifferenceChanges } from '../../../interfaces/bpm/difference-changes';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { SearchData } from '../../../interfaces/general/search-data.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { CadastralChangeLog } from '../../../interfaces/bpm/cadastral-change-log';
import {
  PAGE,
  PAGE_OPTION_UNIQUE,
  PAGE_SIZE_OPTION_UNIQUE,
  TABLE_COLUMN_CHANGES_BPM_OPERATION
} from '../../../constants/general/constant';
import { UntypedFormControl } from '@angular/forms';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

@Component({
  selector: 'vex-view-change-alpha-main-record',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatDialogContent,
    MatMenuModule,
    NgForOf,
    NgIf,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgClass
  ],
  templateUrl: './view-change-alpha-main-record.component.html',
  styleUrl: './view-change-alpha-main-record.component.scss'
})
export class ViewChangeAlphaMainRecordComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;
  searchData!: SearchData;

  baunitIdE!:string |undefined;
  executionId!:string |undefined;
  listChanges: DifferenceChanges[] = [];

  @Input()
  columns: TableColumn<CadastralChangeLog>[] = TABLE_COLUMN_CHANGES_BPM_OPERATION;
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_OPTION_UNIQUE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION_UNIQUE;

  dataSource!: MatTableDataSource<CadastralChangeLog>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: string[],
    private dialogRef: MatDialogRef<ViewChangeAlphaMainRecordComponent>,
    private alfaMainService: AlfaMainService,
    private readonly layoutService: VexLayoutService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    if(!this.defaults || this.defaults.length <= 0) {
      return;
    }

    this.dataSource = new MatTableDataSource();
    this.executionId = this.defaults[0];
    this.baunitIdE = this.defaults[0];

    this.searchAnalyzeChangesBpmOperationAlfaMain();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  searchAnalyzeChangesBpmOperationAlfaMain(): void {
    if (this.executionId == null || !this.executionId) {
      return;
    }
    this.alfaMainService.analyzeChangesBpmOperationAlfaMain(
      this.generateObjectPageSearchData())
      .subscribe(
        {
          error: () => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
        }
      );
  }

  captureInformationSubscribeError(): void {
    this.contentInformations = new InformationPegeable();
    this.dataSource.data = [];
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.captureInformationCadastralData();
  }

  captureInformationCadastralData(): void {
    let data: CadastralChangeLog[];
    if (this.contentInformations?.content != null) {
      data = this.contentInformations.content;
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

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchAnalyzeChangesBpmOperationAlfaMain();
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, this.executionId);
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }
}
