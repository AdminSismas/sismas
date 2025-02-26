import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { BasicInformationProperty } from '../../../interfaces/information-property/basic-information-property';
import {
  GUION,
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  NAME_NO_DISPONIBLE_CERO,
  TYPEINFORMATION_EDITION
} from '../../../constants/general/constant';
import { environment } from '../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import {
  EditBasicPropertyInformationComponent
} from './edit-basic-property-information/edit-basic-property-information.component';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { GeographicViewerComponent } from '../../geographics/geographic-viewer/geographic-viewer.component';
import { ContentInfoSchema } from '../../../interfaces/general/content-info-schema';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'vex-basic-property-information',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms,
  ],
  imports: [
    NgClass,
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
    DatePipe,
    CurrencyLandsPipe,
    MatDividerModule
  ],
  templateUrl: './basic-property-information.component.html',
  styleUrl: './basic-property-information.component.scss'
})
export class BasicPropertyInformationComponent implements OnInit {

  data!:BasicInformationProperty;

  @Input({ required: true }) id = '';
  @Input() expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() propertyUnit = false;
  @Input() typeInformation = 'visualization';
  @Input() editable? = true;

  @Output() propertyRegistryNumber: EventEmitter<string> = new EventEmitter<string>();
  @Output() propertyRegistryOffice: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private informationPropertyService:InformationPropertyService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }

  }

  searchBasicInformationProperty():void {
    if(!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService.getBasicInformationProperty(
      this.schema , this.baunitId, this.executionId)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: BasicInformationProperty) => this.captureInformationSubscribe(result)
      });
  }

  captureInformationSubscribeError(): void {
    this.data = new BasicInformationProperty();
  }

  captureInformationSubscribe(result: BasicInformationProperty): void {
    this.data = result;
    this.propertyRegistryOffice.emit(this.data.propertyRegistryOffice);
    this.propertyRegistryNumber.emit(this.data.propertyRegistryNumber);
  }

  editBasicInformationProperty(): void {
    this.dialog.open(EditBasicPropertyInformationComponent, {
      ...MODAL_SMALL,
      data: { executionId: this.executionId ,...this.data, TYPEINFORMATION_EDITION},
      disableClose: true // Ensure this is set to false or omitted
    }).afterClosed()
      .subscribe({
        next: (result: BasicInformationProperty) => {
          if(result && result?.baunitIdE) {
            setTimeout(() => this.data = result, 300);
          }
        }
      });
      console.log(this.data, 'servicio con datos nuevos');
  }

  private getRandomInt(max: number):number {
    return Math.floor(Math.random() * max);
  }

    openGeographicViewerMain(data: any): void {
      this.dialog
        .open(GeographicViewerComponent, {
          ...MODAL_SMALL,
          disableClose: true,
          data: new ContentInfoSchema(data.baunitIdE, data)
        })
        .afterClosed();
    }

    isExpandPanel(expandedComponent: boolean): void {
      if (expandedComponent) {
        this.id = this.id + this.getRandomInt(10000) + this.schema;
        this.searchBasicInformationProperty();
      }
    }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_NO_DISPONIBLE_CERO = NAME_NO_DISPONIBLE_CERO;
  protected readonly GUION = GUION;
}
