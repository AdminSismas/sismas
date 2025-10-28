import { NgClass } from '@angular/common';
import { Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { ContentInformationConstruction } from 'src/app/apps/interfaces/information-property/content-information-construction';
import { DetailInformationConstructionsPropertyComponent } from 'src/app/apps/components/information-property/information-constructions-property/detail-information-constructions-property/detail-information-constructions-property.component';
import { MODAL_SMALL } from '@shared/constants';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger80ms, stagger40ms } from '@vex/animations/stagger.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-table-constructions',
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  standalone: true,
  imports: [MatTableModule, MatIconModule, NgClass, MatMenuModule, MatCheckboxModule],
  templateUrl: './table-constructions.component.html'
})
export class TableConstructionsComponent implements OnInit, OnDestroy {
  // INJECTS
  dialog = inject(MatDialog);

  // INPUTS
  dataSource =
    input.required<MatTableDataSource<ContentInformationConstruction>>();
  columns = input.required<TableColumn<ContentInformationConstruction>[]>();
  baunitId = input.required<string | null | undefined>();
  schema = input.required<string | null | undefined>();
  executionId = input.required<string | null | undefined>();
  selectable = input<boolean>();
  multipleSelection = input<boolean>(false);

  // OUTPUTS
  copyInformationOutput = output<ContentInformationConstruction>();
  editInformationOutput = output<ContentInformationConstruction>();
  deleteInformationOutput = output<ContentInformationConstruction>();
  constructionsSelected = output<ContentInformationConstruction[]>();

  // COMPUTED
  visibleColumns = computed(() => {
    const visibleColumns = this.columns()
      .filter((column) => column.visible)
      .map((column) => column.property);

    if (this.selectable()) visibleColumns.unshift('select');

    return visibleColumns;
  });

  // PROPERTIES
  selection: SelectionModel<ContentInformationConstruction> | null = null;

  ngOnInit() {
    // Initialize selection model if selectable is true
    if (this.selectable()) {
      this.selection = new SelectionModel<ContentInformationConstruction>(this.multipleSelection(), []);
      this.selection.changed.subscribe((selection) => {
        this.constructionsSelected.emit(selection.source.selected);
      });
    }
  }

  ngOnDestroy(): void {
    if (!this.selectable() || !this.selection) return;

    if (this.selectable()){
      this.selection.changed.unsubscribe();
    }
  }

  openDetailInformationConstructionsProperty(
    content: ContentInformationConstruction
  ) {
    const data: ContentInformationConstruction =
      new ContentInformationConstruction(
        content,
        this.schema(),
        this.baunitId()
      );
    data.executionId = this.executionId();

    this.dialog
      .open(DetailInformationConstructionsPropertyComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: { type: 'READ_ONLY', contentInformation: data }
      })
      .afterClosed();
  }

  copyInformation(customer: ContentInformationConstruction) {
    this.copyInformationOutput.emit(customer);
  }
  editInformation(customer: ContentInformationConstruction) {
    this.editInformationOutput.emit(customer);
  }
  deleteInformation(customer: ContentInformationConstruction) {
    this.deleteInformationOutput.emit(customer);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (!this.selectable() || !this.selection) return;

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource().data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (!this.selectable() || !this.selection) return;

    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource().data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ContentInformationConstruction): string {
    if (!this.selectable() || !this.selection) return '';

    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }


}
