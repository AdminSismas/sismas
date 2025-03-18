import { AfterViewInit, Component, computed, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { Observable, ReplaySubject } from 'rxjs';
import { User, InformationPagebleUser } from 'src/app/apps/interfaces/users/user';
import { UserService } from 'src/app/apps/services/users/user.service';
import { CreateUsersComponent } from './create-users/create-users.component';
import { USER_COLUMNS } from '../../../../../apps/constants/general/users.constants';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PAGE_OPTION__10_20_50_100 } from '../../../../../apps/constants/general/constant';

@Component({
  selector: 'vex-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    /* Material */
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    /* Vex */
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    /* Custom */
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {

  public isDesktop$: Observable<boolean> = this.layoutSerices.isDesktop$;
  public subject$: ReplaySubject<InformationPagebleUser> = new ReplaySubject<InformationPagebleUser>(1);
  public actionBtns = computed(() => {
    return [
      {
        name: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      }
    ];
  });
  public searchCtrl: FormControl = new FormControl();

  public columns: { name: string, label: string }[] = USER_COLUMNS;
  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  public displayedColumns: string[] = [];
  public totalElements = 0;
  public page = 0;
  public pageSize = 10;
  public pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private userService: UserService,
    private readonly layoutSerices: VexLayoutService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUsers();

    this.displayedColumns = this.columns.map((column) => column.name);
    this.displayedColumns.push('actions');
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  getUsers(page = 0, size = 10): void {
    this.userService.getUsers(page, size)
      .subscribe({
        next: (data: InformationPagebleUser) => {
          this.dataSourceFormat(data);
          this.totalElements = data.totalElements;
          this.page = page;
          this.pageSize = size;
        },
        error: (error: any) => {
          this.snackbar.open('Error al obtener usuarios', 'CERRAR', {
            duration: 10000,
          });
          throw error;
        }
      });
  }

  dataSourceFormat(data: InformationPagebleUser): void {
    this.dataSource.data = data.content.map((row: User) => {
      return {
        ...row,
        fullName: row.individual.fullName
      };
    });
  }

  pageEvent(pageEvent: PageEvent): void {
    this.getUsers(pageEvent.pageIndex, pageEvent.pageSize);
  }

  showTableValue(value: any, key: string): string {
    if (key === 'enabled') {
      return value ? 'Activo' : 'Inactivo';
    }
    return value;
  }

  openDialogAddUser(): void {
    console.log('openDialogAddUser');
    this.dialog.open(CreateUsersComponent, {
      data: {
        mode: 'create'
      }
    })
      .afterClosed()
      .subscribe((result: InformationPagebleUser) => {
        console.log(result);
        setTimeout(() =>{
          this.getUsers(this.page, this.pageSize);
        } , 300);
      });
  }

  actionMenuHandler(action: string, row: InformationPagebleUser) {
    if (action === 'edit') {
      console.log('editing....');
      this.dialog.open(CreateUsersComponent, {
        data: {
          ...row,
          mode: 'edit'
        }
      })
        .afterClosed()
        .subscribe((result: InformationPagebleUser) => {
          console.log(result);
          setTimeout(() =>{
            this.getUsers(this.page, this.pageSize);
          } , 300);
        });
    } else if (action === 'delete') {
      console.log('deleting....');
    }
  }

  searchUser() {
    if (!this.searchCtrl.value) {
      this.getUsers();
      return;
    }
    this.userService.searchUser(this.searchCtrl.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.dataSource.data = [res];
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.snackbar.open('Usuario no encontrado', 'CERRAR', { duration: 10000 });
          }
          throw error;
        }
      });
  }
}
