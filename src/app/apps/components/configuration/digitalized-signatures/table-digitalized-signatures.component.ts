// Angular framework
import { Component, computed, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// Vex

// Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// Custom
import { DATA_SOURCE_DIGITALIZED_SIGNATURES, DIGITALIZED_SIGNATURES_COLUMNS, DIGITALIZED_SIGNATURES_DISPLAY_COLUMNS } from 'src/app/apps/constants/digitalized-signatures.constants';
import { DigitalizedSignaturesData } from 'src/app/apps/interfaces/digitalized-signatures';

@Component({
  selector: 'table-digitalized-signatures',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    // Custom
  ],
  templateUrl: './table-digitalized-signatures.component.html',
  styles: ``
})
export class TableDigitalizedSignaturesComponent implements OnInit {

  public dataSource: MatTableDataSource<DigitalizedSignaturesData> = new MatTableDataSource<DigitalizedSignaturesData>(DATA_SOURCE_DIGITALIZED_SIGNATURES);
  public columns : { name: string, title: string }[] = DIGITALIZED_SIGNATURES_COLUMNS
  public displayColumns: string[] = DIGITALIZED_SIGNATURES_DISPLAY_COLUMNS;

  public actionsBtn = computed(() =>{
    return [
      {
        icon: 'mat:edit',
        label: 'Editar',
        action: (row: DigitalizedSignaturesData) => {
          console.log('Editar', row)
        }
      },
      {
        icon: 'mat:visibility',
        label: 'Ver Detalles',
        action: (row: DigitalizedSignaturesData) => {
          console.log('Ver Detalles', row)
        }
      }
    ]
  })

  constructor () {}

  ngOnInit(): void {
    // this.dataSource.data = DATA_SOURCE_DIGITALIZED_SIGNATURES;
    console.log(this.dataSource)
  }
}
