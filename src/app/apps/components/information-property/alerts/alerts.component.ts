import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  input,
  output
} from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from 'src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { MatCardModule } from '@angular/material/card';
import {
  MODAL_SMALL,
  MODAL_SMALL_XS
} from '@shared/constants';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { AlertsService } from '@shared/services';
import { InfoOwners } from '@shared/interfaces';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { TypeInformation } from '@shared/interfaces';
import { DetailAlertsComponent } from './detail-alerts/detail-alerts.component';
import { DatePipe } from '@angular/common';
import { CreateAlertComponent } from './create-alert/create-alert.component';
import { AlertResponse } from 'src/app/apps/interfaces/information-property/alerts.interface';
import Swal from 'sweetalert2';
import { ALERT_TABLE_COLUMNS } from 'src/app/apps/constants/information-property/alerts.constants';
import { UpdateAlertComponent } from './update-alert/update-alert.component';

export type InfoOwnerRowT = Pick<
  InfoOwners,
  'rightId' | 'beginAt' | 'endsIn' | 'fractionS' | 'domRightType'
> &
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
    DatePipe,
    HeaderCadastralInformationPropertyComponent,
    MatCardModule,
    MatRippleModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent implements OnInit {
  // Injecting dependencies
  private alertsService = inject(AlertsService);
  private matDialog = inject(MatDialog);

  // Defining inputs
  expandedComponent = input.required<boolean>();
  schema = input.required<string>();
  typeInformation = input.required<TypeInformation>();
  baunitId = input<string | null>(null);
  executionId = input<string | null>(null);
  editable = input<boolean>(true);

  // Defining outputs
  emitExpandedComponent = output<number>();

  // Defining signals
  alerts = signal<AlertResponse[]>([]);
  columns = signal(ALERT_TABLE_COLUMNS);
  dataSource = signal<MatTableDataSource<AlertResponse>>(
    new MatTableDataSource<AlertResponse>([])
  );

  // Defining computed properties
  textColumns = computed(() =>
    this.columns().filter((column) => column.type === 'text')
  );
  visibleColumns = computed(() => {
    return ALERT_TABLE_COLUMNS.filter((column) => column.visible).map(
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
      // {
      //   id: 'delete',
      //   label: 'Eliminar',
      //   icon: 'mat:delete'
      // }
    ];
  });

  ngOnInit(): void {
    ALERT_TABLE_COLUMNS.at(-1)!.visible =
      this.typeInformation() === 'edition' && this.editable();
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(13);
    this.loadAlertsByBaunitId();
  }

  loadAlertsByBaunitId(): void {
    if (!this.baunitId()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha encontrado el número de ficha del predio',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        showCancelButton: false
      });
      return;
    }

    this.alertsService.getAlertsByBaunitId(this.baunitId()!).subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
        this.dataSource().data = this.alerts();
      }
    });
  }

  openAlertDetails(alert: AlertResponse): void {
    this.matDialog.open(DetailAlertsComponent, {
      ...MODAL_SMALL,
      disableClose: true,
      data: alert
    });
  }

  individualInfo(column: TableColumn<InfoOwnerRowT>): boolean {
    return column.label === 'Tipo' || column.label === 'Estado';
  }

  openCreateAlert() {
    this.matDialog
      .open(CreateAlertComponent, {
        ...MODAL_SMALL_XS
      })
      .afterClosed()
      .subscribe(
        (result: { response: boolean; data?: Partial<AlertResponse> }) => {
          if (
            result.response &&
            result.data &&
            this.baunitId() &&
            this.executionId()
          ) {
            this.createAlert(result.data!);
          }
        }
      );
  }

  createAlert(alert: Partial<AlertResponse>): void {
    this.alertsService
      .createAlertByBaunitId(this.baunitId()!, this.executionId()!, alert)
      .subscribe(() => {
        this.alertsService.reloadTableSet(true);
        this.loadAlertsByBaunitId();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Alerta creada correctamente',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          showCancelButton: false
        });
      });
  }

  actionButtonsFunction(id: string, alert: AlertResponse): void {
    switch (id) {
      case 'edit':
        this.editAlert(alert);
        break;
      case 'delete':
        console.log('Delete');
        break;
      default:
        break;
    }
  }

  editAlert(alert: AlertResponse): void {
    this.matDialog.open(UpdateAlertComponent, {
      ...MODAL_SMALL,
      data: {
        alert,
        baunitId: this.baunitId(),
        executionId: this.executionId()
      }
    }).afterClosed()
      .subscribe((result: { response: boolean, data?: Partial<AlertResponse> }) => {
        if (result.response && result.data && this.baunitId() && this.executionId()) {
          const newAlert = {...alert, ...result.data };
          this.updateAlert(alert.alertBaunitId, newAlert);
        }
      });
  }

  updateAlert(alertBaunitId: string, alert: AlertResponse): void {
    this.alertsService.updateAlertByBaunitId(
      this.baunitId()!,
      this.executionId()!,
      alertBaunitId,
      alert
    ).subscribe(() => {
      this.alertsService.reloadTableSet(true);
      this.loadAlertsByBaunitId();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Alerta actualizada correctamente',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        showCancelButton: false
      });
    });
  }
}
