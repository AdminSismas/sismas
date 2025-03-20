/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
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
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { Observable } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CommonModule } from '@angular/common';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import {
  ZoneBAUnitFisica,
  ZoneBAUnitGeoeconomic,
  ZoneBAUnitResponse
} from 'src/app/apps/interfaces/information-property/zone-baunit';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import {
  GeoEconomicZonesPropertyComponent
} from './components-child/geo-economic-zones-property/geo-economic-zones-property.component';
import {
  PhysicalZonesPropertyComponent
} from './components-child/physical-zones-property/physical-zones-property.component';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

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
    MatTableModule,
    GeoEconomicZonesPropertyComponent,
    PhysicalZonesPropertyComponent,
    SweetAlert2Module
  ],
  templateUrl: './information-zones-property.component.html',
  styleUrl: './information-zones-property.component.scss'
})
export class InformationZonesPropertyComponent implements OnInit {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  seeAcctionsComponents = false;

  zoneBAUnit: ZoneBAUnitFisica[] = [];
  zoneBAUnitRural: ZoneBAUnitFisica[] = [];
  zoneBAUnitUrban: ZoneBAUnitFisica[] = [];
  zoneBAUnitGeoeconomic: ZoneBAUnitGeoeconomic[] = [];

  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input({ required: true }) npn!: string;
  @Input() editable?: boolean;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  @ViewChild('errorDelete') errorDelete!: SwalComponent;

  dataBasicInformation!: BasicInformationProperty;
  page: number = PAGE;
  page2: number = PAGE;
  totalPhysicalElements = 0;
  totalGeoElements = 0;
  pageSize: number = PAGE_SIZE;
  pageSize2: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  pageSizeOptions2: number[] = PAGE_OPTION__10_20_50_100;
  rightIdSelected?: number;
  dataSource: MatTableDataSource<ZoneBAUnitFisica> =
    new MatTableDataSource<ZoneBAUnitFisica>([]);

  dataSourceGeoeconomicZones: MatTableDataSource<ZoneBAUnitGeoeconomic> =
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

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    this.isExpandPanel(this.expandedComponent);
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

    this.informationPropertyService
      .getByBaunitFisica(this.baunitId, this.schema, this.executionId)
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnit = this.capturePhysicZoneInformation(result);
          this.dataSource.data = this.zoneBAUnit;
          this.totalPhysicalElements = result.length;
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

  searchInformationsGeoeconomicZonesProperty(): void {
    if (!this.schema || !this.baunitId) return;

    this.informationPropertyService
      .getByBaunitEcono(this.baunitId, this.schema, this.executionId)
      .subscribe({
        next: (result: ZoneBAUnitResponse[]) => {
          this.zoneBAUnitGeoeconomic =
            this.captureGeoeconomicZoneInformation(result);
          this.dataSourceGeoeconomicZones.data = this.zoneBAUnitGeoeconomic;
          this.totalGeoElements = this.zoneBAUnitGeoeconomic.length;
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

  deleteZone(zone: ZoneBAUnitFisica | ZoneBAUnitGeoeconomic): void {
    if (!this.schema ||!this.baunitId) return;

    const baunitId = Number(this.baunitId);

    this.informationPropertyService.deleteBAUnitZones(this.executionId!, baunitId, zone.baUnitZonaId!)
      .subscribe({
        next: () => {
          this.searchInformationsZonesProperty();
          this.searchInformationsGeoeconomicZonesProperty();
        },
        error: (error: HttpErrorResponse) => {
          this.errorDelete.fire();
          console.log(error.message);
        }
      });
  }
}
