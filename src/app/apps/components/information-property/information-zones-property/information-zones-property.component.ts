import { Component, Input, OnInit } from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMACION_PROPERTIY,
  TYPEINFORMATION_EDITION
} from '../../../constants/constant';
import { environment } from '../../../../../environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDialog, MatDialogContent } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { Observable } from 'rxjs';
import { ZoneBAUnit } from '../../../interfaces/information-property/zone-baunit';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { VexHighlightDirective } from '@vex/components/vex-highlight/vex-highlight.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { TypeInformation } from '../../../interfaces/content-info';

@Component({
  selector: 'vex-information-zones-property',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms
  ],
  imports: [
    MatExpansionModule,
    CdkAccordionModule,
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
    VexHighlightDirective,
    ReactiveFormsModule,
    VexPageLayoutHeaderDirective,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatSlideToggleModule,
    MatCardModule,
    HeaderCadastralInformationPropertyComponent,
    MatExpansionModule,
    DatePipe,
    MatDialogContent
  ],
  templateUrl: './information-zones-property.component.html',
  styleUrl: './information-zones-property.component.scss'
})
export class InformationZonesPropertyComponent implements OnInit {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  zoneBAUnit: ZoneBAUnit[] = [];
  zoneBAUnitRural: ZoneBAUnit[] = [];
  zoneBAUnitUrban: ZoneBAUnit[] = [];
  zoneBAUnitGeoeconomic: ZoneBAUnit[] = [];

  @Input({ required: true }) id: string = '';
  @Input({ required: false }) public expandedComponent: boolean = false;
  @Input({ required: true }) schema: string = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMACION_PROPERTIY;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {
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
    }
  }

  searchInformationsZonesProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.informationPropertyService.getBasicInformationPropertyZones(
      this.baunitId, this.schema, this.executionId)
      .subscribe({
        error: (err: any) => this.captureInformationSubscribeError(err),
        next: (result: ZoneBAUnit[]) => this.captureInformationSubscribe(result)
      });
    return true;
  }

  captureInformationSubscribeError(err: any): void {
    this.zoneBAUnit = [];
    this.zoneBAUnitRural = [];
    this.zoneBAUnitUrban = [];
    this.zoneBAUnitGeoeconomic = [];
  }

  captureInformationSubscribe(result: ZoneBAUnit[]): void {
    this.zoneBAUnit = result;
    this.zoneBAUnitRural = this.filterByObject(result, 'ccZonaHomoFisicaRu');
    this.zoneBAUnitUrban = this.filterByObject(result, 'ccZonaHomoFisicaUr');
    this.zoneBAUnitGeoeconomic = this.filterByObject(result,'ccZonaHomoGeoEconomica');
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  filterByObject(result: ZoneBAUnit[], key: string ):ZoneBAUnit[]{
    return result.filter((zn: ZoneBAUnit) => this.validateObjet(zn, key));
  }

  validateObjet(object: any, key: string) {
    return object && object[key] !== null && object[key] !== undefined && object[key] != '';
  }
}
