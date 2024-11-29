import { Component, computed, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from "../header-cadastral-information-property/header-cadastral-information-property.component";
import { AdministrativeSource, CreateAdministrativeSource, CreateAdministrativeSourceParams, DeleteAdministrativeSourceParams, UpdateAdministrativeSource } from 'src/app/apps/interfaces/information-property/administrative-source';
import { MatTableModule } from '@angular/material/table';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateAdministrativeSourceComponent } from './create-administrative-source/create-administrative-source.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-administrative-sources',
  standalone: true,
  imports: [
    MatExpansionModule,
    HeaderCadastralInformationPropertyComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './administrative-sources.component.html',
  styleUrl: './administrative-sources.component.scss'
})
export class AdministrativeSourcesComponent implements OnInit {
  @Input() public id: string = '';
  @Input() public expandedComponent: boolean = false;
  @Input() public baunitId?: string | null;
  @Input() public schema?: string;
  @Input() public executionId?: string | null;
  @Input() public typeInformation?: string;

  @ViewChild('confirmDeleteDialog', { static: true }) confirmDeleteDialog!: TemplateRef<any>;
  public selectedFuente?: AdministrativeSource;

  public displayedColumns: string[] = [
    'domFuenteAdministrativaTipo',
    'fechaDocumentoFuente',
    'numeroFuente',
    'enteEmisor',
    'actions'
  ];

  public dataSource: AdministrativeSource[] = [];

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
    ]
  })

  constructor(
    private administrativeSourcesService: AdministrativeSourcesService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.typeInformation !== 'edition') {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'actions')
    }
  }

  getDataSource() {

    if (this.schema === 'temp') {
      this.administrativeSourcesService.getAdministrativeSourcesTemp(this.baunitId as string, this.executionId as string)
        .subscribe(data => {
          this.dataSource = data
        })
    }
    else if (this.schema === 'main') {
      this.administrativeSourcesService.getAdministrativeSourcesMain(this.baunitId as string)
        .subscribe(data => {
          this.dataSource = data
        })
    }
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.getDataSource();
    }
  }

  createAdministrativeSource(): void {
    this.dialog.open(CreateAdministrativeSourceComponent, {
      width: '40%',
      data: {
        executionId: this.executionId as string,
        baunitId: this.baunitId as string
      }
    })
      .afterClosed()
      .subscribe((data: AdministrativeSource) => {
        setTimeout(() => {
          this.getDataSource();
        }, 300)
      })
    const params: CreateAdministrativeSourceParams = {
      executionId: this.executionId as string,
      baunitId: this.baunitId as string,
      administrativeSource: {
        domFuenteAdministrativaTipo: '',
        fechaDocumentoFuente: '',
        numeroFuente: '',
        enteEmisor: ''
      }
    }
  }

  deleteFuenteAdministrativa(row: AdministrativeSource) {
    const params: DeleteAdministrativeSourceParams = {
      baunitId: this.baunitId as string,
      changeLogId: this.executionId as string,
      fuenteAdminId: row.fuenteAdminId as string
    }
    this.administrativeSourcesService.deleteAdministrativeSource(params)
      .subscribe({
        next: () => {
          this.snackbar.open('Fuente administrativa eliminada', 'CLOSE', { duration: 4000 })
          this.getDataSource()
        },
        error: (error: any) => {
          this.snackbar.open('Error al eliminar la fuente administrativa', 'CLOSE', { duration: 4000 })
        }
      })
  }

  onClickActionBtn(id: string, row: AdministrativeSource) {
    if (id === 'delete') {
      console.log('Eliminando fuente...')
      this.selectedFuente = row;
      this.dialog.open(this.confirmDeleteDialog, {
        width: '40%',
      }).afterClosed()
        .subscribe((result: boolean) => {
          if (result) {
            this.deleteFuenteAdministrativa(row)
          }
        })

    } else if (id === 'edit') {
      console.log('Editando fuente...')
      const params: UpdateAdministrativeSource = {
        executionId: this.executionId as string,
        baunitId: this.baunitId as string,
        params: {
          fuenteAdminId: row.fuenteAdminId,
          domFuenteAdministrativaTipo: row.domFuenteAdministrativaTipo,
          fechaDocumentoFuente: row.fechaDocumentoFuente,
          numeroFuente: row.numeroFuente,
          enteEmisor: row.enteEmisor
        }
      }

      this.dialog.open(CreateAdministrativeSourceComponent, {
        width: '40%',
        data: params
      })
        .afterClosed()
        .subscribe(() => {
          setTimeout(() => {
            this.getDataSource()
          }, 300)
        })
    }
  }
}
