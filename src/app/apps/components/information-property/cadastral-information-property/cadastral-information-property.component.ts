/* eslint-disable @typescript-eslint/no-explicit-any */
// Angular framework
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import {
  InformationAddressesPropertyComponent
} from '../information-addresses-property/information-addresses-property.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VexHighlightModule } from '@vex/components/vex-highlight/vex-highlight.module';
import { MatListModule } from '@angular/material/list';
import { NgClass } from '@angular/common';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { BasicPropertyInformationComponent } from '../basic-property-information/basic-property-information.component';
import {
  InformationPropertyOwnersComponent
} from '../information-property-owners/information-property-owners.component';
import {
  InformationConstructionsPropertyComponent
} from '../information-constructions-property/information-constructions-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContentInfoSchema } from '../../../interfaces/general/content-info-schema';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { environment as envi } from '../../../../../environments/environments';
import { AdministrativeSourcesComponent } from '../administrative-sources/administrative-sources.component';
import {
  InformationPropertyService
} from 'src/app/apps/services/territorial-organization/information-property.service';
import { PhotosComponent } from '../photos/photos.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { InformationUnitPropertyComponent } from '../information-unit-property/information-unit-property.component';
import { InformationZonesPropertyComponent } from '../information-zones-property/information-zones-property.component';
import {
  FRAGMENT_BASIC_PROPERTY_INFORMATION,
  FRAGMENT_HISTORICAL_PROCEDURES_PROPERTY,
  FRAGMENT_INFORMATION_PROPERTY_OWNERS, FRAGMENT_INFORMATION_UNIT_PROPERTY,
  LIST_FRAGMENT_COMPONENTS_RULE_PAGE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  REFERENCE_COMPONENTS,
  RULE_PAGE_CADASTRAL_DA,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constants';
import {
  PropertyAppraisalInformationComponent
} from '../property-appraisal-information/property-appraisal-information.component';
import { SuperNotariadoPropertyComponent } from '../super-notariado-property/super-notariado-property.component';
import { TypeInformation } from '../../../interfaces/general/content-info';
import {
  InformationAdjacentPropertyComponent
} from '../information-adjacent-property/information-adjacent-property.component';
import { MatSelectModule } from '@angular/material/select';
import { FluidHeightDirective } from '../../../directives/fluid-height.directive';
import { getRandomInt } from 'src/app/apps/utils/general';
import {
  HistoricalActiveProceduresPropertyComponent
} from '../historical-active-procedures/historical-active-procedures.component';

@Component({
  selector: 'vex-cadastral-information-property',
  templateUrl: './cadastral-information-property.component.html',
  styleUrl: './cadastral-information-property.component.scss',
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatExpansionModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogContent,
    MatRippleModule,
    MatListModule,
    MatRippleModule,
    MatSnackBarModule,
    VexHighlightModule,
    BasicPropertyInformationComponent,
    InformationAddressesPropertyComponent,
    InformationPropertyOwnersComponent,
    InformationConstructionsPropertyComponent,
    InformationZonesPropertyComponent,
    PropertyAppraisalInformationComponent,
    MatFormFieldModule,
    InformationUnitPropertyComponent,
    AdministrativeSourcesComponent,
    PhotosComponent,
    AlertsComponent,
    SuperNotariadoPropertyComponent,
    InformationAdjacentPropertyComponent,
    HistoricalActiveProceduresPropertyComponent,
    MatSelectModule,
    FluidHeightDirective,
    NgClass
  ]
})
export class CadastralInformationPropertyComponent implements OnInit {

  @ViewChild('basicPropertyInformationComponent', {
    read: ElementRef,
    static: false
  })
  private basicPropertyInformationComponent?: ElementRef;

  @ViewChild('unitPropertyInformationComponent', {
    read: ElementRef,
    static: false
  })
  private informationUnitPropertyComponent?: ElementRef;

  @ViewChild('administrativeSourcesComponent', {
    read: ElementRef,
    static: false
  })
  private administrativeSourcesComponent?: ElementRef;

  @ViewChild('informationPropertyOwnersComponent', {
    read: ElementRef,
    static: false
  })
  private informationPropertyOwnersComponent?: ElementRef;

  @ViewChild('superNotariadoPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private superNotariadoPropertyComponent?: ElementRef;

  @ViewChild('informationAddressesPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private informationAddressesPropertyComponent?: ElementRef;

  @ViewChild('informationConstructionsPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private informationConstructionsPropertyComponent?: ElementRef;

  @ViewChild('informationAdjacentPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private informationAdjacentPropertyComponent?: ElementRef;

  @ViewChild('propertyAppraisalInformationComponent', {
    read: ElementRef,
    static: false
  })
  private propertyAppraisalInformationComponent?: ElementRef;

  @ViewChild('informationZonesPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private informationZonesPropertyComponent?: ElementRef;

  @ViewChild('historicalProceduresPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private historicalProceduresPropertyComponent?: ElementRef;

  @ViewChild('activeProceduresPropertyComponent', {
    read: ElementRef,
    static: false
  })
  private activeProceduresPropertyComponent?: ElementRef;

  @ViewChild('photosComponent', {
    read: ElementRef,
    static: false
  })
  private photosComponent?: ElementRef;

  @ViewChild('alertsComponent', {
    read: ElementRef,
    static: false
  })
  private alertsComponent?: ElementRef;


  @Input({ required: true }) typeInformation: TypeInformation = TYPE_INFORMATION_VISUAL;
  @Input({ required: true }) public showTittle = true;
  @Input({ required: true }) public label!: string;
  @Input() public id = '';
  @Input({ required: true }) public schema = '';
  @Input({ required: true }) contentInfoSchema!: ContentInfoSchema;
  @Input({ required: true }) public baunitCondition?: string;
  @Input({ required: false }) public cssClasses?: string;
  @Input() public resources: string[] = [];

  @Input() public rulePage = '';

  baunitHead!: BaunitHead;
  executionId: string | null | undefined;
  idContainer = '';
  baunitId: string | null = null;
  navigationItems: { label: string; fragment: string }[] = NAVIGATION_ITEMS_INFORMATION_PROPERTIES;
  editable: {
    GNR?: boolean,
    FNA?: boolean,
    PRO?: boolean,
    CNS?: boolean,
    DIR?: boolean,
    ZON?: boolean,
    CLN?: boolean,
    AUTAVAL?: boolean,
  } = {};

  propertyRegistryOffice: string | null | undefined = null;
  propertyRegistryNumber: string | null | undefined = null;

  schemaTemp: string = `${envi.schemas.temp}`;
  schemaHist: string = `${envi.schemas.hist}`;

  public viewProperties = false;
  public showRulesPage = false;
  public expand_tap_property_information = true;
  public expand_tap = false;

  constructor(
    private informationPropertyService: InformationPropertyService
  ) {
  }

  ngOnInit(): void {
    this.infoResources();
    if (!this.contentInfoSchema || !this.contentInfoSchema.content) {
      return;
    }

    this.baunitHead = this.contentInfoSchema.content;
    this.baunitId = this.baunitHead?.baunitIdE || null;
    this.executionId = this.contentInfoSchema.executionId;


    if ((this.schema === this.schemaTemp && !this.contentInfoSchema.executionId) ||
      (this.schema === this.schemaHist && !this.contentInfoSchema.executionId)) {
      return;
    }
    this.informationPropertyService.showOptionsPersonStarted$
      .subscribe(value2 => {
        if (value2) {
          this.viewProperties = value2;
          this.removeItem(FRAGMENT_INFORMATION_PROPERTY_OWNERS);
        }
      });
    this.informationPropertyService.showOptionsRulePage$
      .subscribe(value2 => {
        if (value2) {
          this.processRulePage();
        }
      });

    this.basicPropertyInformationComponent?.nativeElement.scrollIntoView({
      top: this.basicPropertyInformationComponent?.nativeElement.offsetTop,
      behavior: 'smooth'
    });
    if (this.baunitCondition)

      if (this.id?.length > 0) {
        this.id = this.id + getRandomInt(10000) + 'id' + getRandomInt(50) + this.schema;
        this.idContainer = this.id + getRandomInt(10000) + 'id' + getRandomInt(50) + this.schema + 'Contenedor';
      } else {
        this.id = getRandomInt(10000) + 'idCadastralInformation' + getRandomInt(50) + this.schema;
        this.idContainer = getRandomInt(10000) + 'idCadastralInformation' + getRandomInt(50) + this.schema + 'Contenedor';
      }

  }

  processRulePage() {
    if (this.rulePage && this.rulePage === RULE_PAGE_CADASTRAL_DA) {
      this.showRulesPage = true;
      this.removeListItem(LIST_FRAGMENT_COMPONENTS_RULE_PAGE);
    }
  }

  infoResources(): void {
    if (this.resources.length < 0 || REFERENCE_COMPONENTS.length < 0) {
      return;
    }
    REFERENCE_COMPONENTS.forEach((key) => {
      this.editable[key as keyof typeof this.editable] = this.resources.includes(key);
    });
  }

  scrollTo(elementName: string) {
    const elem: ElementRef<any> | undefined = this[
      elementName as keyof CadastralInformationPropertyComponent
      ] as unknown as ElementRef | undefined;

    if (elem == null || !elem.nativeElement) {
      return;
    }

    if (elementName === FRAGMENT_BASIC_PROPERTY_INFORMATION) {
      elem?.nativeElement.scrollIntoView({
        top: elem.nativeElement.offsetTop + 10,
        behavior: 'smooth'
      });
      return;
    }

    elem?.nativeElement.scrollIntoView({
      top: elem.nativeElement.offsetTop - 24,
      behavior: 'smooth'
    });
  }

  showInformationUnitProperty(baunitCondition: string | undefined): boolean {
    if (baunitCondition === '(Condominio) Matriz' || baunitCondition === '(Propiedad horizontal) Matriz') return true;
    this.navigationItems = this.navigationItems.filter((item) => item.fragment !== FRAGMENT_INFORMATION_UNIT_PROPERTY);
    return false;
  }

  get showInformationHistoricalProcedures(): boolean {
    if (this.schema !== this.schemaHist) return true;
    this.navigationItems = this.navigationItems.filter((item) => item.fragment !== FRAGMENT_HISTORICAL_PROCEDURES_PROPERTY);
    return false;
  }

  removeListItem(listFragmentToRemove: string[]): void {
    listFragmentToRemove.forEach((item) => this.removeItem(item));
  }

  removeItem(fragmentToRemove: string): void {
    this.navigationItems = this.navigationItems.filter(item => item.fragment !== fragmentToRemove);
  }


}
