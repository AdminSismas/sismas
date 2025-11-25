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
import { MODAL_SMALL, NAME_NO_DISPONIBLE } from '@shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { IcaDetailsComponent } from '@features/property-management/components/ica/ica-details/ica-details.component';
import { MatMenuModule } from '@angular/material/menu';
import { IcaPhotosComponent } from './ica-photos/ica-photos.component';

@Component({
  selector: 'baunit-ica',
  standalone: true,
  imports: [
    HeaderCadastralInformationPropertyComponent,
    MatAccordion,
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
  public readonly menuItems = ICA_MENU_ITEMS;

  /*--- Inputs ---- */
  public readonly expandedComponent = input.required<boolean>();
  public readonly baunitId = input.required<string>();

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
        ...MODAL_SMALL,
        data: icaDetails
      });
    });
  }

  public icaPhotos(ica: IcaTable): void {
    this.baunitIcaService
      .getBaunitIcaPhotos(
        this.baunitId(),
        ica.municipalityCode,
        ica.prIcaId.toString()
      )
      .subscribe((photos) => {
        const data: IcaDialogData = {
          ica,
          baunitId: this.baunitId(),
          photos
        };

        this.dialog.open(IcaPhotosComponent, {
          ...MODAL_SMALL,
          data: data
        });
      });
  }

  public menuAction(optionId: string, ica: IcaTable): void {
    switch (optionId) {
      case '1':
        this.icaDetails(ica.prIcaId);
        break;
      case '2':
        this.icaPhotos(ica);
        break;
    }
  }

  public get NoData(): string {
    return NAME_NO_DISPONIBLE;
  }
}
