import { Component, computed, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { getZoneParams } from '../zone-constants';
import { Zone, ZoneServices } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { CreateZoneComponent } from '../create-zone/create-zone.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { CadastralChangeLogComponent } from '../cadastral-change-log/cadastral-change-log.component';
import { CADASTRE_CHANGE_LOG_PARAMS } from '../zone-constants';
import { RefreshService } from 'src/app/apps/services/economic-mod-land/refresh-service.service';

@Component({
  selector: 'zone-manager',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    /* Material Modules */
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    /* Vex Components */
    /* Custom Components */
    // DynamicFormsComponent,
  ],
  templateUrl: './zone-manager.component.html',
  styles: ``
})
export class ZoneManagerComponent implements OnInit {

  public form: FormGroup = this.fb.group({
    department: ['', Validators.required],
    municipality: ['', Validators.required]
  })
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
  public zonesCode: string = '';

  @ViewChild('confirmDeleteDialog', { static: true }) confirmDeleteDialog!: TemplateRef<any>;
  @ViewChild('actionsMenu', { static: true }) actionsMenu!: TemplateRef<any>;

  @Input({ required: true }) public typeZone: string = 'urbanas';
  @Input({ required: true }) public service!: ZoneServices
  @Input({ required: true }) public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @Input({ required: true }) public columns: { name: string, title: string }[] = [];
  @Input({ required: true }) public displayedColumns: string[] = [];
  @Input() public divpolLv1: string = '';
  @Input() public divpolLv2: string = '';

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private refreshServices: RefreshService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map((column) => column.name);
    this.displayedColumns.push('actions')
  }

  openDialogCreateZone(): void {
    this.dialog.open(CreateZoneComponent, {
      width: '60%',
      data: {
        title: this.typeZone,
        inputs: getZoneParams(this.typeZone)
      }
    }).afterClosed()
      .subscribe({
        next: (result: any) => this.createZone(result),
        error: (error: any) => {
          this.snackbar.open(`Error al crear la zona ${this.typeZone}`, 'Cerrar', {
            duration: 4000
          })
          throw error
        }
      })
  }

  openDialogEditZone(row: any): void {
    this.dialog.open(CreateZoneComponent, {
      width: '60%',
      data: {
        title: `${this.typeZone} ${row.zonaHomoFisicaUrCode || row.zonaHomoFisicaRuCode || row.zonaHomoGeoEconomicaCode}`,
        inputs: getZoneParams(this.typeZone),
        data: row
      }
    }).afterClosed()
      .subscribe({
        next: (result: any) => this.editZone(result, row),
        error: (error: any) => {
          this.snackbar.open(`Error al crear la zona ${this.typeZone}`, 'Cerrar', {
            duration: 4000
          })
          throw error
        }
      })
  }

  createZone(result: any): void {
    if (!result) return
    const params: Zone = {
      divpolLv1: this.divpolLv1,
      divpolLv2: this.divpolLv2,
      cadastreChangeLog: {
        changeLogId: 2
      },
      ...result
    }
    this.service.createZone(params)
      .subscribe({
        next: () => {
          this.snackbar.open(`Se ha creado la zona ${this.typeZone}`, 'Cerrar', {
            duration: 4000
          })

          this.refreshServices.triggerRefresh()
        },
        error: (error: any) => {
          this.snackbar.open(`Error al crear la zona ${this.typeZone}`, 'Cerrar', {
            duration: 4000
          })
          throw error
        }
      })
  }

  onClickActionBtn(id: string, row: any) {
    if (id === 'delete') {
      console.log('Eliminando zona...')
      this.zonesCode = row.zonaHomoFisicaUrCode || row.zonaHomoFisicaRuCode || row.zonaHomoGeoEconomicaCode
      this.dialog.open(this.confirmDeleteDialog, { width: '40%' })
        .afterClosed()
        .subscribe((result: boolean) => {
          if (result) {
            this.deleteZone(row)
          }
        })

    } else if (id === 'edit') {
      console.log('Editando zona...')
      this.openDialogEditZone(row)
    }
  }

  deleteZone(row: any) {
    const id: string = row.zonaHomoFisicaUrId || row.zonaHomoFisicaRuId || row.zonaHomoGeoEconomicaId
    this.service.deleteZone('99999', id)
      .subscribe({
        next: () => {
          this.snackbar.open('Zona eliminada', 'CLOSE', { duration: 4000 })
          this.refreshServices.triggerRefresh()
        },
        error: (error: any) => {
          this.snackbar.open('Error al eliminar la zona', 'CLOSE', { duration: 4000 })
          throw error
        }
      })
  }

  editZone(result: any, row: any) {
    if (!result) return
    const params = {
      ...row,
      ...result,
    }

    this.service.updateZone(params)
      .subscribe({
        next: () => {
          this.snackbar.open('Zona actualizada', 'CLOSE', { duration: 4000 })
          this.refreshServices.triggerRefresh()
        },
        error: (error: any) => {
          this.snackbar.open('Error al actualizar la zona', 'CLOSE', { duration: 4000 })
          throw error
        }
      })
  }
}
