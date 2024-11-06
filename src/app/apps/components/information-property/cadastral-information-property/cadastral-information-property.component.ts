import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InConstructionComponent } from '../../in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexShowdownComponent, VexShowdownSourceDirective } from '@vex/components/vex-showdown';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
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
import { NAVIGATION_ITEMS_INFORMACION_PROPERTIY, TYPEINFORMATION_VISUAL } from '../../../constants/constant';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { BasicPropertyInformationComponent } from '../basic-property-information/basic-property-information.component';
import { InformationUnitPropertyComponent } from '../information-unit-property/information-unit-property.component';
import {
  InformationPropertyOwnersComponent
} from '../information-property-owners/information-property-owners.component';
import {
  InformationConstructionsPropertyComponent
} from '../information-constructions-property/information-constructions-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  PropertyAppraisalInformationComponent
} from '../property-appraisal-information/property-appraisal-information.component';
import { InformationZonesPropertyComponent } from '../information-zones-property/information-zones-property.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TypeInformation } from '../../../interfaces/content-info';
import { ContentInfoSchema } from '../../../interfaces/content-info-schema';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { environment as envi } from '../../../../../environments/environments';

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
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatExpansionModule,
    ReactiveFormsModule,
    MatMenuModule,
    VexShowdownComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    MatDividerModule,
    MatDialogContent,
    VexShowdownSourceDirective,
    MatRippleModule,
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    VexPageLayoutContentDirective,
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
    InformationUnitPropertyComponent
  ]
})
export class CadastralInformationPropertyComponent implements OnInit {
  @ViewChild(BasicPropertyInformationComponent, {
    read: ElementRef,
    static: false
  })
  private basicPropertyInformationComponent?: ElementRef;
  @ViewChild(InformationAddressesPropertyComponent, {
    read: ElementRef,
    static: false
  })
  private informationAddressesPropertyComponent?: ElementRef;
  @ViewChild(InformationPropertyOwnersComponent, {
    read: ElementRef,
    static: false
  })
  private informationPropertyOwnersComponent?: ElementRef;
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
  private baunitChildrenInformationComponent?: ElementRef;
  @ViewChild(InformationUnitPropertyComponent, {
    read: ElementRef,
    static: false
  })

  private informationZonesPropertyComponent?: ElementRef;


  @Input({ required: true }) typeInformation: TypeInformation = TYPEINFORMATION_VISUAL;
  @Input({ required: true }) public showTittle: boolean = true;
  @Input({ required: true }) public label!: string;
  @Input() public id: string = '';
  @Input({ required: true }) public schema: string = '';
  @Input({ required: true }) contentInfoSchema!: ContentInfoSchema
  @Input() propertyUnit: boolean = false;

  baunitHead!: BaunitHead;
  executionId: string | null | undefined;
  idContainer: string = '';
  baunitId: string | null | undefined = null;
  navigationItems: { label: string; fragment: string }[] = NAVIGATION_ITEMS_INFORMACION_PROPERTIY;
  npnBaunit?: bigint;

  constructor() {
  }

  ngOnInit(): void {
    if(!this.contentInfoSchema || !this.contentInfoSchema.content) {
      return;
    }

    if(this.schema !== `${envi.schemas.main}` && !this.contentInfoSchema.executionId){
      return;
    }

    this.baunitHead = this.contentInfoSchema.content
    this.baunitId = this.baunitHead.baunitIdE;
    this.executionId = this.contentInfoSchema.executionId;

    this.basicPropertyInformationComponent?.nativeElement.scrollIntoView({
      top: this.basicPropertyInformationComponent?.nativeElement.offsetTop,
      behavior: 'smooth'
    });

    if (this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(10000) + 'id' + this.getRandomInt(50) + this.schema;
      this.idContainer = this.id + this.getRandomInt(10000) + 'id' + this.getRandomInt(50) + this.schema + 'Contenedor';
    } else {
      this.id = this.getRandomInt(10000) + 'idCadastralInformation' + this.getRandomInt(50) + this.schema;
      this.idContainer = this.getRandomInt(10000) + 'idCadastralInformation' + this.getRandomInt(50) + this.schema + 'Contenedor';
    }
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

}
