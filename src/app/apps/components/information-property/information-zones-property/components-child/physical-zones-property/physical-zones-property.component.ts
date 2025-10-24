/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  computed,
  Output,
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { AddEditInformatizonZonesPropertyComponent } from '@shared/components';
import {
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  TABLE_COLUMN_PROPERTIES_PHYSICAL,
  TYPE_INFORMATION_EDITION
} from '@shared/constants';
import { ZoneBAUnitFisica } from 'src/app/apps/interfaces/information-property/zone-baunit';
import { DetailInformationPropertyZonesComponent } from '@shared/components';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { VexLayoutService } from '@vex/services/vex-layout.service';
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
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatTabsModule,
    SweetAlert2Module
  ],
  templateUrl: './physical-zones-property.component.html',
  styleUrl: './physical-zones-property.component.scss'
})
export class PhysicalZonesPropertyComponent {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnit: ZoneBAUnitFisica[] = [];
  zoneBAUnitRural: ZoneBAUnitFisica[] = [];
  zoneBAUnitUrban: ZoneBAUnitFisica[] = [];

  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) divPolLv1!: string;
  @Input({ required: true }) divPolLv2!: string;
  @Input({ required: true }) dataSource: MatTableDataSource<ZoneBAUnitFisica> =
    new MatTableDataSource<ZoneBAUnitFisica>([]);
  @Input() editable? = false;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  // INPUT SIGNALS
  tableTitle = input<string>();
  isOrigen = input<boolean>(false);
  zoneType = input.required<'Urbano' | 'Rural'>();
  isMatriz = input.required<boolean>();

  @Output() physicalZoneChange = new EventEmitter<void>();
  @Output() deletePhysicalZone = new EventEmitter<ZoneBAUnitFisica>();

  // OUTPUT SIGNALS
  assignamentZone = output<'physic' | 'geoeconomic'>();

  columns: TableColumn<ZoneBAUnitFisica>[] = TABLE_COLUMN_PROPERTIES_PHYSICAL;

  @ViewChild('confirmDialog', { static: true }) confirmDialog:
    | TemplateRef<any>
    | undefined;
  @ViewChild('successCreate') successCreate!: SwalComponent;
  @ViewChild('successDelete') successDelete!: SwalComponent;

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

  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMATION_PROPERTIES;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(
    private readonly layoutService: VexLayoutService,
    private matDialog: MatDialog
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

  openInformationPropertyZone(zone: ZoneBAUnitFisica): void {
    const propertyType = this.determinePropertyType();

    this.matDialog.open(DetailInformationPropertyZonesComponent, {
      ...MODAL_SMALL,
      disableClose: true,
      data: { zone, propertyType }
    });
  }

  captureInformationSubscribeError(): void {
    this.zoneBAUnit = [];
    this.zoneBAUnitRural = [];
    this.zoneBAUnitUrban = [];
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
        if (result.isConfirmed) {
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
      .subscribe((result) => {
        if (result) {
          this.successCreate.fire();
          this.physicalZoneChange.emit();
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
    this.assignamentZone.emit('physic');
  }
}
