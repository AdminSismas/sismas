import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexConfigService } from '@vex/config/vex-config.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SupportService } from '../service/support.service';
import { ObservationsData } from './model/observations.model';
import { StatusData } from './model/status.model';
import { SupportLogs } from './model/supportLogs.model';
import { SupportLogsService } from './service/support-logs.service';
// import { UserAuthData } from 'src/app/core/auth/authData.model';
// import { AuthService } from 'src/app/core/auth/auth.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { env } from 'src/environments/environments.soporte';
import { Ticket } from './model/ticket.model';
import { CustomDatePipe } from 'src/app/apps/pipes/custom-date.pipe';
import { UserService } from '../../auth/login/services/user.service';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';


@Component({
  selector: 'vex-support-logs',
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './support-logs.component.html',
  styleUrl: './support-logs.component.scss'
})
export class SupportLogsComponent implements OnInit, AfterViewInit {

  private apiTickets = `${env.url_base}${env.api}${env.module.soporte}`;  
  userID: number | null = null;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['No.Ticket', 'title', 'priorityId', 'createdAt', 'updatedAt'];
  dataSource = new MatTableDataSource<Ticket>([]);
  selection = new SelectionModel<Ticket>(true, []);
  searchCtrl = new UntypedFormControl();

  constructor(
    private supportService: SupportService,
    private userService: UserService,

  ) {}

  getPriorityText(priorityId: number): string {
    switch (priorityId) {
      case 1: return 'Baja';
      case 2: return 'Normal';
      case 3: return 'Alta';
      default: return 'Desconocida';
    }
  }

  getPriorityClass(priorityId: number): string {
    switch (priorityId) {
      case 1: return 'badge-low';
      case 2: return 'badge-normal';
      case 3: return 'badge-high';
      default: return 'badge-unknown';
    }
  }

  ngOnInit() {
    this.userID = this.userService.getUserData();
    this.fetchTickets();

    this.searchCtrl.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.active = 'id';     
    this.sort.direction = 'desc'; 
    this.dataSource.sort = this.sort;
  }

  fetchTickets(): void {
    if (!this.userID) {
      return;
    }
    this.supportService.getTickets(this.userID).subscribe(
      (response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log('Tickets cargados:', this.dataSource.data);
      },
      (error) => {
        console.error('Error al cargar los tickets', error);
      }
    );
   
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
}
