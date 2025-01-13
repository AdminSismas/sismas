// Angular framework
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Vex
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { VexHighlightModule } from '@vex/components/vex-highlight/vex-highlight.module';
// Material
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// Custom
import { AdministrativeSourcesComponent } from '../administrative-sources/administrative-sources.component';
import { BasicPropertyInformationComponent } from '../basic-property-information/basic-property-information.component';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { ContentInfoSchema } from '../../../interfaces/content-info-schema';
import { environment as envi } from '../../../../../environments/environments';
import { InformationAddressesPropertyComponent } from '../information-addresses-property/information-addresses-property.component';
import { InformationConstructionsPropertyComponent } from '../information-constructions-property/information-constructions-property.component';
import { InformationPropertyOwnersComponent } from '../information-property-owners/information-property-owners.component';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { InformationUnitPropertyComponent } from '../information-unit-property/information-unit-property.component';
import { InformationZonesPropertyComponent } from '../information-zones-property/information-zones-property.component';
import { NAVIGATION_ITEMS_INFORMACION_PROPERTIY, TYPEINFORMATION_VISUAL } from '../../../constants/constant';
import { PropertyAppraisalInformationComponent } from '../property-appraisal-information/property-appraisal-information.component';
import { SuperNotariadoPropertyComponent } from '../super-notariado-property/super-notariado-property.component';
import { TypeInformation } from '../../../interfaces/content-info';

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
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    // Vex
    VexHighlightModule,
    // Material
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatRippleModule,
    MatRippleModule,
    MatSnackBarModule,
    // Custom
    AdministrativeSourcesComponent,
    BasicPropertyInformationComponent,
    InformationAddressesPropertyComponent,
    InformationConstructionsPropertyComponent,
    InformationPropertyOwnersComponent,
    InformationUnitPropertyComponent,
    PropertyAppraisalInformationComponent,
    SuperNotariadoPropertyComponent,
  ]
})
export class CadastralInformationPropertyComponent implements OnInit {
  @ViewChild(BasicPropertyInformationComponent, {
    read: ElementRef,
    static: false
  })
  private basicPropertyInformationComponent?: ElementRef;
  @ViewChild(SuperNotariadoPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private superNotariadoPropertyComponent?: ElementRef;
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
  @ViewChild(PropertyAppraisalInformationComponent, {
    read: ElementRef,
    static: false
  })
  private propertyAppraisalInformationComponent?: ElementRef;
  @ViewChild(InformationZonesPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationPersonPropertyComponent?: ElementRef;

  @Input({ required: true }) typeInformation: TypeInformation =
    TYPEINFORMATION_VISUAL;
  @Input({ required: true }) public showTittle = true;
  @Input({ required: true }) public label!: string;
  @Input() public id = '';
  @Input({ required: true }) public schema = '';
  @Input({ required: true }) contentInfoSchema!: ContentInfoSchema;
  @Input({ required: true }) public baunitCondition?: string;

  baunitHead!: BaunitHead;
  executionId: string | null | undefined;
  idContainer = '';
  baunitId: string | null | undefined = null;
  navigationItems: { label: string; fragment: string }[] =
    NAVIGATION_ITEMS_INFORMACION_PROPERTIY;

  propertyRegistryOffice: string | null | undefined = null;
  propertyRegistryNumber: string | null | undefined = null;

  public viewProperties = false;

  constructor(private informationPropertyService: InformationPropertyService) {}

  ngOnInit(): void {
    if (!this.contentInfoSchema || !this.contentInfoSchema.content) {
      return;
    }

    if (
      this.schema !== `${envi.schemas.main}` &&
      !this.contentInfoSchema.executionId
    ) {
      return;
    }
    this.informationPropertyService.showOptionsPersonStarted$.subscribe(
      (value2) => {
        if (value2) {
          this.viewProperties = value2;
          this.removeItem('Propietarios');
        }
      }
    );

    this.baunitHead = this.contentInfoSchema.content;
    this.baunitId = this.baunitHead.baunitIdE;
    this.executionId = this.contentInfoSchema.executionId;

    this.basicPropertyInformationComponent?.nativeElement.scrollIntoView({
      top: this.basicPropertyInformationComponent?.nativeElement.offsetTop,
      behavior: 'smooth'
    });
    if (this.baunitCondition)
      if (this.id?.length > 0) {
        this.id =
          this.id +
          this.getRandomInt(10000) +
          'id' +
          this.getRandomInt(50) +
          this.schema;
        this.idContainer =
          this.id +
          this.getRandomInt(10000) +
          'id' +
          this.getRandomInt(50) +
          this.schema +
          'Contenedor';
      } else {
        this.id =
          this.getRandomInt(10000) +
          'idCadastralInformation' +
          this.getRandomInt(50) +
          this.schema;
        this.idContainer =
          this.getRandomInt(10000) +
          'idCadastralInformation' +
          this.getRandomInt(50) +
          this.schema +
          'Contenedor';
      }
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
    )
      return true;

    this.navigationItems = this.navigationItems.filter(
      (item) => item.label !== 'Información de unidad predial'
    );

    return false;
  }
}
