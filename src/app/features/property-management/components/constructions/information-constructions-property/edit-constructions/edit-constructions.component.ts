import { Component, inject, signal } from '@angular/core';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentInformationConstruction } from 'src/app/apps/interfaces/information-property/content-information-construction';
import { TableConstructionsComponent } from '@features/property-management/components/constructions/information-constructions-property/table-constructions/table-constructions.component';
import { TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION } from '@shared/constants';
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

  /* ---- Injects ---- */
  data = inject<EditConstructionData>(MAT_DIALOG_DATA);

  /* ---- Signals ---- */
  constructionsSelected = signal<ContentInformationConstruction[]>([]);
  editConstructionDialog = signal<MatDialogRef<ModalWindowComponent> | null>(null);

  /* ---- Methods ---- */
  onAccept(): void {
    this.editConstructionDialog()?.close({
      response: true,
      data: this.constructionsSelected()
    });
  }

}
