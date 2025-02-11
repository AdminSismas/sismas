/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  signal,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMACION_PROPERTIY,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
  TYPEINFORMATION_EDITION,
  MODAL_SMALL
} from '../../../constants/general/constant';
import { environment } from '../../../../../environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { Observable } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import {
  CommonModule,
  NgForOf,
  NgIf
} from '@angular/common';
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
import { TypeInformation } from '../../../interfaces/general/content-info';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { DetailInformationPropertyZonesComponent } from './detail-information-property-zones/detail-information-property-zones.component';
import { ZoneBAUnit } from 'src/app/apps/interfaces/information-property/zone-baunit';
import { AddEditInformatizonZonesPropertyComponent } from './add-edit-informatizon-zones-property/add-edit-informatizon-zones-property.component';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { DeleteInformationZonesPropertyComponent } from './delete-information-zones-property/delete-information-zones-property.component';

@Component({
  selector: 'vex-information-zones-property',
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
    HeaderCadastralInformationPropertyComponent,
    MatExpansionModule,
    HeaderCadastralInformationPropertyComponent,
    MatCardModule,
    MatRippleModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatTableModule
  ],
  templateUrl: './information-zones-property.component.html',
  styleUrl: './information-zones-property.component.scss'
})
export class InformationZonesPropertyComponent
  implements OnInit, OnChanges, AfterViewInit
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnit: ZoneBAUnit[] = [];
  zoneBAUnitRural: ZoneBAUnit[] = [];
  zoneBAUnitUrban: ZoneBAUnit[] = [];
  zoneBAUnitGeoeconomic: ZoneBAUnit[] = [];

  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) divPolLv1!: string;
  @Input({ required: true }) divPolLv2!: string;
  @Input() editable?: boolean;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

  protected readonly TABLE_COLUMNS: TableColumn<ZoneBAUnit>[] = [
    {
      label: 'Detalle',
      property: 'viewDetail',
      type: 'button',
      visible: true
    },
    {
      label: 'Código',
      property: 'getZoneCode',
      type: 'text',
      visible: true
    },
    {
      label: 'Área',
      property: 'baUnitZonaArea',
      type: 'text',
      visible: true
    },
    {
      label: 'Vigencia',
      property: 'getZonevalidity',
      type: 'text',
      visible: true
    },

    {
      label: 'Actions',
      property: 'actions',
      type: 'button',
      visible: true
    }
  ];

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator2?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort2?: MatSort;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true }) confirmDialog:
    | TemplateRef<any>
    | undefined;

  dataBasicInformation!: BasicInformationProperty;
  fractions_sum = 0;
  page: number = PAGE;
  page2: number = PAGE;
  totalPhysicalElements = 0;
  totalGeoElements = 0;
  pageSize: number = PAGE_SIZE;
  pageSize2: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  pageSizeOptions2: number[] = PAGE_OPTION__10_20_50_100;
  rightIdSelected?: number;
  dataSource: MatTableDataSource<ZoneBAUnit> =
    new MatTableDataSource<ZoneBAUnit>([]);
  columns = signal(this.TABLE_COLUMNS);
  textColumns = computed(() =>
    this.columns().filter((column) => column.type === 'text')
  );

  dataSourceGeoeconomicZones: MatTableDataSource<ZoneBAUnit> =
    new MatTableDataSource<ZoneBAUnit>([]);
  columnsGeoeconomicZones = signal(this.TABLE_COLUMNS);
  textColumnsGeoeconomicZones = computed(() =>
    this.columnsGeoeconomicZones().filter((column) => column.type === 'text')
  );

  visibleColumns(): string[] {
    if (this.editable) {
      return [
        'viewDetail',
        'zoneCodeColumn',
        'baUnitZonaArea',
        'zoneValidityColumn',
        'actions'
      ];
    }

    return [
      'viewDetail',
      'zoneCodeColumn',
      'baUnitZonaArea',
      'zoneValidityColumn',
    ];
  }
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

  private informationPropertyService = inject(InformationPropertyService);
  private matDialog = inject(MatDialog);

  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMACION_PROPERTIY;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(private readonly layoutService: VexLayoutService, private changeDetectorRef: ChangeDetectorRef) {
    console.log('constructor', this.typeInformation);
  }

  getZoneCode(row: ZoneBAUnit): string {
    if (row.ccZonaHomoFisicaRu?.zonaHomoFisicaRuCode) {
      return row.ccZonaHomoFisicaRu.zonaHomoFisicaRuCode.toString();
    } else if (row.ccZonaHomoFisicaUr?.zonaHomoFisicaUrCode) {
      return row.ccZonaHomoFisicaUr.zonaHomoFisicaUrCode;
    }
    return NAME_NO_DISPONIBLE;
  }

  getZonevalidity(row: ZoneBAUnit): string {
    if (row.ccZonaHomoFisicaRu?.vigencia) {
      return row.ccZonaHomoFisicaRu.vigencia.toString();
    } else if (row.ccZonaHomoFisicaUr?.vigencia) {
      return row.ccZonaHomoFisicaUr.vigencia.toString();
    }
    return NAME_NO_DISPONIBLE;
  }

  getGeoeconomicZoneCode(row: ZoneBAUnit): string {
    if (row.ccZonaHomoGeoEconomica?.zonaHomoGeoEconomicaCode) {
      return row.ccZonaHomoGeoEconomica.zonaHomoGeoEconomicaCode.toString();
    }
    return NAME_NO_DISPONIBLE;
  }

  getGeoeconomicZoneValidity(row: ZoneBAUnit): string {
    if (row.ccZonaHomoGeoEconomica?.vigencia) {
      return row.ccZonaHomoGeoEconomica.vigencia.toString();
    }
    return NAME_NO_DISPONIBLE;
  }

  searchBasicInformationProperty(): void {
    if (!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService
      .getBasicInformationProperty(this.schema, this.baunitId, this.executionId)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: BasicInformationProperty) =>
          this.captureBasicInformationSubscribe(result)
      });
  }

  captureBasicInformationSubscribe(result: BasicInformationProperty): void {
    this.dataBasicInformation = result;
    console.log(this.dataBasicInformation.cadastralNumberFormat);
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

    console.log('typeCode', typeCode);
    if (typeCode === '00') {
      return 'Rural';
    } else {
      return 'Urbano';
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.changeDetectorRef.detectChanges();
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    if (this.paginator2) {
      this.dataSourceGeoeconomicZones.paginator = this.paginator2;
      this.changeDetectorRef.detectChanges();
    }
    if (this.sort2) {
      this.dataSourceGeoeconomicZones.sort = this.sort2;
    }
  }


  refreshPaginator(pageEvent: PageEvent, paginatorId: string): void {
    const { pageIndex, pageSize } = pageEvent;

    if (paginatorId === 'paginator1') {
      this.page = pageIndex;
      this.pageSize = pageSize;
      this.changeDetectorRef.markForCheck(); //
    }

    if (paginatorId === 'paginator2') {
      this.page2 = pageIndex;
      this.pageSize2 = pageSize;
      this.changeDetectorRef.markForCheck(); //
    }
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    this.isExpandPanel(this.expandedComponent);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['typeInformation']) {
      console.log('typeInformation', this.typeInformation);
    }
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchInformationsZonesProperty();
      this.searchInformationsGeoeconomicZonesProperty();
      this.searchBasicInformationProperty();
    }
  }

  searchInformationsZonesProperty(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService.getByBauniFisica(this.baunitId)
      .subscribe({
        next: (result: ZoneBAUnit[]) => {
          this.zoneBAUnit = result;
          this.dataSource.data = this.zoneBAUnit;
          this.totalPhysicalElements = this.zoneBAUnit.length;

          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.changeDetectorRef.markForCheck();
          }
        },
        error: () => this.captureInformationSubscribeError()
      });
  }


  searchInformationsGeoeconomicZonesProperty(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService.getByBauniEcono(this.baunitId)
      .subscribe({
        next: (result: ZoneBAUnit[]) => {
          this.zoneBAUnitGeoeconomic = result;
          this.dataSourceGeoeconomicZones.data = this.zoneBAUnitGeoeconomic;
          this.totalGeoElements = this.zoneBAUnitGeoeconomic.length;

          if (this.paginator2) {
            this.dataSourceGeoeconomicZones.paginator = this.paginator2;
            this.changeDetectorRef.detectChanges();
          }
        },
        error: () => this.captureInformationSubscribeError()
      });
  }


  openInformationPropertyZone(zone: ZoneBAUnit, zoneType: string): void {
    if (zoneType === 'physical') {
      const propertyType = this.determinePropertyType();
      const dialog = this.matDialog.open(
        DetailInformationPropertyZonesComponent,
        {
          ...MODAL_SMALL,
          disableClose: true,
          data: { zone, propertyType }
        }
      );
      dialog.afterClosed().subscribe((data: any) => console.log(data));
    } else {
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
  }

  captureInformationSubscribeError(): void {
    this.zoneBAUnit = [];
    this.zoneBAUnitRural = [];
    this.zoneBAUnitUrban = [];
    this.zoneBAUnitGeoeconomic = [];
  }

  captureInformationSubscribe(result: ZoneBAUnit[]): void {
    this.zoneBAUnit = result;
    this.zoneBAUnitRural = this.filterByObject(result, 'ccZonaHomoFisicaRu');
    this.zoneBAUnitUrban = this.filterByObject(result, 'ccZonaHomoFisicaUr');
    this.zoneBAUnitGeoeconomic = this.filterByObject(
      result,
      'ccZonaHomoGeoEconomica'
    );
    this.dataSource.data = this.zoneBAUnit;
  }

  captureGeoeconomicInformationSubscribe(result: ZoneBAUnit[]): void {
    this.zoneBAUnit = result;
    this.zoneBAUnitRural = this.filterByObject(result, 'ccZonaHomoFisicaRu');
    this.zoneBAUnitUrban = this.filterByObject(result, 'ccZonaHomoFisicaUr');
    this.zoneBAUnitGeoeconomic = this.filterByObject(
      result,
      'ccZonaHomoGeoEconomica'
    );
    this.dataSourceGeoeconomicZones.data = this.zoneBAUnitGeoeconomic;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  filterByObject(result: ZoneBAUnit[], key: string): ZoneBAUnit[] {
    return result.filter((zn: ZoneBAUnit) => this.validateObjet(zn, key));
  }

  validateObjet(object: any, key: string) {
    return (
      object &&
      object[key] !== null &&
      object[key] !== undefined &&
      object[key] != ''
    );
  }

  onClickActionBtn(id: string, zone: ZoneBAUnit): void {
    if (id === 'edit') {
      this.onClickOpenAddEditModal(zone);
    }
    if (id === 'delete') {
      this.matDialog
        .open(DeleteInformationZonesPropertyComponent, {
          ...MODAL_SMALL,
          disableClose: true,
          data: {
            zone,
            baunitId: this.baunitId,
            baUnitZonaId: zone.baUnitZonaId
          }
        })
        .afterClosed()
        .subscribe(() =>
          setTimeout(() => this.searchInformationsZonesProperty(), 200)
        );
    }
  }

  onClickGeoconomicActionBtn(id: string, zone: ZoneBAUnit): void {
    if (id === 'edit') {
      this.onClickOpenGeoconomicAddEditModal(zone);
    }
    if (id === 'delete') {
      this.matDialog
        .open(DeleteInformationZonesPropertyComponent, {
          ...MODAL_SMALL,
          disableClose: true,
          data: {
            zone,
            baunitId: this.baunitId,
            baUnitZonaId: zone.baUnitZonaId
          }
        })
        .afterClosed()
        .subscribe(() =>
          setTimeout(
            () => this.searchInformationsGeoeconomicZonesProperty(),
            200
          )
        );
    }
  }

  onClickOpenAddEditModal(data: any): void {
    const propertyType = this.determinePropertyType();

    const isEdit = data && data.baUnitZonaId;

    console.log(this.baunitId);

    this.matDialog
      .open(AddEditInformatizonZonesPropertyComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: {
          zone: data,
          baunitId: this.baunitId,
          isEdit,
          propertyType,
          divpolLv1: this.divPolLv1,
          divpolLv2: this.divPolLv2
        }
      })
      .afterClosed()
      .subscribe(() =>
        setTimeout(() => this.searchInformationsZonesProperty(), 200)
      );
  }

  onClickOpenGeoconomicAddEditModal(data: any): void {
    const propertyType = 'Geoeconomica';

    const isEdit = data && data.baUnitZonaId;

    console.log(this.baunitId);

    this.matDialog
      .open(AddEditInformatizonZonesPropertyComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: {
          zone: data,
          baunitId: this.baunitId,
          isEdit,
          propertyType,
          divpolLv1: this.divPolLv1,
          divpolLv2: this.divPolLv2
        }
      })
      .afterClosed()
      .subscribe(() =>
        setTimeout(() => this.searchInformationsGeoeconomicZonesProperty(), 200)
      );
  }

  disabledClass(): string {
    if (!this.editable) {
      return '!bg-slate-400 !text-gray-100 opacity-60';
    }
    return 'w-8 h-8 p-0 mr-1 leading-none flex items-center justify-center m-0 hover:bg-hover text-green-600 bg-green-600/10';
  }
}
