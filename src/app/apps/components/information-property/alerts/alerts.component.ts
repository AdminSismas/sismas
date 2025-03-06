/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatCardModule } from '@angular/material/card';
import {
  MODAL_SMALL,
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION,
  TYPE_INFORMATION_EDITION
} from '../../../constants/general/constant';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { AlertsService } from '../../../services/alerts/alertes.service';
import { InfoOwners } from '../../../interfaces/information-property/info-owners';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatSort } from '@angular/material/sort';
import { TypeInformation } from '../../../interfaces/general/content-info';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DetailAlertsComponent } from './detail-alerts/detail-alerts.component';

export type InfoOwnerRowT = Pick<InfoOwners, 'rightId' | 'beginAt' | 'endsIn' |'fractionS' | 'domRightType'> &
  Pick<InfoPerson, 'domIndividualTypeNumber' | 'number' | 'fullName'>;

@Component({
  selector: 'vex-alerts',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    CommonModule,
    HeaderCadastralInformationPropertyComponent,
    MatCardModule,
    MatRippleModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent implements OnInit, AfterViewInit {

  @Input({ required: true }) id = '';
  @Input({ required: true }) expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable? = true;
  alerts: any[] = [];
  dataSource = new MatTableDataSource<any>([]);

  protected readonly TABLE_COLUMNS: TableColumn<InfoOwnerRowT>[] = [
    {
      label: 'Detalle',
      property: 'viewDetail',
      type: 'button',
      visible: true
    },
    {
      label: 'Tipo',
      property: 'domIndividualTypeNumber',
      type: 'text',
      visible: true
    },
    {
      label: 'Estado',
      property: 'fullName',
      type: 'text',
      visible: true
    },
    {
      label: 'Fecha inicio',
      property: 'beginAt',
      type: 'text',
      visible: true
    },
    {
      label: 'Fecha fin',
      property: 'endsIn',
      type: 'text',
      visible: true
    },
    {
      label: 'Acciones',
      property: 'actions',
      type: 'button',
      visible: true
    }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('confirmDialog', { static: true }) confirmDialog: TemplateRef<any> | undefined;

  fractions_sum = 0;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  rightIdSelected?: number;
  // dataSource: MatTableDataSource<InfoOwners> =
  //   new MatTableDataSource<InfoOwners>([]);
  columns = signal(this.TABLE_COLUMNS);
  textColumns = computed(() =>
    this.columns().filter((column) => column.type === 'text')
  );
  visibleColumns = computed(() => {
    return this.TABLE_COLUMNS.filter((column) => column.visible).map(
      (column) => column.property
    );
  });
  actionBtns = computed(() => {
    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      },
      {
        id: 'delete',
        label: 'Eliminar',
        icon: 'mat:delete'
      }
    ];
  });
  addEditDialogContent = computed<{ title: string }>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initialState: any = {
      title: 'Nueva información de propietario'
    };
    return { ...initialState };
  });

  private alertsService = inject(AlertsService);
  private matDialog = inject(MatDialog);

  constructor(
    private snakbar: MatSnackBar
  ) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator || null;
    this.dataSource.sort = this.sort || null;
  }

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema;
    this.isExpandPanel(this.expandedComponent);
    this.TABLE_COLUMNS.at(-1)!.visible = this.typeInformation === 'edition' && this.editable;
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.loadAlertsByBaunitId();
    }
  }


  loadAlertsByBaunitId(): void {
    if (!this.baunitId) {
      console.warn('baunitId no proporcionado. No se pueden cargar las alertas.');
      return;
    }

    this.alertsService.getAlertsByBaunitId(this.baunitId).subscribe(
      (alerts) => {
        this.alerts = alerts;
        this.dataSource.data = this.alerts;
        // console.log('Alertas cargadas:', this.alerts);
      },
      (error) => {
        console.error('Error al obtener alertas:', error);
      }
    );
  }


  openAlertDetails(alert: any): void {
    const dialogRef = this.matDialog.open(DetailAlertsComponent, {
      ...MODAL_SMALL,
      disableClose: true,
      data: alert,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal cerrado con resultado:', result);
      }
    });
  }


  /**
   * On refresh paginator
   *
   * @param pageEvent
   */
  refreshPaginator(pageEvent: PageEvent): void {
    const { pageIndex, pageSize } = pageEvent || {};
    this.page = pageIndex ?? PAGE;
    this.pageSize = pageSize ?? PAGE_SIZE;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  individualInfo(column: TableColumn<InfoOwnerRowT>): boolean {
    return column.label === 'Tipo' || column.label === 'Estado';
  }

}
