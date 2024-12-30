import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';

import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { People as People } from '../../../../apps/interfaces/people.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { filter, Observable, of, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { CreatePeopleComponent } from './create-people/create-people.component';

// imports from service people
import { PeopleService } from 'src/app/apps/services/people.service';
import { ComboboxComponent } from 'src/app/apps/components/combobox/combobox.component';
import { ComboxAutoCompleteComponent } from 'src/app/apps/components/combox-auto-complete/combox-auto-complete.component';
import { MatSelectModule } from '@angular/material/select';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { FilterCadastralSearchComponent } from 'src/app/apps/components/table-cadastral-search/filter-cadastral-search/filter-cadastral-search.component';
import { PAGE, PAGE_SIZE } from 'src/app/apps/constants/constant';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'vex-people',
  standalone: true,
  imports: [
    ComboboxComponent,
    ComboxAutoCompleteComponent,
    ComboxColletionComponent,
    CommonModule,
    FilterCadastralSearchComponent,
    FormsModule,
    InConstructionComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    VexBreadcrumbsComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    VexSecondaryToolbarComponent,
  ],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('boxed');

  // datos principales
  subject$: ReplaySubject<People[]> = new ReplaySubject<People[]>(1);
  data$: Observable<People[]> = this.subject$.asObservable();
  customers: People[] = [];

  // para enviarlo al formulario
  typeDocument = false;
  infoDoc = 'Id';
  urlQuery = '';

  form: FormGroup = this.fb.group({});

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  // personalizacion de las columnas de las tablas
  @Input()
  columns: TableColumn<People>[] = [
    {
      label: 'Checkbox',
      property: 'checkbox',
      type: 'checkbox',
      visible: false
    },
    {
      label: 'Nombre',
      property: 'fullName',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },

    { label: 'Apellido', property: 'lastName', type: 'text', visible: false },

    {
      label: 'Documento',
      property: 'number',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Tipo de persona',
      property: 'domIndividualType',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  // indicativos de la paginacion
  page: number = PAGE;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  totalElements = 0;
  dataSource!: MatTableDataSource<People>;
  selection = new SelectionModel<People>(true, []);
  name = new UntypedFormControl();
  document = new UntypedFormControl();
  peopleType = new UntypedFormControl();
  nombre = new UntypedFormControl();
  contentInformation!: InformationPegeable;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  // constructor del componente
  constructor(
    private dialog: MatDialog,
    private peopleService: PeopleService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.refreshData();
  }

  // obtenemos los datos para el select
  getOpcionSelect(opcion: any): { key: string; value: string } {
    const key = Object.keys(opcion)[0]; //llave
    const value = opcion[key]; // valor
    return { key, value };
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  // eliminacion de personas
  deleteCustomer(customer: People) {
    this.customers.splice(
      this.customers.findIndex(
        (existingCustomer) => existingCustomer.id === customer.id
      ),
      1
    );
    this.selection.deselect(customer);
    this.subject$.next(this.customers);
  }

  deleteCustomers(customers: People[]) {
    customers.forEach((c) => this.deleteCustomer(c));
  }

  // creacion de personas
  createCustomer() {
    this.dialog
      .open(CreatePeopleComponent)
      .afterClosed()
      .subscribe((customer: People) => {
        /**
         * Customer is the updated customer (if the user pressed Save - otherwise it's null)
         */
        if (customer) {
          /**
           * Here we are updating our local array.
           * You would probably make an HTTP request here.
           */
          this.customers.unshift(new People(customer));
          this.subject$.next(this.customers);
        }
      });
  }

  // actualizacion de personas
  updateCustomer(customer: People) {
    this.dialog
      .open(CreatePeopleComponent, {
        data: {
          ...customer,
          mode: 'update'
        }
      })
      .afterClosed()
      .subscribe((updatedCustomer) => {
        /**
         * Customer is the updated customer (if the user pressed Save - otherwise it's null)
         */
        if (updatedCustomer) {
          /**
           * Here we are updating our local array.
           * You would probably make an HTTP request here.
           */
          const index = this.customers.findIndex(
            (existingCustomer) => existingCustomer.id === updatedCustomer.id
          );
          this.customers[index] = new People(updatedCustomer);
          this.subject$.next(this.customers);
        }
      });
  }

  // demas scritps
  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    if (this.infoDoc !== 'Id') {
      if (value !== '') {
        const obj = {
          number: value,
          page: this.page,
          size: this.pageSize,
          individualTypeNumber: this.infoDoc
        };
        this.peopleService.getPeopleTypeNumber(obj).subscribe((res: any) => {
          this.customers = [res];
          this.dataSource.data = [res];
        });
      } else {
        this.refreshData();
      }
    } else {
      if (value !== '') {
        const obj = {
          number: value
        };
        this.peopleService.getPeopleNumber(obj).subscribe((res: any) => {
          this.customers = [res];
          this.dataSource.data = [res];
        });
      } else {
        this.refreshData();
      }
    }
  }

  refreshData() {
    const params = {
      page: this.page,
      size: this.pageSize,
      sortBy: 'number'
    };
    this.peopleService.getAllPeople(params).subscribe((res: any) => {
      this.customers = res.content;
      this.dataSource.data = res.content;
      if (res.totalElements) {
        this.totalElements = res.totalElements;
      }
    });
  }

  toggleColumnVisibility(column: TableColumn<People>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onLabelChange(change: MatSelectChange, row: People) {
    const index = this.customers.findIndex((c) => c === row);
    this.customers[index].labels = change.value;
    this.subject$.next(this.customers);
  }

  //funcion cambio
  cambio(event?: any) {
    const valorSeleccionado = event.value;

    if (valorSeleccionado === 'number') {
      this.typeDocument = true;
    } else {
      this.typeDocument = false;
      this.infoDoc = 'Id';
    }
  }

  infoSelect(info: string) {
    this.infoDoc = info;
  }

  refreshPaginatorNext(eventPage: PageEvent) {
    this.page = eventPage.pageIndex;
    this.pageSize = eventPage.pageSize;

    this.refreshData();
  }

  search() {
    console.log('consultar');
    this.onFilterChange(this.document.value);
  }
}
