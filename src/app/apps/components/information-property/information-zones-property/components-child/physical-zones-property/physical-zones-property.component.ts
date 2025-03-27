/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
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
import { NgClass } from '@angular/common';
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
  PAGE_OPTION_10_20_50_100,
  PAGE_SIZE,
  TABLE_COLUMN_PROPERTIES_PHYSICAL,
  TYPE_INFORMATION_EDITION
} from 'src/app/apps/constants/general/constants';
import {
  ZoneBAUnitFisica,
} from 'src/app/apps/interfaces/information-property/zone-baunit';
import { DetailInformationPropertyZonesComponent } from '../../detail-information-property-zones/detail-information-property-zones.component';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { PAGE } from 'src/app/apps/constants/general/procedures.constant';
import { TypeInformation } from 'src/app/apps/interfaces/general/content-info';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'vex-physical-zones-property',
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
    CdkAccordionModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    NgClass,
    ReactiveFormsModule,
    SweetAlert2Module
  ],
  templateUrl: './physical-zones-property.component.html',
  styleUrl: './physical-zones-property.component.scss'
})
export class PhysicalZonesPropertyComponent implements OnInit, AfterViewInit {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnit: ZoneBAUnitFisica[] = [];
  zoneBAUnitRural: ZoneBAUnitFisica[] = [];
  zoneBAUnitUrban: ZoneBAUnitFisica[] = [];

  @Input({ required: true }) id = '';
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) divPolLv1!: string;
  @Input({ required: true }) divPolLv2!: string;
  @Input({ required: true }) dataSource: MatTableDataSource<ZoneBAUnitFisica> =
    new MatTableDataSource<ZoneBAUnitFisica>([]);
  @Input() editable? = false;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  tableTitle = input<string>();
  isOrigen = input<boolean>(false);
  zoneType = input.required<'Urbano' | 'Rural'>();

  @Output() physicalZoneChange = new EventEmitter<void>();
  @Output() deletePhysicalZone = new EventEmitter<ZoneBAUnitFisica>();

  columns: TableColumn<ZoneBAUnitFisica>[] = TABLE_COLUMN_PROPERTIES_PHYSICAL;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true }) confirmDialog:
    | TemplateRef<any>
    | undefined;
  @ViewChild('successCreate') successCreate!: SwalComponent;
  @ViewChild('successDelete') successDelete!: SwalComponent;


  dataBasicInformation!: BasicInformationProperty;
  page: number = PAGE;
  totalPhysicalElements = input.required<number>();
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION_10_20_50_100;
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

  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMATION_PROPERTIES;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(
    private readonly layoutService: VexLayoutService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {}

  get TYPEINFORMATION_EDITION() {
    return TYPE_INFORMATION_EDITION;
  }

  get visibleColumns() {
    const visibleColumns =  this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);

    if (this.typeInformation === TYPE_INFORMATION_EDITION && this.editable) {
      visibleColumns.push('actions');
    }

    return visibleColumns;
  }

  zonaHomoCode(zone: ZoneBAUnitFisica): string {
    if (zone.ccZonaHomoFisicaRu) {
      return zone.ccZonaHomoFisicaRu.zonaHomoFisicaRuCode!;
    } else {
      return zone.ccZonaHomoFisicaUr!.zonaHomoFisicaUrCode!;
    }
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

    const typeCode = this.dataBasicInformation.cadastralNumberFormat.substring(7,9);

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
  }

  refreshPaginator(pageEvent: PageEvent): void {
    const { pageIndex, pageSize } = pageEvent;

    this.page = pageIndex;
    this.pageSize = pageSize;
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
  }

  openInformationPropertyZone(zone: ZoneBAUnitFisica): void {
    const propertyType = this.determinePropertyType();

    this.matDialog.open(
      DetailInformationPropertyZonesComponent,
      {
        ...MODAL_SMALL,
        disableClose: true,
        data: { zone, propertyType }
      }
    );
  }

  captureInformationSubscribeError(): void {
    this.zoneBAUnit = [];
    this.zoneBAUnitRural = [];
    this.zoneBAUnitUrban = [];
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  filterByObject(result: ZoneBAUnitFisica[], key: string): ZoneBAUnitFisica[] {
    return result.filter((zn: ZoneBAUnitFisica) => this.validateObjet(zn, key));
  }

  validateObjet(object: any, key: string) {
    return (
      object &&
      object[key] !== null &&
      object[key] !== undefined &&
      object[key] != ''
    );
  }

  onClickPhysicalActionBtn(id: string, zone: ZoneBAUnitFisica): void {
    if (id === 'edit') {
      this.onClickOpenPhysicalAddEditModal(zone);
    }
    if (id === 'delete') {
        this.successDelete.fire().then((result) => {
          if (result.isConfirmed){
            this.deletePhysicalZone.emit(zone);
          }
        });
    }
  }

  onClickOpenAddEditModal(data: any): void {
    const propertyType = this.determinePropertyType();

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
          divpolLv1: this.divPolLv1,
          divpolLv2: this.divPolLv2
        }
      })
      .afterClosed()
      .subscribe();
  }

  onClickOpenPhysicalAddEditModal(zone?: ZoneBAUnitFisica): void {

    const isEdit = Boolean(zone && zone.baUnitZonaId);

    this.matDialog
      .open(AddEditInformatizonZonesPropertyComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: {
          zone,
          baunitId: this.baunitId,
          executionId: this.executionId,
          isEdit,
          propertyType: this.zoneType(),
          divpolLv1: this.divPolLv1,
          divpolLv2: this.divPolLv2
        }
      })
      .afterClosed()
      .subscribe(result =>{
        if (result) {
          this.successCreate.fire();
          this.physicalZoneChange.emit();
        }
      }
      );
  }

  disabledClass(): string {
    if (!this.editable) {
      return '!bg-slate-400 !text-gray-100 opacity-60';
    }
    return 'w-8 h-8 p-0 mr-1 leading-none flex items-center justify-center m-0 hover:bg-hover text-green-600 bg-green-600/10';
  }
}
