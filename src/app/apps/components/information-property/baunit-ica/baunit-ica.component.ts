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
import { HeaderCadastralInformationPropertyComponent } from 'src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TABLE_ICA_COLUMNS } from 'src/app/apps/components/information-property/baunit-ica/baunit-ica.constant';
import { BaunitIcaService } from '@shared/services';
import { IcaTable } from 'src/app/apps/components/information-property/baunit-ica/interfaces/ica-table';
import { map } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IcaResponse } from 'src/app/apps/components/information-property/baunit-ica/interfaces/ica-details';
import { MODAL_SMALL, NAME_NO_DISPONIBLE } from '@shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { IcaDetailsComponent } from 'src/app/apps/components/information-property/baunit-ica/components/ica-details/ica-details.component';

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
    MatTableModule
  ],
  templateUrl: './baunit-ica.component.html',
})
export class BaunitIcaComponent {
  /* ---- Injects ---- */
  private readonly baunitIcaService = inject(BaunitIcaService);
  private readonly dialog = inject(MatDialog);

  /* ---- Properties ---- */
  public readonly columns = TABLE_ICA_COLUMNS;

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

  public viewIcaDetails(icaId: number): void {
    this.baunitIcaService.getBaunitIcaDetail(icaId).subscribe((icaDetails) => {
      this.dialog.open(IcaDetailsComponent, {
        ...MODAL_SMALL,
        data: icaDetails
      });
    });
  }

  public get NoData(): string {
    return NAME_NO_DISPONIBLE;
  }
}
