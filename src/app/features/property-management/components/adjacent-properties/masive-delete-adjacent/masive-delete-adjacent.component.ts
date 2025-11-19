import { Component, computed, inject, signal } from '@angular/core';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { InformationAdjacent } from '@features/property-management/models/information-adjacent';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL } from '@shared/constants/constants';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import Swal from 'sweetalert2';

interface MasiveDeleteData {
  data: InformationAdjacent[];
}

@Component({
  selector: 'vex-masive-delete-adjacent',
  standalone: true,
  imports: [ModalWindowComponent, MatTableModule, MatCheckboxModule],
  templateUrl: './masive-delete-adjacent.component.html'
})
export class MasiveDeleteAdjacentComponent {
  // Properties
  orderColumn: TableColumn<InformationAdjacent> = {
    label: 'Orden',
    property: 'order',
    type: 'text',
    visible: true,
  };
  columns = [ this.orderColumn, ...TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL];

  // Injects
  data: MasiveDeleteData = inject(MAT_DIALOG_DATA);
  dialogRef = inject<MatDialogRef<MasiveDeleteAdjacentComponent>>(MatDialogRef);

  // Signals
  dataSource = signal<MatTableDataSource<InformationAdjacent>>(
    new MatTableDataSource(this.data.data)
  );

  // Computed
  visibleColumns = computed(() => {
    const visibleColumns = this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);

    return ['select', ...visibleColumns];
  });

  // Selection model for checkboxes
  selection = new SelectionModel<InformationAdjacent>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource().data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource().data);
  }

  checkboxLabel(row?: InformationAdjacent): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  masiveDeleteAdjacents(): void {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de proceder con la eliminación de los colindantes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close({ result: true, data: this.selection.selected });
        return;
      }
    });
  }
}
