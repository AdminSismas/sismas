/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, forwardRef, input, output, viewChild } from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from '@features/property-management/components/shared/header-cadastral-information/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  PAGE,
  TYPE_INFORMATION_EDITION
} from '@shared/constants/constants';
import { environment } from '@environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import {
  InformationPropertyService
} from '@features/property-management/services/property/information-property.service';
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
} from '@features/property-management/models/zone-baunit';
import { BasicInformationProperty } from '@features/property-management/models/basic-information-property';
import { GeoEconomicZonesPropertyComponent } from './geo-economic-zones-property/geo-economic-zones-property.component';
import { PhysicalZonesPropertyComponent } from './physical-zones-property/physical-zones-property.component';
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

  /* ---- Inputs ---- */
  readonly schema = input.required<keyof typeof environment.schemas>();
  readonly baunitId = input.required<string | null | undefined>();
  readonly npn = input.required<string>();
  readonly editable = input<boolean>();
  readonly executionId = input<string | null | undefined>(null);
  readonly typeInformation = input<TypeInformation>(TYPE_INFORMATION_EDITION);
  readonly isMatriz = input(false);
  readonly expandedComponent = input.required<boolean>();

  // Output signals
  emitExpandedComponent = output<number>();

  readonly errorDelete = viewChild.required<SwalComponent>('errorDelete');

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
    return this.npn().substring(0, 2);
  }
  get divPolLv2() {
    return this.npn().substring(2, 5);
  }
  get zoneType() {
    if (this.npn().substring(5, 7) === '00') return 'Rural';
    return 'Urbano';
  }

  searchBasicInformationProperty(): void {
    const schema = this.schema();
    const baunitId = this.baunitId();
    if (!schema || !baunitId) {
      return;
    }

    this.informationPropertyService
      .getBasicInformationProperty(schema, baunitId, this.executionId())
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
    const schema = this.schema();
    const baunitId = this.baunitId();
    if (!schema || !baunitId) return;

    this.informationPropertyService
      .getByBaunitFisica(baunitId, schema, this.executionId())
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnit = this.capturePhysicZoneInformation(result);
          this.dataSourcePhysicalZones.data = this.zoneBAUnit;
        },
        error: () => this.captureInformationSubscribeError()
      });
  }

  searchInformationPhysicalZonesOrigin(): void {
    const schema = this.schema();
    const baunitId = this.baunitId();
    if (!schema || !baunitId) return;

    this.informationPropertyService
      .getByBaunitFisicaOrigin(baunitId, schema, this.executionId())
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
    const schema = this.schema();
    const baunitId = this.baunitId();
    if (!schema || !baunitId) return;

    this.informationPropertyService
      .getByBaunitEcono(baunitId, schema, this.executionId())
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
    const schema = this.schema();
    const baunitId = this.baunitId();
    if (!schema || !baunitId) return;

    this.informationPropertyService
      .getByBaunitEconoOrigin(baunitId, schema, this.executionId())
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
    const baunitIdValue = this.baunitId();
    if (!this.schema() || !baunitIdValue) return;

    const baunitId = Number(baunitIdValue);

    this.informationPropertyService
      .deleteBAUnitZones(this.executionId()!, baunitId, zone.baUnitZonaId!)
      .subscribe({
        next: () => {
          this.searchInformationPhysicalZonesProperty();
          this.searchInformationGeoeconomicZonesProperty();
        },
        error: () => {
          this.errorDelete().fire();
        }
      });
  }

  assignamentZone(typeZone: 'physic' | 'geoeconomic') {
    const baunitId = this.baunitId();
    if (!this.schema() || !baunitId) return;

    this.informationPropertyService
      .assignamentZones(typeZone, this.executionId()!, baunitId!)
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
