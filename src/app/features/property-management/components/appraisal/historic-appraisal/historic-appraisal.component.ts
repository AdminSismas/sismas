import {
  AfterViewInit,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  InformationPropertyService
} from '@features/property-management/services/property/information-property.service';
import { PageSearchData } from '@shared/models/pageable';
import {
  PAGE,
  PAGE_SIZE_OPTION,
  TABLE_COLUMN_PROPERTIES_APPRAISALS
} from '@shared/constants/constants';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { InfoAppraisal } from '@features/property-management/models/info-appraisal';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'vex-historic-appraisal',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatPaginator,
    MatTableModule
  ],
  templateUrl: './historic-appraisal.component.html',
  styleUrl: './historic-appraisal.component.scss'
})
export class HistoricAppraisalComponent implements OnInit, AfterViewInit {
  informationPropertyService = inject(InformationPropertyService);
  data = inject<{ baunitId: string; schema: string; executionId: string }>(
    MAT_DIALOG_DATA
  );

  readonly columns = TABLE_COLUMN_PROPERTIES_APPRAISALS;
  readonly groupTitles = [
    { label: '', colspan: 2, property: 'vigencia' },
    { label: 'Avalúo catastral', colspan: 3, property: 'avaluo-catastral' },
    { label: 'Avalúo comercial', colspan: 3, property: 'avaluo-comercial' },
    { label: 'Autoavalúo', colspan: 1, property: 'autoavaluo' }
  ];

  dataSource = signal<MatTableDataSource<InfoAppraisal>>(
    new MatTableDataSource<InfoAppraisal>([])
  );
  page = signal<number>(PAGE);
  pageSize = signal<number>(5);
  totalElements = signal<number>(0);

  pageSizeOptions = computed<number[]>(() => PAGE_SIZE_OPTION);
  displayColumns = computed<string[]>(() => {
    return this.columns
      .filter((column) => {
        return column.visible;
      })
      .map((column) => column.property);
  });
  displayTitlesGroups = computed<string[]>(() => {
    return this.groupTitles.map((group) => group.property);
  });

  paginator = viewChild<MatPaginator>('paginator');

  ngOnInit() {
    this.getAppraisalData();
  }

  ngAfterViewInit() {
    if (this.paginator()) {
      this.dataSource().paginator = this.paginator()!;
    }
  }

  getAppraisalData() {
    const { baunitId } = this.data;
    const paginatorData = new PageSearchData(PAGE, this.pageSize(), baunitId);

    this.informationPropertyService
      .getHistoricAppraisalInformation(baunitId, paginatorData)
      .subscribe((response) => {
        this.dataSource().data = response.content;
        this.page.set(response.pageable?.pageNumber ?? 0);
        this.pageSize.set(response.pageable?.pageSize ?? 5);
        this.totalElements.set(response.totalElements ?? 0);
      });
  }

  refreshPaginator(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.getAppraisalData();
  }
}
