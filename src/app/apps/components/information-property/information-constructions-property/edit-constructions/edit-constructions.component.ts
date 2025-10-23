import { Component, inject, signal } from '@angular/core';
import { ModalWindowComponent } from '@shared/components';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentInformationConstruction } from 'src/app/apps/interfaces/information-property/content-information-construction';
import { TableConstructionsComponent } from '@shared/components';
import { TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION } from 'src/app/apps/constants/general/constants';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';

interface EditConstructionData {
  dataSource: MatTableDataSource<ContentInformationConstruction>;
  baunitId: string | null | undefined;
  executionId: string | null | undefined;
}

@Component({
  selector: 'vex-edit-constructions',
  standalone: true,
  imports: [
    ModalWindowComponent,
    MatProgressSpinnerModule,
    TableConstructionsComponent
  ],
  templateUrl: './edit-constructions.component.html'
})
export class EditConstructionsComponent {
  protected readonly title = 'Administrar construcciones';
  protected readonly dialogActions = true;
  protected readonly showCancelButton = true;
  protected readonly columns: TableColumn<ContentInformationConstruction>[] =
    TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION.filter((column) => {
      return column.property !== 'actions' && column.property !== 'viewDetail';
    });

  // INJECTS
  data = inject<EditConstructionData>(MAT_DIALOG_DATA);

  // SIGNALS
  constructionsSelected = signal<ContentInformationConstruction[]>([]);
  editConstructionDialog = signal<MatDialogRef<ModalWindowComponent> | null>(null);

  onAccept(): void {
    this.editConstructionDialog()?.close({
      response: true,
      data: this.constructionsSelected()
    });
  }

}
