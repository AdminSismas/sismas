import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GEOECONOMICA_COLUMNS, NO_DETAILS_DATA } from '../../../../constants/zone-constants';
import { GeoEconomicZone, GeoEconomicZoneDetails } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { GeoeconomicZoneService } from 'src/app/apps/services/economic-mod-land/geoeconomic-zone.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'economic-zone',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [
    CommonModule,
    /* Material */
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    /* Vex */
    /* Custom */
  ],
  templateUrl: './economic-zone.component.html',
  styles: ``
})
export class EconomicZoneComponent implements OnInit {
  @Input({ required: true }) public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  public columns: { name: string, title: string }[] = GEOECONOMICA_COLUMNS
  public displayColumns: string[] = [];
  public columnsToDisplayWithExpand: string[] = [];
  public expandedElement?: GeoEconomicZone | null;
  public NO_DETAILS_DATA: string = NO_DETAILS_DATA;

  constructor(
    private geoEconomicZoneService: GeoeconomicZoneService,
  ) { }

  ngOnInit(): void {
    this.displayColumns = this.columns.map((column) => column.name);
    this.columnsToDisplayWithExpand = [...this.displayColumns, 'expand']
  }

expandRow(row: GeoEconomicZone): void {
  if (this.expandedElement === row) {
    this.expandedElement = null;
    return;
  }

  this.expandedElement = row;

  this.geoEconomicZoneService.getValues(row.zonaHomoGeoEconomicaId)
    .subscribe({
      next: (values: GeoEconomicZoneDetails) => {
        const index: number = this.dataSource.data.indexOf(row);
        this.dataSource.data[index].details = values;
        this.dataSource.data = [...this.dataSource.data];
      },
      error: (error) => {
        console.error('Error al cargar los detalles:', error);
        this.expandedElement = null;
      }
    });
  }
}
