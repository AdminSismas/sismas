import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';
import { Observable } from 'rxjs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MODAL_SMALL,
  PAGE,
  PAGE_OPTION_5_7_10,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_ADJACENT_EDITION,
  TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constant';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import {
  ContentInformationConstruction
} from '../../../interfaces/information-property/content-information-construction';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeInformation } from '../../../interfaces/general/content-info';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InformationAdjacent } from '../../../interfaces/information-property/information-adjacent';
import { getRandomInt } from 'src/app/apps/utils/general';
import { SelectionModel } from '@angular/cdk/collections';
import {
  CrudInformationAdjacentPropertyComponent
} from './crud-information-adjacent-property/crud-information-adjacent-property.component';

@Component({
  selector: 'vex-information-adjacent-property',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    SweetAlert2Module,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    HeaderCadastralInformationPropertyComponent,
    NgForOf
  ],
  templateUrl: './information-adjacent-property.component.html',
  styleUrl: './information-adjacent-property.component.scss'
})
export class InformationAdjacentPropertyComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;

  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable: boolean | undefined = true;

  columns: TableColumn<InformationAdjacent>[] = TABLE_COLUMN_PROPERTIES_ADJACENT_EDITION;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_OPTION_5_7_10;

  dataSource!: MatTableDataSource<InformationAdjacent>;
  selection: SelectionModel<InformationAdjacent> = new SelectionModel<InformationAdjacent>(
    true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('deleteSwal') private deleteSwal!: SwalComponent;
  @ViewChild('errorSwal') private errorSwal!: SwalComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }

    this.dataSource = new MatTableDataSource();
    this.id = getRandomInt(874524) + this.schema +
      +'InformationAdjacentPropertyComponent' + getRandomInt(10) + this.baunitId;

    if (this.typeInformation === TYPE_INFORMATION_VISUAL || !this.editable) {
      this.columns = TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL;
    }

    this.isExpandPanel(this.expandedComponent);

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchInformationAdjacentProperty();
    }
  }

  searchInformationAdjacentProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.informationPropertyService.getInformationPropertyAdjacent(
      this.page, this.pageSize, this.baunitId).subscribe({
      next: (result: InformationPegeable) => this.captureInformationSubscribe(result),
      error: (err: any) => this.captureInformationSubscribeError()
    });
    return true;
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.captureInformationAdjacentData();
  }

  captureInformationAdjacentData(): void {
    let data: InformationAdjacent[];
    if (this.contentInformation == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      data = data.map((row: InformationAdjacent) => new InformationAdjacent(row));
      this.dataSource.data = data;
    }

    if (this.contentInformation.totalElements) {
      this.totalElements = this.contentInformation.totalElements;
    }

    if (this.contentInformation.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation.pageable.pageNumber != null) {
      this.page = this.contentInformation.pageable.pageNumber;
    }
  }

  captureInformationSubscribeError(): void {
    this.contentInformation = new InformationPegeable();
    this.dataSource.data = [];
  }

  addAdjacentInformationProperty(): void {
    this.executeEventAddEditAdjacentInformationProperty(null);
  }

  editAdjacentInformationProperty(customer: ContentInformationConstruction): void {
    this.executeEventAddEditAdjacentInformationProperty(customer);
  }

  executeEventAddEditAdjacentInformationProperty(customer: any): void {
    const dialogRef = this.dialog.open(CrudInformationAdjacentPropertyComponent, {
      ...MODAL_SMALL,
      data: {
        ...customer,
        executionId: this.executionId,
        baunitId: this.baunitId
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

      }
    });
  }

  deleteInformation(customer: any): void {
    // const dialogRef = this.dialog.open(this.confirmDialog);
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     const baunitId = this.baunitId ?? '';
    //     const executionId = this.executionId ?? '';
    //     const unitBuiltId = customer.unitBuiltId;
    //
    //     this.informationPropertyService.deleteConstruction(baunitId, executionId, unitBuiltId).subscribe({
    //       next: () => {
    //
    //         this.dataSource.data = this.dataSource.data.filter((row: any) => row.unitBuiltId !== unitBuiltId);
    //         this.deleteSwal.fire();
    //       },
    //       error: () => {
    //         this.errorSwal.fire();
    //       }
    //     });
    //   }
    // });
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchInformationAdjacentProperty();
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  /** Where the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data
        .forEach((row: InformationAdjacent) => this.selection.select(row));
  }

  toggleColumnVisibility(column: TableColumn<InformationAdjacent>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible)
      .map((column) => column.property);
  }

}
