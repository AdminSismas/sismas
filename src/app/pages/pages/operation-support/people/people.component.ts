/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, computed, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import {
  FormControl,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { People as People } from '@shared/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Observable,
  ReplaySubject,
  Subject,
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  takeUntil
} from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

// imports from service people
import { PeopleService } from '@shared/services';
import {
  MODAL_SMALL_LARGE,
  MODIFY_PEOPLE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_OPTION_UNIQUE,
  PEOPLE_TABLE_COLUMNS
} from '../../../../apps/constants/general/constants';
import { InformationPegeable } from '@shared/interfaces';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@shared/services';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { InfoContact } from 'src/app/apps/interfaces/information-property/info-contact';
import { CreatePeopleComponent } from './components/create-people/create-people.component';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';

@Component({
  selector: 'vex-people',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIcon,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatDialogModule
  ],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent implements OnInit {
  // Properties
  columns: TableColumn<People>[] = PEOPLE_TABLE_COLUMNS;

  // Injects
  dialog = inject(MatDialog);
  peopleService = inject(PeopleService);
  userService = inject(UserService);

  // datos principales
  subject$: ReplaySubject<People[]> = new ReplaySubject<People[]>(1);
  data$: Observable<People[]> = this.subject$.asObservable();
  customers: People[] = [];

  // para enviarlo al formulario
  user: DecodeJwt | null = this.userService.getUser();
  availableRoles = MODIFY_PEOPLE.includes(this.user?.role ?? '');
  layoutCtrl = new UntypedFormControl('boxed');
  searchControl = new FormControl('');
  cancelSearch$ = new Subject<void>();

  visibleColumns = computed(() => {
    return this.columns
      .filter((column) => {
        if (this.availableRoles) {
          return column.visible;
        }
        return column.visible && column.property !== 'actions';
      })
      .map((column) => column.property);
  });

  // indicativos de la paginación
  page: number = PAGE;
  pageSize = PAGE_OPTION_UNIQUE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  dataSource!: MatTableDataSource<People>;
  selection = new SelectionModel<People>(true, []);
  contentInformation!: InformationPegeable;

  ngOnInit() {
    this.setupSearchSubscription();

    this.dataSource = new MatTableDataSource();

    this.refreshData();
  }

  private setupSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.cancelSearch$)
      )
      .subscribe(() => {
        this.searchPeople();
      });
  }

  onEnterSearch() {
    this.cancelSearch$.next();
    this.page = 0;
    this.searchPeople();

    this.setupSearchSubscription();
  }

  // eliminación de personas
  deleteCustomer(customer: People) {
    if (this.user?.role !== 'ADMIN') return;

    Swal.fire({
      title: 'Eliminar persona',
      text: '¿Desea eliminar la persona?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (customer.individualId) {
          await this.executeDeleteService(customer);
        }
      }
    });
  }

  async executeDeleteService(customer: People) {
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
      .subscribe((customer: InfoPerson) => {
        if (customer) {
          this.customers.unshift(new People(customer));
          this.subject$.next(this.customers);
        }
      });
  }

  // actualización de personas
  updateCustomer(customer: People) {
    if (!this.availableRoles) return;

    this.peopleService
      .getContactByIndividualId(customer.individualId)
      .subscribe({
        next: (contact) => {
          this.openEditPersonDialog(customer, contact);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            Swal.close();
            this.openEditPersonDialog(customer, null);
          }
        }
      });
  }

  openEditPersonDialog(customer: People, contact: InfoContact | null) {
    this.dialog
      .open(CreatePeopleComponent, {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: {
          ...customer,
          contact: contact,
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

  refreshData() {
    const params = {
      page: this.page,
      size: this.pageSize,
      sortBy: 'number'
    };
    this.peopleService.getAllPeople(params).subscribe((res: any) => {
      this.customers = res.content;
      this.dataSource.data = res.content;
      this.totalElements = res.totalElements ?? 0;
    });
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

  refreshPaginatorNext(eventPage: PageEvent) {
    this.page = eventPage.pageIndex;
    this.pageSize = eventPage.pageSize;

    if (this.searchControl.value) {
      this.searchPeople(this.page, this.pageSize);
      return;
    }
    this.refreshData();
  }

  searchPeople(page = this.page, size = this.pageSize) {
    if (!this.searchControl.value) {
      this.refreshData();
      return;
    }
    const pageConfig = { page, size };

    this.peopleService
      .getPeopleSearch(this.searchControl.value, pageConfig)
      .subscribe((response: InformationPegeable) => {
        const content = response.content as People[];
        this.dataSource.data = content;
        this.totalElements = response.totalElements ?? 0;
      });
  }
}
