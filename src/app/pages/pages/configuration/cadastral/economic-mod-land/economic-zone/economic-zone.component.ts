import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GEOECONOMICA_COLUMNS } from '../zone-constants';
import { GeoEconomicZoneDetails } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  public expandedElement?: GeoEconomicZoneDetails | null;

  constructor() { }

  ngOnInit(): void {
    this.displayColumns = this.columns.map((column) => column.name);
    this.columnsToDisplayWithExpand = [...this.displayColumns, 'expand']
  }

  expandRow(row: any): void {
    if (this.expandedElement === row) {
      console.log('Colapsando')
      this.expandedElement = null;
    } else {
      console.log('Expandiendo')
      this.expandedElement = row;
    }

  }

}
