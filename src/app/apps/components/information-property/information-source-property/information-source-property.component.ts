// Angular framework
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { BehaviorSubject, filter, Observable } from 'rxjs';
// Vex
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
// Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
// Custom
import { DataSource } from 'src/app/apps/interfaces/information-property/snr-source-info';
import { environment } from 'src/environments/environments';
import { SnrService } from 'src/app/apps/services/snr/snr.service';
import { TypeInformation } from '../../../interfaces/general/content-info';
import {
  PAGE,
  PAGE_OPTION_5_7_10,
  PAGE_SIZE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_SOURCE,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constants';
import {
  InformationPersonPropertyComponent
} from '../information-person-property/information-person-property.component';


@Component({
  selector: 'vex-information-source-property',
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
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgClass,
    FormsModule,
    // Vex
    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    // Custom
  ],
  templateUrl: './information-source-property.component.html',
  styleUrl: './information-source-property.component.scss'
})
export class InformationSourcePropertyComponent {

  subject$: BehaviorSubject<DataSource[]> = new BehaviorSubject<DataSource[]>([]);
  data$: Observable<DataSource[]> = this.subject$.asObservable();
  allSourceSnr: DataSource[] = [];

  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  page: number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<DataSource>[] = TABLE_COLUMN_PROPERTIES_SOURCE;
  propertyRegistryOffice: string | null | undefined = null;
  propertyRegistryNumber: string | null | undefined = null;
  dataSource: MatTableDataSource<DataSource> = new MatTableDataSource<DataSource>([]);
//dataSource!: MatTableDataSource<DataSource>;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  /* ========================== CONSTRUCTOR ========================== */
  constructor(
    private snrService: SnrService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  /* ============================ METHODS ============================ */
  /* --------------------- Meth. Lifecycle Hooks --------------------- */
  ngOnInit(): void {
    this.data$.pipe(filter<DataSource[]>(Boolean)).subscribe((sourceAllSnr) => {
      this.allSourceSnr = sourceAllSnr;
      this.dataSource.data = sourceAllSnr;
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
      if (typeInformation === TYPE_INFORMATION_VISUAL) {
        this.pageSize = PAGE_SIZE_SORT;
        this.pageSizeOptions = PAGE_OPTION_5_7_10;
        this.columns = TABLE_COLUMN_PROPERTIES_SOURCE;
      } else {
        this.pageSize = PAGE_SIZE_SORT;
        this.pageSizeOptions = PAGE_OPTION_5_7_10;
        this.columns = TABLE_COLUMN_PROPERTIES_SOURCE;
      }
    }
  }

  /* -------------------------- Meth. HTML -------------------------- */


  get visibleColumns() {
    const visibleColumns = ['detalles', ...this.columns
      .filter((column) => column.visible)
      .map((column) => column.property)]

    return visibleColumns;
  }

  toggleColumnVisibility(column: TableColumn<DataSource>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /* ----------------------- Meth. Listening ----------------------- */


  /* ------------------------- Meth. Common ------------------------- */


  searchBasicInformationPropertyFolio(orip: string, fmi: string): void {
    if (!this.schema || !this.baunitId) {
      return;
    }
    this.getDataSourceFolio(orip, fmi);
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
  getDataSourceFolio(orip: string, fmi: string) {
    this.propertyRegistryOffice = orip;
    this.propertyRegistryNumber = fmi;
    this.snrService.getSourceByOripAndFmi(orip, fmi).subscribe({
      next: (response) => {
        this.allSourceSnr = response;
        this.subject$.next(this.allSourceSnr.reverse());
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  viewDetails(row: DataSource): void {
    this.dialog.open(InformationPersonPropertyComponent, {
      data: {
        propertyRegistryOffice: this.propertyRegistryOffice,
        propertyRegistryNumber: this.propertyRegistryNumber,
        anotacion: row.anotacion,
        baunitId: this.baunitId,
        schema: this.schema,
        executionId: this.executionId,
      }
    })
  }
}
