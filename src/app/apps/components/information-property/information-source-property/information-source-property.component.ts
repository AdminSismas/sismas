import { AsyncPipe, NgForOf, NgIf, NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VexHighlightDirective } from '@vex/components/vex-highlight/vex-highlight.directive';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { Observable, BehaviorSubject, filter } from 'rxjs';
import { TYPEINFORMATION_EDITION, PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES_SOURCE, TYPEINFORMATION_VISUAL, PAGE_OPTION__5_7_10, PAGE_SIZE_SORT } from 'src/app/apps/constants/constant';
import { TypeInformation } from 'src/app/apps/interfaces/content-info';
import { DataSource } from 'src/app/apps/interfaces/information-property/snr-source-info';
import { SnrService } from 'src/app/apps/services/snr/snr.service';
import { environment } from 'src/environments/environments';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger80ms, stagger40ms } from '@vex/animations/stagger.animation';


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
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatTabsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    VexHighlightDirective,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatPaginatorModule,
    MatTooltipModule,
    MatCardModule,
    HeaderCadastralInformationPropertyComponent,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
  ],
  templateUrl: './information-source-property.component.html',
  styleUrl: './information-source-property.component.scss'
})
export class InformationSourcePropertyComponent {
  /* =========================== ATRIBUTES =========================== */
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  subject$: BehaviorSubject<DataSource[]> = new BehaviorSubject<DataSource[]>([]);
  data$: Observable<DataSource[]> = this.subject$.asObservable();
  allSourceSnr: DataSource[] = [];
  
  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;
  @Input() propertyRegistryOffice: string | null | undefined = '';
  @Input() propertyRegistryNumber: string | null | undefined = '';

  page: number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<DataSource>[] = TABLE_COLUMN_PROPERTIES_SOURCE;
  
  dataSource: MatTableDataSource<DataSource> = new MatTableDataSource<DataSource>([]);
//dataSource!: MatTableDataSource<DataSource>;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  /* ========================== CONSTRUCTOR ========================== */
  constructor(
    private readonly layoutService: VexLayoutService,
    private snrService: SnrService,
    private cdr: ChangeDetectorRef,
  ) { }

  /* ============================ METHODS ============================ */
  /* --------------------- Meth. Lifecycle Hooks --------------------- */
  ngOnInit(): void {
    this.isExpandPanel(this.expandedComponent);

    //this.getDataSourceFolio();
    //this.dataSource = new MatTableDataSource<DataSource[]>();

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
    const { currentValue: typeInformation } = changes['typeInformation'];
    if (typeInformation === TYPEINFORMATION_VISUAL) {
      this.pageSize = PAGE_SIZE_SORT;
      this.pageSizeOptions = PAGE_OPTION__5_7_10;
      this.columns = TABLE_COLUMN_PROPERTIES_SOURCE;
    } else {
      this.pageSize = PAGE_SIZE_SORT;
      this.pageSizeOptions = PAGE_OPTION__5_7_10;
      this.columns = TABLE_COLUMN_PROPERTIES_SOURCE;
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

  toggleColumnVisibility(column: TableColumn<DataSource>, event: Event) {
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
    if (!this.schema || !this.baunitId) {
      return;
    }
    this.getDataSourceFolio(this.propertyRegistryNumber as string, this.propertyRegistryOffice as string);
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
    this.snrService.getSourceByOripAndFmi(orip, fmi).subscribe({
      next: (response) => {
        this.allSourceSnr = response;
        this.subject$.next(this.allSourceSnr.reverse());
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener la información de fuente:', error);
      }
    });
  }
}
