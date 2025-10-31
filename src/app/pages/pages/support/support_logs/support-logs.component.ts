import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

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
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';


import { SupportService } from '../service/support.service';


import { env } from 'src/environments/environments.soporte';
import { Ticket } from './model/ticket.model';

import { UserService } from '@shared/services';



@Component({
  selector: 'vex-support-logs',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
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
      },
      (error) => {
        console.error('Error fetching tickets:', error);
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
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }
}
