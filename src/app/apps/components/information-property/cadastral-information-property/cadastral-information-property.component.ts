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
import { NgForOf, NgIf } from '@angular/common';
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
import { ContentInfoSchema } from '../../../interfaces/content-info-schema';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { environment as envi } from '../../../../../environments/environments';
import { AdministrativeSourcesComponent } from '../administrative-sources/administrative-sources.component';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { PhotosComponent } from '../photos/photos.component';
import { AlertsComponent } from '../alerts/alerts.component';
import { InformationUnitPropertyComponent } from '../information-unit-property/information-unit-property.component';
import { InformationZonesPropertyComponent } from '../information-zones-property/information-zones-property.component';
import {
  NAVIGATION_ITEMS_INFORMACION_PROPERTIY,
  REFERENCE_COMPONENTS,
  TYPEINFORMATION_VISUAL
} from '../../../constants/constant';
import { PropertyAppraisalInformationComponent } from '../property-appraisal-information/property-appraisal-information.component';
import { SuperNotariadoPropertyComponent } from '../super-notariado-property/super-notariado-property.component';
import { TypeInformation } from '../../../interfaces/content-info';
import { InformationAdjacentPropertyComponent } from '../information-adjacent-property/information-adjacent-property.component';
import { HistoricalProceduresPropertyComponent } from '../historical-procedures/historical-procedures.component';

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
    NgForOf,
    NgIf,
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
    HistoricalProceduresPropertyComponent
  ]
})
export class CadastralInformationPropertyComponent implements OnInit {
  @ViewChild(BasicPropertyInformationComponent, {
    read: ElementRef,
    static: false
  })
  private basicPropertyInformationComponent?: ElementRef;
  @ViewChild(InformationUnitPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationUnitPropertyComponent?: ElementRef;
  @ViewChild(AdministrativeSourcesComponent, {
    read: ElementRef,
    static: false
  })
  private administrativeSourcesComponent?: ElementRef;
  @ViewChild(InformationPropertyOwnersComponent, {
    read: ElementRef,
    static: false
  })
  private informationPropertyOwnersComponent?: ElementRef;
  @ViewChild(SuperNotariadoPropertyComponent, {
  read: ElementRef,
    static: false
  })
  private superNotariadoPropertyComponent?: ElementRef;
  @ViewChild(InformationAddressesPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationAddressesPropertyComponent?: ElementRef;
  @ViewChild(InformationConstructionsPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationConstructionsPropertyComponent?: ElementRef;
  @ViewChild(InformationAdjacentPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationAdjacentPropertyComponent?: ElementRef;
  @ViewChild(PropertyAppraisalInformationComponent, {
    read: ElementRef,
    static: false
  })
  private propertyAppraisalInformationComponent?: ElementRef;
  @ViewChild(InformationZonesPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationZonesPropertyComponent?: ElementRef;
  @ViewChild(PhotosComponent, { read: ElementRef, static: false })
  private photosComponent?: ElementRef;

  @ViewChild(AlertsComponent, { read: ElementRef, static: false })
  private alertsComponent?: ElementRef;


  @Input({ required: true }) typeInformation: TypeInformation = TYPEINFORMATION_VISUAL;
  @Input({ required: true }) public showTittle = true;
  @Input({ required: true }) public label!: string;
  @Input() public id = '';
  @Input({ required: true }) public schema = '';
  @Input({ required: true }) contentInfoSchema!: ContentInfoSchema;
  @Input({ required: true }) public baunitCondition?: string;
  @Input() public resources: string[] = [];

  @Input() public rulePage = '';

  baunitHead!: BaunitHead;
  executionId: string | null | undefined;
  idContainer = '';
  baunitId: string | null | undefined = null;
  divPolLv1!: string;
  divPolLv2!: string;
  navigationItems: { label: string; fragment: string }[] =
    NAVIGATION_ITEMS_INFORMACION_PROPERTIY;
  editable: { GNR?: boolean, FNA?: boolean, PRO?: boolean, CNS?: boolean, DIR?: boolean, ZON?: boolean, CLN?: boolean } = {};

  propertyRegistryOffice: string | null | undefined = null;
  propertyRegistryNumber: string | null | undefined = null;

  public viewProperties = false;
  public showRulesPage = false;


  constructor(private informationPropertyService: InformationPropertyService){ }

  ngOnInit(): void {
    this.infoResorces();
    if (!this.contentInfoSchema || !this.contentInfoSchema.content) {
      return;
    }

    if(this.schema !== `${envi.schemas.main}` && !this.contentInfoSchema.executionId){
      return;
    }
    this.informationPropertyService.showOptionsPersonStarted$
    .subscribe(value2=>{
      if(value2){
        this.viewProperties = value2;
        this.removeItem('Propietarios');
      }
    });
    this.informationPropertyService.showOptionsRulePage$
    .subscribe(value2=>{
      if(value2){
        console.log('this.navigationItems', this.navigationItems);
        console.log('this.rulePage', this.rulePage);

        this.proccessRulePage();
      }
    });

    this.baunitHead = this.contentInfoSchema.content;
    this.baunitId = this.baunitHead.baunitIdE;
    this.executionId = this.contentInfoSchema.executionId;
    this.divPolLv1 = this.baunitHead.cadastralNumber!.substring(0, 2);
    this.divPolLv2 = this.baunitHead.cadastralNumber!.substring(2, 5);

    console.log(this.baunitHead);



    this.basicPropertyInformationComponent?.nativeElement.scrollIntoView({
      top: this.basicPropertyInformationComponent?.nativeElement.offsetTop,
      behavior: 'smooth'
    });
    if (this.baunitCondition)

    if (this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(10000) + 'id' + this.getRandomInt(50) + this.schema;
      this.idContainer = this.id + this.getRandomInt(10000) + 'id' + this.getRandomInt(50) + this.schema + 'Contenedor';
    } else {
      this.id = this.getRandomInt(10000) + 'idCadastralInformation' + this.getRandomInt(50) + this.schema;
      this.idContainer = this.getRandomInt(10000) + 'idCadastralInformation' + this.getRandomInt(50) + this.schema + 'Contenedor';
    }
    
  }
  proccessRulePage() {
    if(this.rulePage) {
      if(this.rulePage === 'cadastralSearchDA') {
        this.showRulesPage = true;
        this.removeItem('Fotos');
        this.removeItem('Alertas');
        this.removeItem('Super notariado');
        this.removeItem('Propietarios');
      }

    }
  }

  infoResorces(): void {
    if (this.resources.length < 0) return;

    const referenceComponents = REFERENCE_COMPONENTS;

    referenceComponents.forEach((key) => {
      this.editable[key as keyof typeof this.editable] = this.resources.includes(key);
    });
  }
  // Método para eliminar el objeto con la etiqueta "Propietarios"
  removeItem(labelToRemove: string): void {
    this.navigationItems = this.navigationItems.filter(
      (item) => item.label !== labelToRemove
    );
  }

  scrollTo(elementName: string) {
    const elem: ElementRef<any> | undefined = this[
      elementName as keyof CadastralInformationPropertyComponent
      ] as unknown as ElementRef | undefined;

    if (elem == null || !elem.nativeElement) {
      return;
    }

    if (elementName === 'basicPropertyInformationComponent') {
      elem?.nativeElement.scrollIntoView({
        top: elem.nativeElement.offsetTop - 20,
        behavior: 'smooth'
      });
      return;
    }

    elem?.nativeElement.scrollIntoView({
      top: elem.nativeElement.offsetTop - 24,
      behavior: 'smooth'
    });
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  showInformationUnitProperty(baunitCondition: string | undefined): boolean {
    if (
      baunitCondition === '(Condominio) Matriz' ||
      baunitCondition === '(Propiedad horizontal) Matriz'
    ) return true;

    this.navigationItems = this.navigationItems.filter((item) => item.label !== 'Información de unidad predial');

    return false;
  }

  
}
