import {
  AfterViewInit,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
  OnInit,
  output,
  ViewChild
} from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from '@features/property-management/components/shared/header-cadastral-information/header-cadastral-information-property.component';
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
  MODAL_DYNAMIC_HEIGHT,
  MODAL_LARGE,
  MODAL_MEDIUM,
  MODAL_SMALL,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS,
  TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION,
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
import { BaunitHead } from '@shared/interfaces';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '@environments/environments';
import { PageSearchData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { ContentInformationConstruction } from '@shared/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeInformation } from '@shared/interfaces';
import { CrudInformationConstructionsPropertyComponent } from '@features/property-management/components/constructions/information-constructions-property/crud-information-constructions-property/crud-information-constructions-property.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InformationConstructionsService } from '@shared/services';
import { filter } from 'rxjs/operators';
import { EditConstructionsComponent } from '@features/property-management/components/constructions/information-constructions-property/edit-constructions/edit-constructions.component';
import { TableConstructionsComponent } from '@features/property-management/components/constructions/information-constructions-property/table-constructions/table-constructions.component';
import { ModalResponse } from '@shared/ui/modal-window/modal-window.component';
import Swal from 'sweetalert2';
import { input } from '@angular/core';

@Component({
  selector: 'vex-information-constructions-property',
  standalone: true,

  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    // Material
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
    // Custom
    HeaderCadastralInformationPropertyComponent,
    TableConstructionsComponent
  ],
  templateUrl: './information-constructions-property.component.html',
  styleUrl: './information-constructions-property.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InformationConstructionsPropertyComponent),
      multi: true
    }
  ]
})
export class InformationConstructionsPropertyComponent
  implements OnInit, AfterViewInit
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  ltLg$: Observable<boolean> = this.layoutService.ltLg$;
  ltMd$: Observable<boolean> = this.layoutService.ltMd$;
  contentInformations!: InformationPegeable;

  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable? = true;

  // Input signal
  expandedComponent = input.required<boolean>();

  // Output signal
  emitExpandedComponent = output<number>();

  columns: TableColumn<ContentInformationConstruction>[] =
    TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  configModalCrud = MODAL_DYNAMIC_HEIGHT;

  dataSource!: MatTableDataSource<ContentInformationConstruction>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('deletedConstruction') deletedConstruction!: SwalComponent;
  @ViewChild('copyConstruction') copyConstruction!: SwalComponent;
  @ViewChild('deleteSwal') private deleteSwal!: SwalComponent;
  @ViewChild('copySwal') private copySwal!: SwalComponent;
  @ViewChild('errorCopySwal') private errorCopySwal!: SwalComponent;
  @ViewChild('errorSwal') private errorSwal!: SwalComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private constructionsService: InformationConstructionsService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.baunitId == null) {
      return;
    }
    if (this.typeInformation === TYPE_INFORMATION_VISUAL || !this.editable) {
      this.pageSize = PAGE_SIZE_SORT;
      this.columns = TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS;
    }
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.isDesktop$.pipe(filter<boolean>(Boolean)).subscribe(() => {
      this.configModalCrud = MODAL_DYNAMIC_HEIGHT;
    });

    this.ltMd$.pipe(filter<boolean>(Boolean)).subscribe(() => {
      this.configModalCrud = MODAL_MEDIUM;
    });

    this.ltMd$.pipe(filter<boolean>(Boolean)).subscribe(() => {
      this.configModalCrud = MODAL_LARGE;
    });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(6);
    this.searchInformationsConstructionsProperty();
  }

  searchInformationsConstructionsProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.constructionsService
      .getBasicInformationPropertyConstructions(
        this.generateObjectPageSearchData(this.baunitId),
        this.schema,
        this.executionId
      )
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this.captureInformationSubscribe(result)
      });
    return true;
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.captureInformationConstructionData();
  }

  captureInformationConstructionData(): void {
    let data: ContentInformationConstruction[];
    if (this.contentInformations && this.contentInformations.content) {
      data = this.contentInformations.content;
      data = data.map(
        (row: ContentInformationConstruction) =>
          new ContentInformationConstruction(row)
      );
      this.dataSource.data = data;
    }

    if (this.contentInformations === null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.totalElements) {
      this.totalElements = this.contentInformations.totalElements;
    }

    if (this.contentInformations.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.pageable.pageNumber != null) {
      this.page = this.contentInformations.pageable.pageNumber;
    }
  }

  captureInformationSubscribeError(): void {
    this.contentInformations = new InformationPegeable();
    this.dataSource.data = [];
  }

  openAddConstructionInformationProperty(): void {
    this.executeEventAddEditConstructionInformation(null);
  }

  editInformation(customer: ContentInformationConstruction): void {
    this.executeEventAddEditConstructionInformation(customer);
  }

  deleteInformation(customer: ContentInformationConstruction): void {
    this.deletedConstruction.fire().then((result) => {
      if (
        result.isConfirmed &&
        this.baunitId &&
        this.executionId &&
        customer.unitBuiltId
      ) {
        this.constructionsService
          .deleteConstruction(
            this.baunitId,
            this.executionId,
            customer.unitBuiltId
          )
          .subscribe({
            next: () => {
              this.deleteSwal.fire();
              this.searchInformationsConstructionsProperty();
            },
            error: () => this.errorSwal.fire()
          });
      }
    });
  }

  copyInformation(customer: ContentInformationConstruction): void {
    this.copyConstruction.fire().then((result) => {
      if (
        result.isConfirmed &&
        this.baunitId &&
        this.executionId &&
        customer.unitBuiltId
      ) {
        this.constructionsService
          .copyConstruction(
            this.baunitId,
            this.executionId,
            customer.unitBuiltId
          )
          .subscribe({
            next: () => {
              this.copySwal.fire();
              this.searchInformationsConstructionsProperty();
            },
            error: () => this.errorCopySwal.fire()
          });
      }
    });
  }

  executeEventAddEditConstructionInformation(
    content: ContentInformationConstruction | null
  ) {
    const data: ContentInformationConstruction =
      new ContentInformationConstruction(content, this.schema, this.baunitId);
    data.executionId = this.executionId;

    const dialogRefConstruction = this.dialog.open(
      CrudInformationConstructionsPropertyComponent,
      {
        ...this.configModalCrud,
        disableClose: true,
        data: { type: !content ? 'CREATE' : 'UPDATE', contentInformation: data }
      }
    );
    dialogRefConstruction
      .afterClosed()
      .subscribe((result: ContentInformationConstruction) => {
        if (result && result.unitBuiltId != null && result.unitBuiltId > 0) {
          this.searchInformationsConstructionsProperty();
        }
      });
  }

  toggleColumnVisibility(column: TableColumn<BaunitHead>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    const validate: boolean = this.searchInformationsConstructionsProperty();
    if (!validate) {
      throw new Error('No fue posible actualizar los datos de la tabla');
    }
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  private generateObjectPageSearchData(baunitId: string): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, baunitId);
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  disabledClass(): string {
    if (!this.editable) {
      return '!bg-slate-400 !text-gray-100 opacity-60';
    }
    return '';
  }

  openEditConstruction() {
    this.getConstructionsWithoutBaunit();
  }

  getConstructionsWithoutBaunit(): void {
    if (!this.executionId || !this.baunitId) {
      console.error('Data is missing or incomplete');
      return;
    }

    const { executionId, baunitId } = this;

    this.constructionsService
      .getConstructionsWithoutBaunit(executionId, baunitId)
      .subscribe({
        next: (response) => {
          this.openDialogEditConstructions(response);
        },
        error: () => {
          return;
        }
      });
  }

  openDialogEditConstructions(
    response: ContentInformationConstruction[]
  ): void {
    this.dialog
      .open(EditConstructionsComponent, {
        ...MODAL_SMALL,
        data: {
          dataSource: new MatTableDataSource<ContentInformationConstruction>(
            response
          ),
          baunitId: this.baunitId,
          executionId: this.executionId
        }
      })
      .afterClosed()
      .subscribe(
        (response: ModalResponse<ContentInformationConstruction[]>) => {
          if (response.response && response.data) {
            this.addConstructionWithoutBaunit(response.data);
          }
        }
      );
  }

  addConstructionWithoutBaunit(
    construction: ContentInformationConstruction[]
  ): void {
    this.constructionsService.addConstructionsWithoutBaunit(
      this.executionId!,
      `${construction[0].unitBuiltId}`,
      this.baunitId!,
      construction[0]
    ).subscribe(
      () => {
        Swal.fire({
          title: 'Construcción agregada',
          text: 'La construcción se ha agregado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false
        });
        this.searchInformationsConstructionsProperty();
      });
  }
}
