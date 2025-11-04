// Angular framework
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, input } from '@angular/core';

// Material
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// Custom
import {
  GEOECONOMICA_COLUMNS,
  NO_DETAILS_DATA
} from '../../../../constants/economic-mod-land/zone-constants';
import { GeoEconomicZoneDetails } from '@features/economic-zones/models';
import { GeoeconomicZoneService } from '@features/economic-zones/services/geoeconomic-zone.service';
import { GeoEconomicZone } from '@shared/interfaces';

@Component({
  selector: 'economic-zone',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ],
  imports: [
    CommonModule,
    /* Material */
    MatDividerModule,
    MatTableModule,
    MatIconModule
    /* Vex */
    /* Custom */
  ],
  templateUrl: './economic-zone.component.html',
  styles: ``
})
export class EconomicZoneComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly dataSource = input.required<MatTableDataSource<any>>();

  public columns: { name: string; title: string }[] = GEOECONOMICA_COLUMNS;
  public displayColumns: string[] = [];
  public columnsToDisplayWithExpand: string[] = [];
  public expandedElement?: GeoEconomicZone | null;
  public NO_DETAILS_DATA: string = NO_DETAILS_DATA;

  private geoEconomicZoneService = inject(GeoeconomicZoneService);

  ngOnInit(): void {
    this.displayColumns = this.columns.map((column) => column.name);
    this.columnsToDisplayWithExpand = [...this.displayColumns, 'expand'];
  }

  expandRow(row: GeoEconomicZone): void {
    if (this.expandedElement === row) {
      this.expandedElement = null;
      return;
    }

    this.expandedElement = row;

    this.geoEconomicZoneService
      .getValues(row.zonaHomoGeoEconomicaId!)
      .subscribe({
        next: (values: GeoEconomicZoneDetails) => {
          const index: number = this.dataSource().data.indexOf(row);
          const dataSource = this.dataSource();
          dataSource.data[index].details = values;
          dataSource.data = [...dataSource.data];
        },
        error: (error) => {
          console.error('Error al cargar los detalles:', error);
          this.expandedElement = null;
        }
      });
  }
}
