import { AfterViewInit, Component, computed, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { Content, User } from 'src/app/apps/interfaces/users/user';
import { PeopleService } from 'src/app/apps/services/people.service';
import { UserService } from 'src/app/apps/services/users/user.service';

@Component({
  selector: 'vex-users',
  standalone: true,
  imports: [
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
    ComboxColletionComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {

  public isDesktop$: Observable<boolean> = this.layoutSerices.isDesktop$;
  public subject$: ReplaySubject<User> = new ReplaySubject<User>(1);
  public data$: Observable<User> = this.subject$.asObservable();
  public actionBtns = computed(() => {
    return [
      {
        name: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      },
      {
        name: 'delete',
        label: 'Eliminar',
        icon: 'mat:delete'
      }
    ]
  })

  public form: FormGroup = this.fb.group({
    'individualTypeNumber': ['', Validators.required],
    'number': ['', Validators.required],
  })
  public columns: { name: string, label: string }[] = [
    {
      name: 'username',
      label: 'Usuario',
    },
    {
      name: 'email',
      label: 'Correo electrónico',
    },
    {
      name: 'role',
      label: 'Rol',
    },
    {
      name: 'enabled',
      label: 'Estado',
    }
  ]
  public dataSource: MatTableDataSource<Content> = new MatTableDataSource<Content>();
  public displayedColumns: string[] = [];
  public totalElements: number = 0;
  public page: number = 0;
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 7, 10, 20, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private readonly layoutSerices: VexLayoutService,
    private peopleService: PeopleService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe({
        next: (data: User) => {
          this.dataSource.data = data.content;
        },
        error: (error: any) => {
          this.snackbar.open('Error al obtener usuarios', 'CLOSE', {
            duration: 4000,
          });
          throw error;
        }
      })

    this.displayedColumns = this.columns.map((column) => column.name);
    this.displayedColumns.push('actions');

    this.data$.pipe(filter<User>(Boolean)).subscribe((dataList) => {
      let data: Content[];
      if (dataList != null && dataList.content.length > 0) {
        this.totalElements = dataList.content.length;
        data = dataList.content;
        this.dataSource.data = data;
      } else {
        this.totalElements = 0;
        this.dataSource.data = [];
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  showTableValue(value: any, key: string): string {
    if (key === 'enabled') {
      return value ? 'Activo' : 'Inactivo';
    }
    return value;
  }

  searchUser() {

    this.peopleService.getPeopleTypeNumber(this.form.value)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          this.snackbar.open('Error al obtener usuarios', 'CLOSE', {
            duration: 4000,
          });
          throw error;
        }
      })
  }

  openDialogAddUser(): void {
    console.log('openDialogAddUser');
  }

  actionMenuHandler(action: string, row: User) {
    if (action === 'edit') {
      console.log('editing....')
    } else if (action === 'delete') {
      console.log('deleting....')
    }
  }
}
