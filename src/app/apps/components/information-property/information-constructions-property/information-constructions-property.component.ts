import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MODAL_DINAMIC_HEIGHT,
  MODAL_LARGE,
  MODAL_MEDIUM,
  MODAL_SMALL,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
  PAGE_SIZE_OPTION_ADDRESS,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS,
  TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constants';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
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
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import {
  ContentInformationConstruction
} from '../../../interfaces/information-property/content-information-construction';
import {
  DetailInformationConstructionsPropertyComponent
} from './detail-information-constructions-property/detail-information-constructions-property.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeInformation } from '../../../interfaces/general/content-info';
import {
  CrudInformationConstructionsPropertyComponent
} from './crud-information-constructions-property/crud-information-constructions-property.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  InformationConstructionsService
} from '../../../services/information-property/information-constructions-property/information-constructions.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'vex-information-constructions-property',
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
    NgForOf,
    NgIf,
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
    HeaderCadastralInformationPropertyComponent
  ],
  templateUrl: './information-constructions-property.component.html',
  styleUrl: './information-constructions-property.component.scss'
})
export class InformationConstructionsPropertyComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  ltLg$: Observable<boolean> = this.layoutService.ltLg$;
  ltMd$: Observable<boolean> = this.layoutService.ltMd$;
  contentInformations!: InformationPegeable;

  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable? = true;

  columns: TableColumn<ContentInformationConstruction>[] = TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  configModalCrud: any = MODAL_DINAMIC_HEIGHT;

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
  private snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private constructionsService: InformationConstructionsService
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    if (this.typeInformation === TYPE_INFORMATION_VISUAL || !this.editable) {
      this.pageSize = PAGE_SIZE_SORT;
      this.pageSizeOptions = PAGE_SIZE_OPTION_ADDRESS;
      this.columns = TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS;
    }
    this.isExpandPanel(this.expandedComponent);
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.isDesktop$
      .pipe(filter<boolean>(Boolean))
      .subscribe((result: boolean) => {
        this.configModalCrud = MODAL_DINAMIC_HEIGHT;
      });

    this.ltMd$
      .pipe(filter<boolean>(Boolean))
      .subscribe((result: boolean) => {
        this.configModalCrud = MODAL_MEDIUM;
      });

    this.ltMd$
      .pipe(filter<boolean>(Boolean))
      .subscribe((result: boolean) => {
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

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchInformationsConstructionsProperty();
    }
  }

  searchInformationsConstructionsProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.constructionsService.getBasicInformationPropertyConstructions(
      this.generateObjectPageSearchData(this.baunitId), this.schema, this.executionId)
      .subscribe({
        error: (err: any) => this.captureInformationSubscribeError(err),
        next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
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
      data = data.map((row: ContentInformationConstruction) => new ContentInformationConstruction(row));
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

  captureInformationSubscribeError(err: any): void {
    this.contentInformations = new InformationPegeable();
    this.dataSource.data = [];
  }

  openDetailInformationConstructionsProperty(data: ContentInformationConstruction) {
    if (this.baunitId === null || this.baunitId === undefined) {
      return;
    }

    this.dialog
      .open(DetailInformationConstructionsPropertyComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: new ContentInformationConstruction(data, this.schema, this.baunitId)
      })
      .afterClosed();
  }

  openAddConstructionInformationProperty(): void {
    this.executeEventAddEditConstructionInformation(null);
  }

  editInformation(customer: ContentInformationConstruction): void {
    this.executeEventAddEditConstructionInformation(customer);
  }

  deleteInformation(customer: ContentInformationConstruction): void {
    this.deletedConstruction.fire().then((result) => {
      if (result.isConfirmed && this.baunitId && this.executionId && customer.unitBuiltId) {
        this.constructionsService.deleteConstruction(this.baunitId, this.executionId, customer.unitBuiltId).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter((row: any) => row.unitBuiltId !== customer.unitBuiltId);
            this.deleteSwal.fire();
          },
          error: () => {
            this.errorSwal.fire();
          }
        });
      }
    });
  }

  copyInformation(customer: ContentInformationConstruction): void {
    this.copyConstruction.fire().then((result) => {
      if (result.isConfirmed && this.baunitId && this.executionId && customer.unitBuiltId) {
        this.constructionsService.copyConstruction(this.baunitId, this.executionId, customer.unitBuiltId).subscribe({
          next: () => {
            this.copySwal.fire();
            this.searchInformationsConstructionsProperty();
          },
          error: () => this.errorCopySwal.fire()
        });
      }
    });
  }

  executeEventAddEditConstructionInformation(content: ContentInformationConstruction | null) {
    let data: ContentInformationConstruction = new ContentInformationConstruction(content, this.schema, this.baunitId);
    data.executionId = this.executionId;

    const dialogRefConstruction = this.dialog.open(
      CrudInformationConstructionsPropertyComponent, {
        ...this.configModalCrud,
        disableClose: true,
        data: { type: !content ? 'CREATE' : 'UPDATE', contentInformation: data }
      });
    dialogRefConstruction.afterClosed().subscribe((result: ContentInformationConstruction) => {
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

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

}
