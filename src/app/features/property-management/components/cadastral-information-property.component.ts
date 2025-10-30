/* eslint-disable @typescript-eslint/no-explicit-any */
/* ---- Angular framework ---- */
import {
  Component,
  computed,
  ElementRef,
  OnInit,
  signal,
  input,
  inject,
  forwardRef,
  ViewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
// import { NG_VALUE_ACCESSOR } from '@angular/forms';

/* ---- Material Angular ---- */
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';

/* ---- Vex ---- */
import { VexHighlightModule } from '@vex/components/vex-highlight/vex-highlight.module';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

/* ---- Shared components ---- */
import { InformationAddressesPropertyComponent } from '@features/property-management/components/addresses/information-addresses-property.component';
import { BasicPropertyInformationComponent } from '@features/property-management/components/basic-information/basic-property-information.component';
import { InformationPropertyOwnersComponent } from '@features/property-management/components/owners/information-property-owners.component';
import { InformationConstructionsPropertyComponent } from '@features/property-management/components/constructions/information-constructions-property.component';
import { AdministrativeSourcesComponent } from './administrative-sources/administrative-sources.component';
import { PhotosComponent } from './photos/photos.component';
import { AlertsComponent } from './alerts/alerts.component';
import { InformationUnitPropertyComponent } from './information-unit-property/information-unit-property.component';
import { FluidHeightDirective } from '@shared/directives/fluid-height.directive';
import { InformationZonesPropertyComponent } from './zones/information-zones-property.component';
import { PropertyAppraisalInformationComponent } from './appraisal/property-appraisal-information.component';
import { SuperNotariadoPropertyComponent } from './super-notariado-property/super-notariado-property.component';
import { InformationAdjacentPropertyComponent } from './adjacent-properties/information-adjacent-property.component';
import { HistoricalActiveProceduresPropertyComponent } from './historical/historical-active-procedures.component';
import { BaunitIcaComponent } from './ica/baunit-ica.component';

/* ---- Shared services ---- */
import { InformationPropertyService } from '@services/index';

/* ---- Shared interfaces ---- */
import { BaunitHead } from '@shared/interfaces';
import {
  NavigationItemCadastralInfo,
  TypeInformation
} from '@shared/interfaces';

/* ---- Shared models ---- */
import { ContentInfoSchema } from '@shared/models';

/* ---- Shared constants ---- */
import {
  FRAGMENT_BASIC_PROPERTY_INFORMATION,
  FRAGMENT_HISTORICAL_PROCEDURES_PROPERTY,
  FRAGMENT_INFORMATION_PROPERTY_OWNERS,
  FRAGMENT_INFORMATION_UNIT_PROPERTY,
  LIST_FRAGMENT_COMPONENTS_RULE_PAGE,
  NAVIGATION_ITEMS_INFORMATION_PROPERTIES,
  REFERENCE_COMPONENTS,
  RULE_PAGE_CADASTRAL_DA
} from '@shared/constants';

/* ---- Environments ---- */
import { environment as envi } from '@environments/environments';

/* ---- Directives ---- */
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
    AdministrativeSourcesComponent,
    AlertsComponent,
    BasicPropertyInformationComponent,
    BaunitIcaComponent,
    FluidHeightDirective,
    HistoricalActiveProceduresPropertyComponent,
    InformationAddressesPropertyComponent,
    InformationAdjacentPropertyComponent,
    InformationConstructionsPropertyComponent,
    InformationPropertyOwnersComponent,
    InformationUnitPropertyComponent,
    InformationZonesPropertyComponent,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatRippleModule,
    NgClass,
    PhotosComponent,
    PropertyAppraisalInformationComponent,
    SuperNotariadoPropertyComponent,
    VexHighlightModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CadastralInformationPropertyComponent),
      multi: true
    }
  ]
})
export class CadastralInformationPropertyComponent implements OnInit {
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

  @ViewChild('baunitIcaComponent', {
    read: ElementRef,
    static: false
  })
  private baunitIcaComponent?: ElementRef;

  /* ---- Injects ---- */
  private readonly informationPropertyService = inject(
    InformationPropertyService
  );

  /* ---- Inputs ---- */
  public readonly typeInformation = input.required<TypeInformation>();
  public readonly showTittle = input.required<boolean>();
  public readonly label = input.required<string>();
  public readonly schema = input.required<string>();
  public readonly contentInfoSchema = input.required<ContentInfoSchema>();
  public readonly baunitCondition = input.required<string | undefined>();
  public readonly cssClasses = input<string>();
  public readonly levelInfo = input<number | null | undefined>(0);
  public readonly resources = input<string[]>([]);
  public readonly rulePage = input('');

  baunitHead!: BaunitHead;
  executionId: string | null | undefined;
  baunitId: string | null = null;
  navigationItems: NavigationItemCadastralInfo[] =
    NAVIGATION_ITEMS_INFORMATION_PROPERTIES.filter((item) => {
      if (!envi.ica.visible && item.label === 'ICA') {
        return false;
      }
      return true;
    });
  editable: {
    GNR?: boolean;
    FNA?: boolean;
    PRO?: boolean;
    CNS?: boolean;
    DIR?: boolean;
    ZON?: boolean;
    CLN?: boolean;
    AUTAVAL?: boolean;
    NPN?: boolean;
    AREA?: boolean;
    PPL?: boolean;
    CON?: boolean;
  } = {};

  propertyRegistryOffice: string | null | undefined = null;
  propertyRegistryNumber: string | null | undefined = null;

  schemaTemp = `${envi.schemas.temp}`;
  schemaHist = `${envi.schemas.hist}`;

  // Zone.js variables
  public viewProperties = false;
  public showRulesPage = false;

  // Signals
  activeComponent = signal<number>(0);
  isMatriz = signal<boolean>(false);

  // Computed
  showEditPerson = computed(() => {
    if (!this.editable.PPL) {
      return false;
    }
    return this.editable.PPL as boolean;
  });

  // constructor(private informationPropertyService: InformationPropertyService) {}

  ngOnInit(): void {
    this.infoResources();
    const contentInfoSchema = this.contentInfoSchema();
    if (!contentInfoSchema || !contentInfoSchema.content) {
      return;
    }

    this.baunitHead = contentInfoSchema.content;
    this.baunitId = this.baunitHead?.baunitIdE || null;
    this.executionId = contentInfoSchema.executionId;

    const schema = this.schema();
    if (
      (schema === this.schemaTemp && !contentInfoSchema.executionId) ||
      (schema === this.schemaHist && !contentInfoSchema.executionId)
    ) {
      return;
    }
    this.informationPropertyService.showOptionsPersonStarted$.subscribe(
      (value2) => {
        if (value2) {
          this.viewProperties = value2;
          this.removeItem(FRAGMENT_INFORMATION_PROPERTY_OWNERS);
        }
      }
    );
    this.informationPropertyService.showOptionsRulePage$.subscribe((value2) => {
      if (value2) {
        this.processRulePage();
      }
    });

    this.basicPropertyInformationComponent?.nativeElement.scrollIntoView({
      top: this.basicPropertyInformationComponent?.nativeElement.offsetTop,
      behavior: 'smooth'
    });
  }

  processRulePage() {
    const rulePage = this.rulePage();
    if (rulePage && rulePage === RULE_PAGE_CADASTRAL_DA) {
      this.showRulesPage = true;
      this.removeListItem(LIST_FRAGMENT_COMPONENTS_RULE_PAGE);
    }
  }

  infoResources(): void {
    if (this.resources().length < 0 || REFERENCE_COMPONENTS.length < 0) {
      return;
    }
    REFERENCE_COMPONENTS.forEach((key) => {
      this.editable[key as keyof typeof this.editable] =
        this.resources().includes(key);
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

  get showInformationUnitProperty(): boolean {
    const baunitCondition = this.baunitCondition();
    if (
      baunitCondition === '(Condominio) Matriz' ||
      baunitCondition === '(Propiedad horizontal) Matriz'
    )
      return true;
    this.navigationItems = this.navigationItems.filter(
      (item) => item.fragment !== FRAGMENT_INFORMATION_UNIT_PROPERTY
    );
    return false;
  }

  get showInformationHistoricalProcedures(): boolean {
    if (this.schema() !== this.schemaHist) return true;
    this.navigationItems = this.navigationItems.filter(
      (item) => item.fragment !== FRAGMENT_HISTORICAL_PROCEDURES_PROPERTY
    );
    return false;
  }
  get showBaunitIca(): boolean {
    return envi.ica.visible;
  }

  removeListItem(listFragmentToRemove: string[]): void {
    listFragmentToRemove.forEach((item) => this.removeItem(item));
  }

  removeItem(fragmentToRemove: string): void {
    this.navigationItems = this.navigationItems.filter(
      (item) => item.fragment !== fragmentToRemove
    );
  }
}
