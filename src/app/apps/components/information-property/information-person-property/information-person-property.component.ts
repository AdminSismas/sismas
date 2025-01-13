// Angular framework
import {
  ChangeDetectorRef,
  Component,
  Inject,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { Observable, BehaviorSubject, filter } from 'rxjs';
// Vex
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger80ms, stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';
// Material
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// Custom
import { DataPerson, DialogPersonData } from 'src/app/apps/interfaces/information-property/snr-person-info';
import {
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION,
  TYPEINFORMATION_VISUAL,
  PAGE_SIZE_SORT,
  PAGE_OPTION__5_7_10,
  TABLE_COLUMN_PROPERTIES_PERSON
} from 'src/app/apps/constants/constant';
import { SnrService } from 'src/app/apps/services/snr/snr.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'vex-information-person-property',
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
    FormsModule,
    NgClass,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
  ],
  templateUrl: './information-person-property.component.html',
  styleUrl: './information-person-property.component.scss'
})
export class InformationPersonPropertyComponent {
  /* =========================== ATRIBUTES =========================== */
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  subject$: BehaviorSubject<DataPerson[]> = new BehaviorSubject<DataPerson[]>(
    []
  );
  data$: Observable<DataPerson[]> = this.subject$.asObservable();
  allPersonSnr: DataPerson[] = [];
  page: number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<DataPerson>[] = TABLE_COLUMN_PROPERTIES_PERSON;

  dataSource: MatTableDataSource<DataPerson> =
    new MatTableDataSource<DataPerson>([]);

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  /* ========================== CONSTRUCTOR ========================== */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogPersonData,
    private readonly layoutService: VexLayoutService,
    private snrService: SnrService,
    private cdr: ChangeDetectorRef
  ) {}

  /* ============================ METHODS ============================ */
  /* --------------------- Meth. Lifecycle Hooks --------------------- */
  ngOnInit(): void {
    this.data$.pipe(filter<DataPerson[]>(Boolean)).subscribe((personAllSnr) => {
      this.allPersonSnr = personAllSnr;
      this.dataSource.data = personAllSnr;
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeInformation']) {
      const { currentValue: typeInformation } = changes['typeInformation'];
      if (typeInformation === TYPEINFORMATION_VISUAL) {
        this.pageSize = PAGE_SIZE_SORT;
        this.pageSizeOptions = PAGE_OPTION__5_7_10;
        this.columns = TABLE_COLUMN_PROPERTIES_PERSON;
      } else {
        this.pageSize = PAGE_SIZE_SORT;
        this.pageSizeOptions = PAGE_OPTION__5_7_10;
        this.columns = TABLE_COLUMN_PROPERTIES_PERSON;
      }
    }
  }

  /* -------------------------- Meth. HTML -------------------------- */
  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  toggleColumnVisibility(column: TableColumn<DataPerson>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /* ----------------------- Meth. Listening ----------------------- */

  /* ------------------------- Meth. Common ------------------------- */
  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchBasicInformationPropertyFolio();
    }
  }

  searchBasicInformationPropertyFolio(): void {
    if (!this.data.schema || !this.data.baunitId) {
      return;
    }
    this.getDataSourcePerson(
      this.data.propertyRegistryNumber as string,
      this.data.propertyRegistryOffice as string
    );
  }

  captureInformationSubscribeError(err: any): void {
    this.dataSource.data = [];
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  /* ------------------------ Meth. Services ------------------------ */
  getDataSourcePerson(orip: string, fmi: string) {
    this.snrService.getPersonByOripAndFmi(orip, fmi).subscribe({
      next: (response) => {
        this.allPersonSnr = response;
        this.subject$.next(this.allPersonSnr.reverse());
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener la información de fuente:', error);
      }
    });
  }
}
