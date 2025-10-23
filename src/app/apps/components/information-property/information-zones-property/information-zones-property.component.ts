/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, forwardRef, input, Input, output, ViewChild } from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from '@shared/components';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  PAGE,
  TYPE_INFORMATION_EDITION
} from '../../../constants/general/constants';
import { environment } from '../../../../../environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPropertyService } from '@shared/services';
import { Observable } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { TypeInformation } from '@shared/interfaces';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import {
  ZoneBAUnitFisica,
  ZoneBAUnitGeoeconomic,
  ZoneBAUnitResponse
} from 'src/app/apps/interfaces/information-property/zone-baunit';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { GeoEconomicZonesPropertyComponent } from '@shared/components';
import { PhysicalZonesPropertyComponent } from '@shared/components';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

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
    CdkAccordionModule,
    CommonModule,
    GeoEconomicZonesPropertyComponent,
    HeaderCadastralInformationPropertyComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatTabsModule,
    PhysicalZonesPropertyComponent,
    SweetAlert2Module
  ],
  templateUrl: './information-zones-property.component.html',
  styleUrl: './information-zones-property.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InformationZonesPropertyComponent),
      multi: true
    }
  ]
})
export class InformationZonesPropertyComponent {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnit: ZoneBAUnitFisica[] = [];
  zoneBAUnitRural: ZoneBAUnitFisica[] = [];
  zoneBAUnitUrban: ZoneBAUnitFisica[] = [];
  zoneBAUnitGeoeconomic: ZoneBAUnitGeoeconomic[] = [];

  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) npn!: string;
  @Input() editable?: boolean;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  // Input signals
  isMatriz = input(false);
  expandedComponent = input.required<boolean>();

  // Output signals
  emitExpandedComponent = output<number>();

  @ViewChild('errorDelete') errorDelete!: SwalComponent;

  dataBasicInformation!: BasicInformationProperty;
  page: number = PAGE;
  page2: number = PAGE;
  dataSourcePhysicalZones: MatTableDataSource<ZoneBAUnitFisica> =
    new MatTableDataSource<ZoneBAUnitFisica>([]);
  dataSourcePhysicalOrigin: MatTableDataSource<ZoneBAUnitFisica> =
    new MatTableDataSource<ZoneBAUnitFisica>([]);

  dataSourceGeoeconomicZones: MatTableDataSource<ZoneBAUnitGeoeconomic> =
    new MatTableDataSource<ZoneBAUnitGeoeconomic>([]);
  dataSourceGeoeconomicOrigin: MatTableDataSource<ZoneBAUnitGeoeconomic> =
    new MatTableDataSource<ZoneBAUnitGeoeconomic>([]);

  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMATION_PROPERTIES;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {}

  get divPolLv1() {
    return this.npn.substring(0, 2);
  }
  get divPolLv2() {
    return this.npn.substring(2, 5);
  }
  get zoneType() {
    if (this.npn.substring(5, 7) === '00') return 'Rural';
    return 'Urbano';
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
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(9);
    this.searchInformationPhysicalZonesProperty();
    this.searchInformationGeoeconomicZonesProperty();
    this.searchInformationPhysicalZonesOrigin();
    this.searchInformationGeoeconomicZonesOrigin();
    this.searchBasicInformationProperty();
  }

  searchInformationPhysicalZonesProperty(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService
      .getByBaunitFisica(this.baunitId, this.schema, this.executionId)
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnit = this.capturePhysicZoneInformation(result);
          this.dataSourcePhysicalZones.data = this.zoneBAUnit;
        },
        error: () => this.captureInformationSubscribeError()
      });
  }

  searchInformationPhysicalZonesOrigin(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService
      .getByBaunitFisicaOrigin(this.baunitId, this.schema, this.executionId)
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnit = this.capturePhysicZoneInformation(result);
          this.dataSourcePhysicalOrigin.data = this.zoneBAUnit;
        },
        error: () => this.captureInformationSubscribeError()
      });
  }

  capturePhysicZoneInformation(
    result: ZoneBAUnitResponse[]
  ): ZoneBAUnitFisica[] {
    const zoneBAUnit: ZoneBAUnitFisica[] = [];
    result.forEach((element: ZoneBAUnitResponse) => {
      zoneBAUnit.push(new ZoneBAUnitFisica(element));
    });
    return zoneBAUnit;
  }

  searchInformationGeoeconomicZonesProperty(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService
      .getByBaunitEcono(this.baunitId, this.schema, this.executionId)
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnitGeoeconomic =
            this.captureGeoeconomicZoneInformation(result);
          this.dataSourceGeoeconomicZones.data = this.zoneBAUnitGeoeconomic;
        },
        error: () => this.captureInformationSubscribeError()
      });
  }

  searchInformationGeoeconomicZonesOrigin(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService
      .getByBaunitEconoOrigin(this.baunitId, this.schema, this.executionId)
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnitGeoeconomic =
            this.captureGeoeconomicZoneInformation(result);
          this.dataSourceGeoeconomicOrigin.data = this.zoneBAUnitGeoeconomic;
        },
        error: () => this.captureInformationSubscribeError()
      });
  }

  captureGeoeconomicZoneInformation(
    result: ZoneBAUnitResponse[]
  ): ZoneBAUnitGeoeconomic[] {
    const zoneBAUnit: ZoneBAUnitGeoeconomic[] = [];

    result.forEach((element: ZoneBAUnitResponse) => {
      zoneBAUnit.push(new ZoneBAUnitGeoeconomic(element));
    });

    return zoneBAUnit;
  }

  captureInformationSubscribeError(): void {
    this.zoneBAUnit = [];
    this.zoneBAUnitRural = [];
    this.zoneBAUnitUrban = [];
    this.zoneBAUnitGeoeconomic = [];
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

  deleteZone(zone: ZoneBAUnitFisica | ZoneBAUnitGeoeconomic): void {
    if (!this.schema || !this.baunitId) return;

    const baunitId = Number(this.baunitId);

    this.informationPropertyService
      .deleteBAUnitZones(this.executionId!, baunitId, zone.baUnitZonaId!)
      .subscribe({
        next: () => {
          this.searchInformationPhysicalZonesProperty();
          this.searchInformationGeoeconomicZonesProperty();
        },
        error: () => {
          this.errorDelete.fire();
        }
      });
  }

  assignamentZone(typeZone: 'physic' | 'geoeconomic') {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService
      .assignamentZones(typeZone, this.executionId!, this.baunitId!)
      .subscribe((response) => {
        Swal.fire({
          title: 'Asignación de zona exitosa',
          text: response.message,
          icon: 'success',
         confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
          showCancelButton: false,
          allowOutsideClick: false
        });
      });
  }
}
