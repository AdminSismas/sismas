import { SelectionModel } from '@angular/cdk/collections';
import { NgClass, NgFor, NgIf } from '@angular/common';
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
// import { UserAuthData } from 'src/app/core/auth/authData.model';
// import { AuthService } from 'src/app/core/auth/auth.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { AnswerSupportService } from './service/answer-support.service';

@Component({
  selector: 'vex-answer-support',
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
  ],
  templateUrl: './answer-support.component.html',
  styleUrl: './answer-support.component.scss'
})
export class AnswerSupportComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @Input() refreshLogs!: EventEmitter<SupportLogs>; // refresh logs
  @Input() subjectSupportLogsList$: BehaviorSubject<SupportLogs[]> = new BehaviorSubject<SupportLogs[]>([]);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<SupportLogs>;
  selection = new SelectionModel<SupportLogs>(true, []);
  searchCtrl = new UntypedFormControl();

  subscription = new Subscription();
  layoutCtrl = new UntypedFormControl('boxed');
  // currentUser: UserAuthData | null = null;
  subject$: BehaviorSubject<SupportLogs[]> = new BehaviorSubject<SupportLogs[]>([]);
  subjectObservations$: BehaviorSubject<ObservationsData[]> = new BehaviorSubject<ObservationsData[]>([]);
  subjectStatus$: BehaviorSubject<StatusData[]> = new BehaviorSubject<StatusData[]>([]);

  dataObservationsSource = new MatTableDataSource<ObservationsData>();
  dataStatusSource = new MatTableDataSource<StatusData>();

  data$: Observable<SupportLogs[]> = this.subject$.asObservable();
  dataObservations$: Observable<ObservationsData[]> = this.subjectObservations$.asObservable();
  dataStatus$: Observable<StatusData[]> = this.subjectStatus$.asObservable();

  supportLogs: SupportLogs[] = [];
  observations: ObservationsData[] = [];
  status: StatusData[] = [];

  @Input()
  columns: TableColumn<SupportLogs>[] = [
    {
      label: 'Soporte',
      property: 'id_soporte',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Fecha',
      property: 'fecha_hora',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Observación',
      property: 'observacion',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    // {
    //   label: 'Estado',
    //   property: 'status_name',
    //   type: 'text',
    //   editable: false,
    //   visible: true,
    //   cssClasses: ['text-secondary', 'font-medium']
    // },
    // {
    //   label: 'Respuesta',
    //   property: 'respuesta',
    //   type: 'text',
    //   editable: false,
    //   visible: true,
    //   cssClasses: ['text-secondary', 'font-medium']
    // }
  ];
  visibleColumns = this.columns.filter(c => c.visible).map(c => c.property);

  constructor(
    private cd: ChangeDetectorRef,
    private configService: VexConfigService,
    // private authService: AuthService,
    private answerSupportService: AnswerSupportService,
    private supportService: SupportService
  ) {}

  ngOnInit() {
    // this.currentUser = this.authService.getCurrentUser();
    // this.footerVisibleChange(false);

    // this.dataSource = new MatTableDataSource();
    // if (this.currentUser) {
    // } else {
    //   console.error("No user is logged in");
    // }

    // if (!this.subjectSupportLogsList$) {
    //   console.error("subjectSupportLogsList$ is undefined. Initializing as a new BehaviorSubject.");
    //   this.subjectSupportLogsList$ = new BehaviorSubject<SupportLogs[]>([]);
    // }

    // this.subscription.add(
    //   this.subjectSupportLogsList$.subscribe({
    //     next: data => {
    //       distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Compare previous and current values
    //       this.loadAllDataLogs(); // Load logs after subscription is set up
    //     },
    //     error: err => {
    //       console.error("Error in logs subscription:", err);
    //     }
    //   })
    // );
    // this.supportService.getSupportLogs().subscribe((response) => {
    //   if (response.success) {
    //     // Update the supportLogs array with the fetched logs
    //     this.supportLogs = response.data || [];

    //   } else {
    //     console.error('Failed to fetch logs:', response.message);
    //   }
    // });

    // this.data$.pipe(filter<SupportLogs[]>(Boolean)).subscribe((supportLogs) => {
    //   this.supportLogs = supportLogs;
    //   this.dataSource.data = supportLogs;
    // });

    // this.searchCtrl.valueChanges
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value) => this.onFilterChange(value));
  }

  loadAllDataLogs() {
    this.loadObservationSupports();
    this.loadStatusSupports();
    this.loadSupportLogs();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadObservationSupports() {
    this.answerSupportService.getObservationsSupport().subscribe(response => {
      if (response.success && response.data) {
        this.observations = response.data as ObservationsData[];
        this.combineDataSources(); // Merge after loading observations
        this.subjectObservations$.next(this.observations);
        this.cd.markForCheck();
      }
    });
  }

  loadStatusSupports() {
    this.answerSupportService.getStatuses().subscribe(response => {
      if (response.success && response.data) {
        this.status = response.data as StatusData[];
        this.combineDataSources(); // Merge after loading status
        this.subjectStatus$.next(this.status);
        this.cd.markForCheck();
      }
    });
  }

  combineDataSources() {
    // Combine data: Merge observations and status into supportLogs based on matching IDs
    const combinedData = this.supportLogs.map(log => {
      // Find the corresponding observation and status based on matching IDs
      const observation = this.observations.find(obs => obs.id === log.id_soporte);
      const status = this.status.find(stat => stat.id === log.id_status);

      // Return combined object
      return {
        ...log,
        observacion: observation?.observacion || 'N/A', // Default 'N/A' if not found
        status_name: status?.status || 'N/A' // Default 'N/A' if not found
      };
    });

    // Log the final combined data
    this.dataSource.data = combinedData;
    this.dataSource._updateChangeSubscription(); // Notify the table to re-render with the updated data

    // Update the data source and emit the new data
    this.cd.markForCheck();
    this.cd.detectChanges(); // Force change detection
  }

  // Load logs and merge with observations
  loadSupportLogs() {
    // if (!this.currentUser) {
    //   return;
    // }

    // this.answerSupportService.getSupportLogs().pipe(
    //   map(response => {
    //     if (response.success && response.data) {
    //       // Filter logs based on the logged-in user
    //       return response.data.filter(log => log.id_empleado === this.currentUser?.idEmp);
    //     }
    //     return [];
    //   })
    // ).subscribe({
    //   next: filteredLogs => {
    //     if (JSON.stringify(filteredLogs) !== JSON.stringify(this.supportLogs)) {
    //       this.supportLogs = filteredLogs;
    //       this.combineDataSources(); // Merge after loading logs
    //       this.subjectSupportLogsList$.next(this.supportLogs);
    //       this.cd.markForCheck();
    //       this.cd.detectChanges(); // Force refresh
    //     }
    //   },
    //   error: err => {
    //   }
    // });
  }
    toggleColumnVisibility(column: TableColumn<SupportLogs>, event: Event) {
      event.stopPropagation();
      event.stopImmediatePropagation();

      // Impide que las columnas sean ocultadas
      if (column.property === 'fecha_hora' || column.property === 'observacion' || column.property === 'id_soporte') {
        return;
      }
    }

  footerVisibleChange(change: boolean): void {
    this.configService.updateConfig({
      footer: {
        visible: false
      }
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
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

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  onRespuestaChange(row: any): void {
    // Perform an update operation here, such as calling an API to save the changes.
    this.answerSupportService.updateRespuesta(row.id, row.respuesta).subscribe(response => {

    });
  }
}
