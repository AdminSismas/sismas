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
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION_ADDRESS,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS,
  TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION, TYPEINFORMATION_EDITION, TYPEINFORMATION_VISUAL
} from '../../../constants/constant';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { VexHighlightDirective } from '@vex/components/vex-highlight/vex-highlight.directive';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { PageSearchData } from '../../../interfaces/page-search-data.model';
import { InformationPegeable } from '../../../interfaces/information-pegeable.model';
import {
  ContentInformationConstruction
} from '../../../interfaces/information-property/content-information-construction';
import {
  DetailInformationConstructionsPropertyComponent
} from './detail-information-constructions-property/detail-information-constructions-property.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TypeInformation } from '../../../interfaces/content-info';

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
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatTabsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    VexHighlightDirective,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatPaginatorModule,
    MatTooltipModule,
    MatCardModule,
    HeaderCadastralInformationPropertyComponent,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  templateUrl: './information-constructions-property.component.html',
  styleUrl: './information-constructions-property.component.scss'
})
export class InformationConstructionsPropertyComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;

  @Input({ required: true }) id: string = '';
  @Input({ required: true }) public expandedComponent: boolean = true;
  @Input({ required: true }) schema: string = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

  columns: TableColumn<ContentInformationConstruction>[] = TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION;
  page:number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION_ADDRESS;

  dataSource!: MatTableDataSource<ContentInformationConstruction>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    if(this.typeInformation && this.typeInformation === TYPEINFORMATION_VISUAL) {
      this.pageSize = PAGE_SIZE_SORT;
      this.pageSizeOptions = PAGE_SIZE_OPTION_ADDRESS;
      this.columns = TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS;
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
    this.informationPropertyService.getBasicInformationPropertyConstructions(
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

  openDetailInformationConstructionsProperty(data:ContentInformationConstruction){
    if (this.baunitId === null || this.baunitId === undefined) {
      return;
    }

    this.dialog
      .open(DetailInformationConstructionsPropertyComponent, {
        minWidth: '60%',
        minHeight: '70%',
        disableClose: true,
        data: new ContentInformationConstruction(data,this.schema, this.baunitId)
      })
      .afterClosed();
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  deleteInformations(customer: any): void {
    console.log(customer);
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
}
