import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
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
import { Observable, ReplaySubject,lastValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import { CommonModule } from '@angular/common';
import { CreatePeopleComponent } from './create-people/create-people.component';

// imports from service people
import { PeopleService } from 'src/app/apps/services/people.service';
import { MatSelectModule } from '@angular/material/select';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { PAGE } from 'src/app/apps/constants/constant';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';


@Component({
  selector: 'vex-people',
  standalone: true,
  imports: [
    ComboxColletionComponent,
    CommonModule,
    FormsModule,
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
    VexSecondaryToolbarComponent,
    MatDialogModule,
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
  private snackBar = inject(MatSnackBar);

  // para enviarlo al formulario
  typeDocument = false;
  infoDoc = 'Id';
  urlQuery = '';

  form: FormGroup = this.fb.group({});

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  // @ViewChild('confirmDialog') private confirmDialog!: SwalComponent;
  @ViewChild('confirmDialog', { static: true }) confirmDialog!: TemplateRef<any>;
  // personalización de las columnas de las tablas
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

  // indicativos de la paginación
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
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.refreshData();
  }

  // obtenemos los datos para el select
  getOpcionSelect(opcion: any): { key: string; value: string } {
    const key = Object.keys(opcion)[0];
    const value = opcion[key];
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

  // eliminación de personas
  deleteCustomer(customer: People) {
      const dialogRef = this.dialog.open(this.confirmDialog);
  
      dialogRef.afterClosed().subscribe(async (data: any) => {
        if (data === 'delete' && customer.individualId) {
          let msg: string = 'Información eliminada con éxito';
          try {
            await lastValueFrom(
              this.peopleService.getDeletePeopleId(
                customer.individualId
              )
            );
            this.dataSource.data = this.dataSource.data.filter((row: People) => {
              return row.individualId !== customer.individualId;
            });
          } catch (e) {
            msg = 'Antes de eliminar la persona se debe eliminar el usuario o la participación.';
          }
          this.snackbar.open(msg, 'CLOSE', { duration: 2000 });
        }
      });
    }

  deleteCustomers(customers: People[]) {
    customers.forEach((c) => this.deleteCustomer(c));
  }

  // creación de personas
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

  // actualización de personas
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
        this.refreshData();
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

  // demás scripts
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
        this.peopleService.getPeopleTypeNumber(obj).subscribe({
          next: (res: any) => {
            this.customers = [res];
            this.dataSource.data = [res];
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackbar.open(
                'No se encontró una persona con ese documento',
                'CLOSE',
                { duration: 5000 }
              );
              this.dialog.open(CreatePeopleComponent, {
                data: {
                  mode: 'create',
                  domIndividualTypeNumber: this.infoDoc,
                  number: value
                }
              });
            }
          }
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

  //función cambio
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
