import {
  AfterViewInit,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  Input,
  OnInit,
  output,
  ViewChild
} from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from 'src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MODAL_MEDIUM,
  MODAL_SMALL_LARGE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_UNIQUE,
  TABLE_COLUMN_PROPERTIES_ADJACENT_EDITION,
  TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '@shared/constants';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { InformationPegeable } from '@shared/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeInformation } from '@shared/interfaces';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InformationAdjacent } from '@shared/interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { CrudInformationAdjacentPropertyComponent } from '@shared/components';
import { InformationAdjacentPropertyService } from '@shared/services';
import Swal from 'sweetalert2';
import { MasiveDeleteAdjacentComponent } from '@shared/components';

@Component({
  selector: 'vex-information-adjacent-property',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
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
    HeaderCadastralInformationPropertyComponent
  ],
  templateUrl: './information-adjacent-property.component.html',
  styleUrl: './information-adjacent-property.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InformationAdjacentPropertyComponent),
      multi: true
    }
  ]
})
export class InformationAdjacentPropertyComponent
  implements OnInit, AfterViewInit
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;

  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable: boolean | undefined = true;

  // Inputs signal
  expandedComponent = input.required<boolean>();

  // Outputs signal
  emitExpandedComponent = output<number>();

  columns: TableColumn<InformationAdjacent>[] =
    TABLE_COLUMN_PROPERTIES_ADJACENT_EDITION;

  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  classEdit = '!bg-slate-400 !text-gray-100 opacity-60';

  dataSource!: MatTableDataSource<InformationAdjacent>;
  selection: SelectionModel<InformationAdjacent> =
    new SelectionModel<InformationAdjacent>(true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  @ViewChild('deletedAdjacent') deletedAdjacent!: SwalComponent;
  @ViewChild('deleteSwal') private deleteSwal!: SwalComponent;
  @ViewChild('errorSwal') private errorSwal!: SwalComponent;
  @ViewChild('errorAdjacentSwal') private errorAdjacentSwal!: SwalComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationAdjacentService: InformationAdjacentPropertyService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.baunitId == null) {
      return;
    }

    if (this.typeInformation === TYPE_INFORMATION_VISUAL || !this.editable) {
      this.columns = TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL;
    }

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    this.initialPaginatorAndSort();
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(7);
    this.searchInformationAdjacentProperty();
  }

  searchInformationAdjacentProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.informationAdjacentService
      .getInformationPropertyTemporalAdjacent(
        this.page,
        this.pageSize,
        this.baunitId
      )
      .subscribe({
        next: (result: InformationPegeable) =>
          this.captureInformationSubscribe(result),
        error: () => this.captureInformationSubscribeError()
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
      data = data.map(
        (row: InformationAdjacent) => new InformationAdjacent(row)
      );
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

  editAdjacentInformationProperty(content: InformationAdjacent): void {
    this.executeEventAddEditAdjacentInformationProperty(content);
  }

  executeEventAddEditAdjacentInformationProperty(
    content: InformationAdjacent | null
  ): void {
    const data: InformationAdjacent = new InformationAdjacent(
      content,
      this.schema,
      this.baunitId
    );
    data.executionId = this.executionId;
    const dialogRef = this.dialog.open(
      CrudInformationAdjacentPropertyComponent,
      {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: { type: !content ? 'CREATE' : 'UPDATE', contentInformation: data }
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (
        result &&
        result.ccColindanteBaunitId != null &&
        result.ccColindanteBaunitId > 0
      ) {
        this.searchInformationAdjacentProperty();
      }
    });
  }

  addAdjacentGeoInformationProperty(): void {
    if (this.baunitId && this.executionId) {
      this.informationAdjacentService
        .addInformationGeoPropertyAdjacent(this.executionId, this.baunitId)
        .subscribe({
          next: (result: string) => {
            Swal.fire({
              text: result,
              icon: 'success',
              showConfirmButton: false,
              timer: 2000
            }).then(() => this.searchInformationAdjacentProperty());
          },
          error: () => this.errorAdjacentSwal.fire()
        });
    }
  }

  deleteInformation(content: InformationAdjacent): void {
    if (!content || !content?.ccColindanteBaunitId) {
      return;
    }
    this.deletedAdjacent.fire().then((result) => {
      if (
        result.isConfirmed &&
        this.baunitId &&
        this.executionId &&
        content?.ccColindanteBaunitId
      ) {
        this.informationAdjacentService
          .deleteAdjacent(
            this.executionId,
            this.schema,
            this.baunitId,
            content?.ccColindanteBaunitId
          )
          .subscribe({
            next: () => {
              this.searchInformationAdjacentProperty();
              this.deleteSwal.fire();
            },
            error: () => this.errorSwal.fire()
          });
      }
    });
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
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row: InformationAdjacent) =>
        this.selection.select(row)
      );
    }
  }

  toggleColumnVisibility(
    column: TableColumn<InformationAdjacent>,
    event: Event
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  initialPaginatorAndSort() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  masiveDeleteAdjacents(): void {
    this.informationAdjacentService
      .getInformationPropertyTemporalAdjacent(0, 1000, this.baunitId!)
      .subscribe((result) => {
        this.dialog
          .open(MasiveDeleteAdjacentComponent, {
            ...MODAL_MEDIUM,
            data: {
              data: result.content
            }
          })
          .afterClosed()
          .subscribe((result: { result: boolean; data: InformationAdjacent[] }) => {
            if (!result.result || !this.executionId || !this.baunitId) return;

            this.onDeleteMasiveAdjacent(result, this.executionId, this.baunitId);
          });
      });
  }

  onDeleteMasiveAdjacent(
    result: { result: boolean; data: InformationAdjacent[] },
    executionId: string,
    baunitId: string
  ) {
    const ccColindanteBaUnitIds: number[] = result.data.map(
      (adjacent: InformationAdjacent) => adjacent.ccColindanteBaunitId!
    );

    this.informationAdjacentService
      .masiveDeleteAdjacent(executionId, baunitId, ccColindanteBaUnitIds)
      .subscribe(() => {
        Swal.fire({
          text: 'Colindantes eliminados correctamente',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 10000
        });
        this.searchInformationAdjacentProperty();
      });
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }
}
