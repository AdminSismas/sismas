import { Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core'; // √
import { ReactiveFormsModule, FormsModule, UntypedFormControl } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, takeUntil } from 'rxjs';

// recursos de vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

// recursos de angular material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

// recursos de archivos locales
import { DomainLadmColService } from '../../services/domain-ladm-col.service';
import { DomainCollection } from '../../interfaces/domain-name.model';
import { PageSortByData } from '../../interfaces/page-sortBy-data.model';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { contentInfoDomainLadmCol } from '../../interfaces/content-info-domainLadmCol.model';
import { PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from '../../constants/domain-ladm-col.constant';





@Component({
  templateUrl: './table-domain-ladm-col.component.html',
  styleUrl: './table-domain-ladm-col.component.scss',
  selector: 'vex-table-domain-ladm-col',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    VexBreadcrumbsComponent,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgFor,
    NgClass,
    NgIf
  ]
})

export class TableDomainLadmColComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  layoutCtrl = new UntypedFormControl('boxed');
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  dataSource!: MatTableDataSource<DomainCollection>;
  contentInformations!: InformationPegeable;

  @Input()
  page:number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements: number = 0;
  columns: TableColumn<contentInfoDomainLadmCol>[] = TABLE_COLUMN_PROPERTIES;

  // referencias a los elementos de la tabla
  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);


  /* ============== CONSTRUCTOR ============== */
  constructor(
    private domainLadmColService: DomainLadmColService,
    private readonly layoutService: VexLayoutService,
  ) {}



  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    // Aquí tu lógica inicial
    this.dataSource = new MatTableDataSource();

    // se usan los métodos pipe y subscribe para que el valor de la búsqueda se actualice en tiempo real
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    // se llama el método q usara el servicio de la petición a la API
    this.getDataFromDomainLadmService();
  }


  // asignar el paginador y la funcionalidad de ordenación a la fuente de datos de la tabla
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }



  /* ------- Meth. HTML ------- */
  //1 método para mostrar las columnas
  toggleColumnVisibility(column: TableColumn<contentInfoDomainLadmCol>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }


  //2 método para actualizar la información de la tabla
  refreshInformationpaginator(event: any): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getDataFromDomainLadmService();
  }


  //3. método para realizar la búsqueda de la información
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }


  //4. método para poner visible las columnas
  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }



  /* ------- Meth. Common ------- */
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }


  // objeto de paginador de la tabla
  generateObjectPageDomainLadmColData(): PageSortByData {
    const sortBy: string = 'domainName';
    return new PageSortByData(this.page, this.pageSize, sortBy);
  }



  /* ------- Meth. Services ------- */
  //ser. servicio para realizar la petición a la API
  getDataFromDomainLadmService() {
    this.domainLadmColService.getDataPropertyByDomainName(this.generateObjectPageDomainLadmColData())
    .subscribe({
        next: (result: any) => {
            this.captureInformationSubscribe(result); // se llama el método para que capturar la información de la API
        },
        error: (error) => {
            console.error('Hubo un error al obtener los datos: ', error);
        },
        complete: () => {
            console.log('Carga completa de datos');
        }
    });
  }

  //ser.1 método para capturar todo el objeto completo la información de la API
  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data;
    this.captureInformationDomainLadmColData();
  }

  //ser.2 método para capturar el sub objeto content de la información de la API
  captureInformationDomainLadmColData() {
    let data: contentInfoDomainLadmCol[];
    if (this.contentInformations != null && this.contentInformations.content != null) {
      data = this.contentInformations.content.map((row: contentInfoDomainLadmCol) => new contentInfoDomainLadmCol(row)); // se mapea la información de la API para mostrarla en la tabla cambiando de tipo de dato
      console.log("data: ", data);
      this.dataSource.data = data;
    }
    // funcionamiento de paginador, navegación entre vistas de registros en tabla
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
