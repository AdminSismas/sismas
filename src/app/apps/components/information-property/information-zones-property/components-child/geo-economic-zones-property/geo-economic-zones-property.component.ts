/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  input
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { AddEditInformatizonZonesPropertyComponent } from '../../add-edit-informatizon-zones-property/add-edit-informatizon-zones-property.component';
import {
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
  TABLE_COLUMN_PROPERTIES_GEO_ECONOMIC,
  TYPE_INFORMATION_EDITION
} from 'src/app/apps/constants/general/constant';
import { ZoneBAUnitGeoeconomic } from 'src/app/apps/interfaces/information-property/zone-baunit';
import { DetailInformationPropertyZonesComponent } from '../../detail-information-property-zones/detail-information-property-zones.component';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { PAGE } from 'src/app/apps/constants/general/procedures.constant';
import { TypeInformation } from 'src/app/apps/interfaces/general/content-info';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'vex-geo-economic-zones-property',
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
    MatExpansionModule,
    CdkAccordionModule,
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
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatCardModule,
    MatRippleModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
    SweetAlert2Module
  ],
  templateUrl: './geo-economic-zones-property.component.html',
  styleUrl: './geo-economic-zones-property.component.scss'
})
export class GeoEconomicZonesPropertyComponent
  implements OnInit, AfterViewInit
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnitGeoeconomic: ZoneBAUnitGeoeconomic[] = [];

  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true })
  public dataSource!: MatTableDataSource<ZoneBAUnitGeoeconomic>;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) npn!: string;
  @Input() editable? = false;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  tableTitle = input<string>();
  isOrigen = input<boolean>(false);

  @Output() deleteGeoeconomicZone = new EventEmitter<ZoneBAUnitGeoeconomic>();
  @Output() geoeconomicZoneChange = new EventEmitter<void>();

  columns: TableColumn<any>[] = TABLE_COLUMN_PROPERTIES_GEO_ECONOMIC;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator2?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2?: MatSort;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true }) confirmDialog:
    | TemplateRef<any>
    | undefined;
  @ViewChild('successDelete') successDelete!: SwalComponent;
  @ViewChild('successCreate') successCreate!: SwalComponent;

  dataBasicInformation!: BasicInformationProperty;
  fractions_sum = 0;
  page: number = PAGE;
  totalGeoElements = input.required<number>();
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  rightIdSelected?: number;

  actionBtns = computed(() => {
    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      },
      {
        id: 'delete',
        label: 'Eliminar',
        icon: 'mat:delete'
      }
    ];
  });
  addEditDialogContent = computed<{ title: string }>(() => {
    const initialState: any = {
      title: 'Nueva zona'
    };
    return { ...initialState };
  });

  private matDialog = inject(MatDialog);

  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMATION_PROPERTIES;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(
    private readonly layoutService: VexLayoutService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get TYPEINFORMATION_EDITION() {
    return TYPE_INFORMATION_EDITION;
  }

  get visibleColumns() {
    const visibleColumns = this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);

    if (this.typeInformation === TYPE_INFORMATION_EDITION && this.editable) {
      visibleColumns.push('actions');
    }

    return visibleColumns;
  }

  getGeoeconomicZoneCode(row: ZoneBAUnitGeoeconomic): string {
    if (row.ccZonaHomoGeoEconomica?.zonaHomoGeoEconomicaCode) {
      return row.ccZonaHomoGeoEconomica.zonaHomoGeoEconomicaCode.toString();
    }
    return NAME_NO_DISPONIBLE;
  }

  getGeoeconomicZoneValidity(row: ZoneBAUnitGeoeconomic): string {
    if (row.ccZonaHomoGeoEconomica?.vigencia) {
      return row.ccZonaHomoGeoEconomica.vigencia.toString();
    }
    return NAME_NO_DISPONIBLE;
  }

  captureBasicInformationSubscribe(result: BasicInformationProperty): void {
    this.dataBasicInformation = result;
  }

  determinePropertyType(): string {
    if (
      !this.dataBasicInformation ||
      !this.dataBasicInformation.cadastralNumberFormat
    ) {
      return '';
    }

    const typeCode = this.dataBasicInformation.cadastralNumberFormat.substring(
      7,
      9
    );

    if (typeCode === '00') {
      return 'Rural';
    } else {
      return 'Urbano';
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator2) {
      this.dataSource.paginator = this.paginator2;
      this.changeDetectorRef.detectChanges();
    }
    if (this.sort2) {
      this.dataSource.sort = this.sort2;
    }
  }

  refreshPaginator(pageEvent: PageEvent): void {
    const { pageIndex, pageSize } = pageEvent;

    this.page = pageIndex;
    this.pageSize = pageSize;
    this.changeDetectorRef.markForCheck(); //
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
  }

  openInformationPropertyZone(zone: ZoneBAUnitGeoeconomic): void {
    const dialog = this.matDialog.open(
      DetailInformationPropertyZonesComponent,
      {
        ...MODAL_SMALL,
        disableClose: true,
        data: { zone, propertyType: 'Geoeconómica' }
      }
    );
    dialog.afterClosed().subscribe((data: any) => console.log(data));
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  onClickGeoconomicActionBtn(id: string, zone: ZoneBAUnitGeoeconomic): void {
    if (id === 'edit') {
      this.onClickOpenGeoconomicAddEditModal(zone);
    }
    if (id === 'delete') {
      this.successDelete.fire().then((result) => {
        if (result.isConfirmed) {
          this.deleteGeoeconomicZone.emit(zone);
        }
      });
    }
  }

  onClickOpenGeoconomicAddEditModal(data?: ZoneBAUnitGeoeconomic): void {
    const propertyType = 'Geoeconomica';

    const isEdit = data && data.baUnitZonaId;

    this.matDialog
      .open(AddEditInformatizonZonesPropertyComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: {
          zone: data,
          baunitId: this.baunitId,
          executionId: this.executionId,
          isEdit,
          propertyType,
          npn: this.npn
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.successCreate.fire();
          this.geoeconomicZoneChange.emit();
        }
      });
  }

  disabledClass(): string {
    if (!this.editable) {
      return '!bg-slate-400 !text-gray-100 opacity-60';
    }
    return 'w-8 h-8 p-0 mr-1 leading-none flex items-center justify-center m-0 hover:bg-hover text-green-600 bg-green-600/10';
  }
}
