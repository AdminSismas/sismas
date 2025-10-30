/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  computed,
  inject,
  Output,
  EventEmitter,
  input,
  output
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { AddEditInformatizonZonesPropertyComponent } from '../../add-edit-informatizon-zones-property/add-edit-informatizon-zones-property.component';
import {
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  TABLE_COLUMN_PROPERTIES_GEO_ECONOMIC,
  TYPE_INFORMATION_EDITION
} from '@shared/constants';
import { ZoneBAUnitGeoeconomic } from '@shared/interfaces';
import { DetailInformationPropertyZonesComponent } from '../../detail-information-property-zones/detail-information-property-zones.component';
import { BasicInformationProperty } from '@shared/interfaces';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TypeInformation } from '@shared/interfaces';
import { environment } from '@environments/environments';
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
    CdkAccordionModule,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatTabsModule,
    SweetAlert2Module
  ],
  templateUrl: './geo-economic-zones-property.component.html',
  styleUrl: './geo-economic-zones-property.component.scss'
})
export class GeoEconomicZonesPropertyComponent
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnitGeoeconomic: ZoneBAUnitGeoeconomic[] = [];

  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true })
  public dataSource!: MatTableDataSource<ZoneBAUnitGeoeconomic>;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) npn!: string;
  @Input() editable? = false;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  // INPUT SIGNALS
  tableTitle = input<string>();
  isOrigen = input<boolean>(false);
  isMatriz = input.required<boolean>();

  @Output() deleteGeoeconomicZone = new EventEmitter<ZoneBAUnitGeoeconomic>();
  @Output() geoeconomicZoneChange = new EventEmitter<void>();

  // OUTPUT SINGNALS
  assignamentZone = output<'physic' | 'geoeconomic'>();

  columns: TableColumn<any>[] = TABLE_COLUMN_PROPERTIES_GEO_ECONOMIC;

  @ViewChild('confirmDialog', { static: true }) confirmDialog:
    | TemplateRef<any>
    | undefined;
  @ViewChild('successDelete') successDelete!: SwalComponent;
  @ViewChild('successCreate') successCreate!: SwalComponent;

  dataBasicInformation!: BasicInformationProperty;

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

  openInformationPropertyZone(zone: ZoneBAUnitGeoeconomic): void {
    const dialog = this.matDialog.open(
      DetailInformationPropertyZonesComponent,
      {
        ...MODAL_SMALL,
        disableClose: true,
        data: { zone, propertyType: 'Geoeconómica' }
      }
    );
    dialog.afterClosed().subscribe();
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

  onAssignament() {
    this.assignamentZone.emit('geoeconomic');
  }
}
