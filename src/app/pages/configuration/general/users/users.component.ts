import {
  AfterViewInit,
  Component,
  computed,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  User,
  InformationPageableUser
} from '@features/configuration/interfaces/users/user';
import { CreateUsersComponent } from '@features/configuration/components/general/create-users/create-users.component';
import { USER_COLUMNS } from '@shared/constants/users.constants';
import { PAGE_SIZE_OPTION } from '@shared/constants/constants';
import { TitleCasePipe } from '@angular/common';
import { CadastralUserService } from '@features/configuration/services/general/users/user.service';

@Component({
  selector: 'vex-users',
  standalone: true,
  imports: [
    TitleCasePipe,
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
    VexPageLayoutContentDirective
    /* Custom */
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {
  public isDesktop$: Observable<boolean> = this.layoutSerices.isDesktop$;
  public subject$: ReplaySubject<InformationPageableUser> =
    new ReplaySubject<InformationPageableUser>(1);
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
  private cancelSearch$ = new Subject<void>();

  public columns: { name: string; label: string }[] = USER_COLUMNS;
  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  public displayedColumns: string[] = [];
  public totalElements = 0;
  public page = 0;
  public pageSize = 10;
  public pageSizeOptions: number[] = PAGE_SIZE_OPTION;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private cadastralUserService: CadastralUserService,
    private readonly layoutSerices: VexLayoutService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getUsers();

    this.displayedColumns = this.columns.map((column) => column.name);
    this.displayedColumns.push('actions');

    this.setupSearchSubscription();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  getUsers(page = 0, size = 10): void {
    this.cadastralUserService
      .getUsers(page, size)
      .subscribe((data: InformationPageableUser) => {
        this.dataSourceFormat(data);
        this.totalElements = data.totalElements;
        this.page = page;
        this.pageSize = size;
      });
  }

  dataSourceFormat(data: InformationPageableUser): void {
    this.dataSource.data = data.content.map((row: User) => {
      return {
        ...row,
        fullName: row.individual.fullName
      };
    });
  }

  pageEvent(pageEvent: PageEvent): void {
    if (this.searchCtrl.value) {
      this.searchUser(pageEvent.pageIndex, pageEvent.pageSize);
      return;
    }
    this.getUsers(pageEvent.pageIndex, pageEvent.pageSize);
  }

  showTableValue(value: string | boolean, key: string): string {
    if (key === 'enabled') {
      return value ? 'Activo' : 'Inactivo';
    }
    return value as string;
  }

  openDialogAddUser(): void {
    this.dialog
      .open(CreateUsersComponent, {
        data: {
          mode: 'create'
        }
      })
      .afterClosed()
      .subscribe(() => {
        setTimeout(() => {
          this.getUsers(this.page, this.pageSize);
        }, 300);
      });
  }

  actionMenuHandler(action: string, row: InformationPageableUser) {
    if (action === 'edit') {
      this.dialog
        .open(CreateUsersComponent, {
          data: {
            ...row,
            mode: 'edit'
          }
        })
        .afterClosed()
        .subscribe(() => {
          setTimeout(() => {
            this.getUsers(this.page, this.pageSize);
          }, 300);
        });
    }
  }

  searchUser(page = 0, size = this.pageSize) {
    if (!this.searchCtrl.value) {
      this.getUsers();
      return;
    }

    const pageConfig = { page, size};
    this.cadastralUserService.searchUser(this.searchCtrl.value, pageConfig).subscribe((res) => {
      this.dataSource.data = res.content as User[];
      this.totalElements = res.totalElements ?? 0;
      this.page = page;
      this.pageSize = size;
    });
  }

  onEnterSearch() {
    this.cancelSearch$.next();
    this.searchUser();

    setTimeout(() => {
      this.setupSearchSubscription();
    }, 0);
  }

  private setupSearchSubscription() {
    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.cancelSearch$)
      )
      .subscribe(() => {
        this.searchUser();
      });
  }
}
