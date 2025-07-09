/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
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
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
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
import { People as People } from '../../../../apps/interfaces/users/people.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, ReplaySubject, lastValueFrom } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import { CreatePeopleComponent } from './create-people/create-people.component';

// imports from service people
import { PeopleService } from '../../../../apps/services/users/people.service';
import { MatSelectModule } from '@angular/material/select';
import { ComboboxCollectionComponent } from '../../../../apps/components/general-components/combobox-collection/combobox-collection.component';
import {
  MODAL_SMALL_LARGE,
  PAGE,
  TOP_ROLE_LIST
} from '../../../../apps/constants/general/constants';
import { InformationPegeable } from '../../../../apps/interfaces/general/information-pegeable.model';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../auth/login/services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-people',
  standalone: true,
  imports: [
    ComboboxCollectionComponent,
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
    MatDialogModule
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
  user: DecodeJwt | null = this.userService.getUser();
  form!: FormGroup;
  availableRoles = TOP_ROLE_LIST.includes(this.user?.role ?? '');

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true })
  confirmDialog!: TemplateRef<any>;

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
      .filter((column) => {
        if (this.availableRoles) {
          return column.visible;
        }
        return column.visible && column.property !== 'actions';
      })
      .map((column) => column.property);
  }

  // indicativos de la paginación
  page: number = PAGE;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  totalElements = 0;
  dataSource!: MatTableDataSource<People>;
  selection = new SelectionModel<People>(true, []);
  contentInformation!: InformationPegeable;

  constructor(
    private dialog: MatDialog,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      document: ['', [Validators.required]],
      typeNumberDocument: ['', [Validators.required]]
    });
    this.dataSource = new MatTableDataSource();

    this.refreshData();
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
    if (this.user?.role !== 'ADMIN') return;

    const dialogRef = this.dialog.open(this.confirmDialog);

    dialogRef.afterClosed().subscribe(async (data) => {
      if (data === 'delete' && customer.individualId) {
        try {
          await lastValueFrom(
            this.peopleService.getDeletePeopleId(customer.individualId)
          );
          this.dataSource.data = this.dataSource.data.filter((row: People) => {
            return row.individualId !== customer.individualId;
          });
          Swal.fire({
            icon: 'success',
            text: 'Información eliminada con éxito.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            timer: 5000
          });
        } catch {
          Swal.fire({
            icon: 'error',
            text: 'Antes de eliminar la persona se debe eliminar el usuario o la participación.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            timer: 5000
          });
        }
      }
    });
  }

  deleteCustomers(customers: People[]) {
    customers.forEach((c) => this.deleteCustomer(c));
  }

  // creación de personas
  createCustomer() {
    if (!this.availableRoles) return;

    this.dialog
      .open(CreatePeopleComponent, {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: {
          mode: 'create'
        }
      })
      .afterClosed()
      .subscribe((customer: People) => {
        if (customer) {
          this.customers.unshift(new People(customer));
          this.subject$.next(this.customers);
        }
      });
  }

  // actualización de personas
  updateCustomer(customer: People) {
    if (!this.availableRoles) return;

    this.dialog
      .open(CreatePeopleComponent, {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: {
          ...customer,
          mode: 'update'
        }
      })
      .afterClosed()
      .subscribe((updatedCustomer) => {
        this.refreshData();
        if (updatedCustomer) {
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
    // value = value.toLowerCase();
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) this.selection.clear();
    else this.dataSource.data.forEach((row) => this.selection.select(row));
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
    console.log(this.form.value);
    this.onFilterChange(this.form.get('document')?.value);
  }
}
