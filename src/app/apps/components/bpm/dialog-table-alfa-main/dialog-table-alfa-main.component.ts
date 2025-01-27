// Angular Framework
import { Component, forwardRef, Inject, OnInit } from '@angular/core';
// Vex
// Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { AlfaMainService } from 'src/app/apps/services/bpm/core/alfa-main.service';
import { PageSearchData } from 'src/app/apps/interfaces/page-search-data.model';
import {
  MAX_PAGE_SIZE_TABLE_UNIQUE,
  PAGE
} from 'src/app/apps/constants/constant';
import { AlfaMainComponent } from 'src/app/pages/pages/bpm/core/cadastral/alf/main/alfa-main.component';
// Custom

@Component({
  selector: 'vex-dialog-table-alfa-main',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    // Custom
    forwardRef(() => AlfaMainComponent)
  ],
  templateUrl: './dialog-table-alfa-main.component.html',
  styles: ``
})
export class DialogTableAlfaMainComponent implements OnInit {
  public dataSource: InformationPegeable = new InformationPegeable();
  public PAGE = PAGE;
  public MAX_PAGE_SIZE_TABLE_UNIQUE = MAX_PAGE_SIZE_TABLE_UNIQUE;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { executionId: string; baunitIdE: string },
    private alfaMainService: AlfaMainService
  ) {}

  ngOnInit(): void {
    this.getDataSource();
    console.log(this.data);
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(
      this.PAGE,
      this.MAX_PAGE_SIZE_TABLE_UNIQUE,
      this.data.executionId
    );
  }

  getDataSource() {
    const { executionId, baunitIdE } = this.data;
    this.alfaMainService.getListAlfaMainOperationsUnitsByBaunitId(
      this.generateObjectPageSearchData(),
      executionId,
      baunitIdE
    ).subscribe({
      next: (result: InformationPegeable) => {
        this.dataSource = result;
      }
    });
  };
}
