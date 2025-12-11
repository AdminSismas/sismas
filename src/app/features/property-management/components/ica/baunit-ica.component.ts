import {
  Component,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { HeaderCadastralInformationPropertyComponent } from '@features/property-management/components/shared/header-cadastral-information/header-cadastral-information-property.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  ICA_MENU_ITEMS,
  TABLE_ICA_COLUMNS
} from '@features/property-management/constants/ica/baunit-ica.constant';
import { BaunitIcaService } from '@features/property-management/services/ica/baunit-ica.service';
import {
  IcaDialogData,
  IcaTable
} from '@features/property-management/models/ica';
import { map } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IcaResponse } from '@shared/interfaces';
import { MODAL_MEDIUM, MODAL_SMALL, NAME_NO_DISPONIBLE } from '@shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { IcaDetailsComponent } from '@features/property-management/components/ica/ica-details/ica-details.component';
import { MatMenuModule } from '@angular/material/menu';
import { IcaPhotosComponent } from './ica-photos/ica-photos.component';
import { IcaEditComponent } from './ica-edit/ica-edit.component';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
// import { EXAMPLE_TEST_ICA_CREATE } from '@features/property-management/constants/ica/ica-edit.constant';

@Component({
  selector: 'baunit-ica',
  standalone: true,
  imports: [
    HeaderCadastralInformationPropertyComponent,
    MatAccordion,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinner,
    MatTableModule,
    MatMenuModule
  ],
  templateUrl: './baunit-ica.component.html'
})
export class BaunitIcaComponent {
  /* ---- Injects ---- */
  private readonly baunitIcaService = inject(BaunitIcaService);
  private readonly dialog = inject(MatDialog);

  /* ---- Properties ---- */
  public readonly columns = TABLE_ICA_COLUMNS;

  /*--- Inputs ---- */
  public readonly typeInformation = input.required<string>();
  public readonly expandedComponent = input.required<boolean>();
  public readonly baunitId = input.required<string>();
  public readonly cadastralNumber = input.required<string>();

  /* ---- Outputs ---- */
  public readonly emitExpandedComponent = output<number>();

  /* ---- Computed ---- */
  displayedColumns = computed<string[]>(() =>
    this.columns
      .filter((column) => column.visible)
      .map((column) => column.property)
  );

  /* ---- Signals ---- */
  icaTableList = signal<MatTableDataSource<IcaTable>>(
    new MatTableDataSource<IcaTable>([])
  );
  isLoading = signal<boolean>(false);

  /*--- Methods ---- */
  private getBaunitIcaList(): void {
    this.isLoading.set(true);
    this.baunitIcaService
      .getBaunitIcaList(this.baunitId())
      .pipe(map(this.formatBaunitIcaList))
      .subscribe((icaTableList) => this.captureSubscribe(icaTableList));
  }

  private formatBaunitIcaList(
    icaResponseList: IcaResponse[]
  ): MatTableDataSource<IcaTable> {
    const icaTableList = IcaTable.mapToIcaTableList(icaResponseList);
    const icaTableDataSource = new MatTableDataSource<IcaTable>(icaTableList);

    return icaTableDataSource;
  }

  private captureSubscribe(icaTableList: MatTableDataSource<IcaTable>): void {
    this.icaTableList.set(icaTableList);
    this.isLoading.set(false);
  }

  public isExpandPanel(): void {
    this.emitExpandedComponent.emit(14);
    this.getBaunitIcaList();
  }

  public icaDetails(icaId: number): void {
    this.baunitIcaService.getBaunitIcaDetail(icaId).subscribe((icaDetails) => {
      this.dialog.open(IcaDetailsComponent, {
        ...MODAL_MEDIUM,
        data: icaDetails
      });
    });
  }

  private icaPhotos(ica: IcaTable): void {
    const data: IcaDialogData = {
      ica,
      baunitId: this.baunitId(),
      edition: this.typeInformation() === 'edition'
    };

    this.dialog.open(IcaPhotosComponent, {
      ...MODAL_SMALL,
      data: data
    });
  }

  public createIca(): void {
    this.dialog
      .open(IcaEditComponent, {
        ...MODAL_MEDIUM,
        // data: EXAMPLE_TEST_ICA_CREATE
      })
      .afterClosed()
      .subscribe((result: { response: boolean; data: IcaResponse }) => {
        this.actionEditIcaModel(result);
      });
  }

  public menuAction(optionId: string, ica: IcaTable): void {
    switch (optionId) {
      case '0':
        this.editIca(ica);
        break;
      case '1':
        this.icaDetails(ica.prIcaId);
        break;
      case '2':
        this.icaPhotos(ica);
        break;
      case '3':
        this.deleteIca(ica);
        break;
    }
  }

  public editIca(ica: IcaTable): void {
    this.baunitIcaService
      .getBaunitIcaDetail(ica.prIcaId)
      .subscribe((icaDetails) => {
        this.dialog
          .open(IcaEditComponent, {
            ...MODAL_MEDIUM,
            data: icaDetails
          })
          .afterClosed()
          .subscribe((result: { response: boolean; data: IcaResponse }) => {
            this.actionEditIcaModel(result);
          });
      });
  }

  private actionEditIcaModel(result: {
    response: boolean;
    data: IcaResponse;
  }): void {
    if (result.response) {
      if (result.data.prIcaId === -1) {
        this.createBaunitIca(result.data);
      } else {
        this.updateBaunitIca(result.data);
      }
    }
  }

  private createBaunitIca(ica: Partial<IcaResponse>): void {
    if (this.typeInformation() !== 'edition')
      throw new Error('No se puede crear información en modo consulta');

    const icaBody: Partial<IcaResponse> = this.createBaunitIcaBody(ica);

    this.baunitIcaService.createBaunitIca(icaBody).subscribe(() => {
      this.successAlertNotification(
        'Se ha creado el registro ICA correctamente'
      );
      this.getBaunitIcaList();
    });
  }

  private createBaunitIcaBody(ica: Partial<IcaResponse>): Partial<IcaResponse> {
    const npnFormat = this.createNpnFormat();

    const icaBody: Partial<IcaResponse> = {
      ...ica,
      baunitId: this.baunitId(),
      cadastralNumber: this.cadastralNumber(),
      npnFormat
    };

    delete icaBody.prIcaId;

    return icaBody;
  }

  private createNpnFormat(): string {
    const npnFormatSections = [
      { start: 0, length: 2 }, // DEPTO
      { start: 2, length: 3 }, // MPIO
      { start: 5, length: 2 }, // ZONA
      { start: 7, length: 2 }, // SECTOR
      { start: 9, length: 2 }, // COMUNA
      { start: 11, length: 2 },  // BARRIO
      { start: 13, length: 4 },  // MANZ_VEREDA
      { start: 17, length: 4 },  // TERRENO
      { start: 21, length: 1 },  // CONDICION
      { start: 22, length: 2 },  // EDIFICIO
      { start: 24, length: 2 },  // PISO
      { start: 26, length: 4 } // UNIDAD
    ];
    const npnFormat: string[] = npnFormatSections.map((section) => {
      const { start, length } = section;
      return this.cadastralNumber().slice(start, start + length);
    });

    return npnFormat.join('-');
  }

  private updateBaunitIca(ica: IcaResponse): void {
    if (this.typeInformation() !== 'edition')
      throw new Error('No se puede editar información en modo consulta');

    this.baunitIcaService.updateBaunitIca(ica.prIcaId, ica).subscribe(() => {
      this.successAlertNotification(
        'Se ha actualizado el registro ICA correctamente'
      );
      this.getBaunitIcaList();
    });
  }

  private deleteIca(ica: IcaTable): void {
    if (this.typeInformation() !== 'edition')
      throw new Error('No se puede eliminar información en modo consulta');

    this.deleteConfirmationAlert(ica.nombreEstablecimiento!).then((result) => {
      if (result.isConfirmed) {
        this.baunitIcaService.deleteBaunitIca(ica.prIcaId).subscribe(() => {
          this.successAlertNotification(
            'Se ha eliminado el registro ICA correctamente'
          );
          this.getBaunitIcaList();
        });
      }
    });
  }

  private deleteConfirmationAlert(icaName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      text: `¿Está seguro de eliminar el registro ICA con nombre ${icaName}?`,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      showCancelButton: true
    });
  }

  private successAlertNotification(message: string): void {
    Swal.fire({
      text: message,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      timer: 15000
    });
  }

  /* ---- Getters ---- */
  public get NoData(): string {
    return NAME_NO_DISPONIBLE;
  }

  public get menuItems() {
    if (this.typeInformation() === 'edition') {
      return ICA_MENU_ITEMS;
    }
    return ICA_MENU_ITEMS.filter((menuItem) => {
      switch (menuItem.id) {
        case '0':
          return false;
        case '3':
          return false;
        default:
          return true;
      }
    });
  }
}
