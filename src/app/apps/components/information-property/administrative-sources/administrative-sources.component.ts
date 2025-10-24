import {
  Component,
  computed,
  forwardRef,
  input,
  Input,
  output,
  ViewChild
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from '@shared/components';
import {
  AdministrativeSource,
  DeleteAdministrativeSourceParams,
  UpdateAdministrativeSource
} from 'src/app/apps/interfaces/information-property/administrative-source';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateAdministrativeSourceComponent } from '@shared/components';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COLUMNS_ADMINISTRATIVE_SOURCES } from '../../../constants/information-property/administrative-source.constants';
import { MODAL_MEDIUM } from '@shared/constants';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { NgClass } from '@angular/common';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'vex-administrative-sources',
  standalone: true,
  imports: [
    NgClass,
    MatExpansionModule,
    HeaderCadastralInformationPropertyComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    SweetAlert2Module
  ],
  templateUrl: './administrative-sources.component.html',
  styleUrl: './administrative-sources.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdministrativeSourcesComponent),
      multi: true
    }
  ]
})
export class AdministrativeSourcesComponent {
  // Input zone.js
  @Input() baunitId?: string | null;
  @Input() schema?: string;
  @Input() executionId?: string | null;
  @Input() typeInformation?: string;
  @Input() editable? = false;

  // Input signal
  expandedComponent = input.required<boolean>();

  // Output signal
  emitExpandedComponent = output<number>();

  @ViewChild('confirmDeleteDialog', { static: true })
  confirmDeleteDialog!: SwalComponent;
  selectedFuente?: AdministrativeSource;
  dataSource: MatTableDataSource<AdministrativeSource> =
    new MatTableDataSource<AdministrativeSource>([]);
  columns: TableColumn<AdministrativeSource>[] = COLUMNS_ADMINISTRATIVE_SOURCES;
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

  // Computed
  displayedColumns = computed(() => {
    return this.columns
      .filter((column) => {
        if (!this.editable){
          return column.visible && column.property !== 'actions' ? true : false;
        }
        return column.visible;
      })
      .map((column) => column.property);
  });

  constructor(
    private administrativeSourcesService: AdministrativeSourcesService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  getDataSource() {
    if (this.schema === 'temp') {
      this.administrativeSourcesService
        .getAdministrativeSourcesTemp(
          this.baunitId as string,
          this.executionId as string
        )
        .subscribe((data) => {
          this.dataSource.data = data;
        });
    } else if (this.schema === 'main') {
      this.administrativeSourcesService
        .getAdministrativeSourcesMain(this.baunitId as string)
        .subscribe((data) => {
          this.dataSource.data = data;
        });
    } else if (this.schema === 'hist') {
      this.administrativeSourcesService
        .getAdministrativeSourcesHist(
          this.baunitId as string,
          this.executionId as string
        )
        .subscribe((data) => {
          this.dataSource.data = data;
        });
    }
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(2);
    this.getDataSource();
  }

  createAdministrativeSource(): void {
    this.dialog
      .open(CreateAdministrativeSourceComponent, {
        ...MODAL_MEDIUM,
        data: {
          executionId: this.executionId as string,
          baunitId: this.baunitId as string
        }
      })
      .afterClosed()
      .subscribe(() => {
        setTimeout(() => {
          this.getDataSource();
        }, 300);
      });
  }

  deleteFuenteAdministrativa(row: AdministrativeSource) {
    const params: DeleteAdministrativeSourceParams = {
      baunitId: this.baunitId!,
      changeLogId: this.executionId!,
      fuenteAdminId: row.fuenteAdminId!
    };
    this.administrativeSourcesService
      .deleteAdministrativeSource(params)
      .subscribe({
        next: () => {
          this.snackbar.open('Fuente administrativa eliminada', 'CERRAR', {
            duration: 10000
          });
          this.getDataSource();
        },
        error: () => {
          this.snackbar.open(
            'Error al eliminar la fuente administrativa',
            'CERRAR',
            { duration: 10000 }
          );
        }
      });
  }

  onClickActionBtn(id: string, row: AdministrativeSource) {
    if (id === 'delete') {
      this.selectedFuente = row;
      this.confirmDeleteDialog.fire().then((result) => {
        if (result.isConfirmed) {
          this.deleteFuenteAdministrativa(row);
        }
      });
    } else if (id === 'edit') {
      const params: UpdateAdministrativeSource = {
        executionId: this.executionId as string,
        baunitId: this.baunitId as string,
        params: {
          domFuenteAdministrativaTipo: row.domFuenteAdministrativaTipo,
          fechaDocumentoFuente: row.fechaDocumentoFuente,
          numeroFuente: row.numeroFuente,
          domEnteEmisor: row.domEnteEmisor,
          oficinaOrigen: row.oficinaOrigen,
          departamentoOrigen: row.departamentoOrigen!,
          ciudadOrigen: row.ciudadOrigen,
          fuenteAdminId: row.fuenteAdminId
        }
      };

      this.dialog
        .open(CreateAdministrativeSourceComponent, {
          ...MODAL_MEDIUM,
          data: params
        })
        .afterClosed()
        .subscribe(() => {
          setTimeout(() => {
            this.getDataSource();
          }, 300);
        });
    }
  }
}
