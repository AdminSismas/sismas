import { Component, computed, Input, OnInit, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
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
import { CreateAdministrativeSourceComponent } from './create-administrative-source/create-administrative-source.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COLUMNS_ADMINISTRATIVE_SOURCES } from 'src/app/apps/constants/administrative-source.constants';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { NgClass } from '@angular/common';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

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
  styleUrl: './administrative-sources.component.scss'
})
export class AdministrativeSourcesComponent implements OnInit {
  @Input() public id = '';
  @Input() public expandedComponent = false;
  @Input() public baunitId?: string | null;
  @Input() public schema?: string;
  @Input() public executionId?: string | null;
  @Input() public typeInformation?: string;
  @Input() public editable? = true;

  @ViewChild('confirmDeleteDialog', { static: true })
  confirmDeleteDialog!: SwalComponent;
  public selectedFuente?: AdministrativeSource;
  public dataSource: MatTableDataSource<AdministrativeSource> =
    new MatTableDataSource<AdministrativeSource>([]);
  public columns: TableColumn<AdministrativeSource>[] =
    COLUMNS_ADMINISTRATIVE_SOURCES;
  public displayedColumns: string[] = [];
  public actionBtns = computed(() => {
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

  constructor(
    private administrativeSourcesService: AdministrativeSourcesService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((column) => column.property);
    if (this.typeInformation !== 'edition' || !this.editable ) {
      this.displayedColumns = this.displayedColumns.filter(
        (column) => column !== 'actions'
      );
    }
  }

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
    }
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.getDataSource();
    }
  }

  createAdministrativeSource(): void {
    this.dialog
      .open(CreateAdministrativeSourceComponent, {
        width: '100%',
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
          this.snackbar.open('Fuente administrativa eliminada', 'CLOSE', {
            duration: 10000
          });
          this.getDataSource();
        },
        error: () => {
          this.snackbar.open(
            'Error al eliminar la fuente administrativa',
            'CLOSE',
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
          fuenteAdminId: row.fuenteAdminId,
        }
      };

      this.dialog
        .open(CreateAdministrativeSourceComponent, {
          width: '100%',
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
