import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { DatePipe, NgClass, PercentPipe } from '@angular/common';
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
import {
  BasicInformationProperty,
  CrudBasicInformationProperty
} from '../../../interfaces/information-property/basic-information-property';
import {
  GUION,
  MODAL_MEDIUM_SMALL,
  MODAL_MIN_SMALL_40_25,
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  NAME_NO_DISPONIBLE_CERO, TYPE_UPDATE,
  TYPE_UPDATE_PROPERTY_UNIT
} from '../../../constants/general/constants';
import { environment } from '../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import {
  EditBasicPropertyInformationComponent
} from './edit-basic-property-information/edit-basic-property-information.component';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { GeographicViewerComponent } from '../../geographics/geographic-viewer/geographic-viewer.component';
import { ContentInfoSchema } from '../../../interfaces/general/content-info-schema';
import { MatDividerModule } from '@angular/material/divider';
import { getRandomInt } from '../../../utils/general';

@Component({
  selector: 'vex-basic-property-information',
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
    MatDividerModule,
    PercentPipe
  ],
  templateUrl: './basic-property-information.component.html',
  styleUrl: './basic-property-information.component.scss'
})
export class BasicPropertyInformationComponent implements OnInit {

  data!: BasicInformationProperty;

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

  existDetailGroup = signal<boolean>(false);
  existMasterGroup = signal<boolean>(false);

  constructor(
    private informationPropertyService: InformationPropertyService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }

    if (this.id?.length > 0) {
      this.id = this.id + getRandomInt(10000) + this.schema +
        'basic-property' + getRandomInt(10);
    } else {
      this.id = getRandomInt(100100) + this.schema +
        +'basic-property' + getRandomInt(10);
    }
  }

  searchBasicInformationProperty(): void {
    if (!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService.getBasicInformationProperty(
      this.schema, this.baunitId, this.executionId)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: BasicInformationProperty) => this.captureInformationSubscribe(result)
      });
  }

  captureInformationSubscribeError(): void {
    this.data = new BasicInformationProperty();
  }

  captureInformationSubscribe(result: BasicInformationProperty): void {
    if (result.detailGroup !== null && result.detailGroup !== undefined) {
      this.existDetailGroup.set(true);
    }
    if (result.masterGroup !== null && result.masterGroup !== undefined) {
      this.existMasterGroup.set(true);
    }
    this.data = result;
    this.propertyRegistryOffice.emit(this.data.propertyRegistryOffice);
    this.propertyRegistryNumber.emit(this.data.propertyRegistryNumber);
  }

  editBasicInformationProperty(): void {
    if (!this.executionId) {
      return;
    }
    let data: BasicInformationProperty = this.data;
    data.executionId = this.executionId;
    let dataBasicInformationProperty: CrudBasicInformationProperty = {
      type: TYPE_UPDATE,
      contentInformation: data
    };
    this.dialog.open(EditBasicPropertyInformationComponent, {
      ...MODAL_MEDIUM_SMALL,
      disableClose: true,
      data: dataBasicInformationProperty
    }).afterClosed()
      .subscribe({
        next: (result: BasicInformationProperty) => {
          if (result && result?.baunitIdE) {
            setTimeout(() => this.data = result, 300);
          }
        }
      });
  }

  editDetailGroupProperty(): void {
    if (this.existDetailGroup() && this.executionId) {
      let data: BasicInformationProperty = this.data;
      data.executionId = this.executionId;
      let dataBasicInformationProperty: CrudBasicInformationProperty = {
        type: TYPE_UPDATE_PROPERTY_UNIT,
        contentInformation: data
      };
      this.dialog.open(EditBasicPropertyInformationComponent, {
        ...MODAL_MIN_SMALL_40_25,
        disableClose: true,
        data: dataBasicInformationProperty
      }).afterClosed()
        .subscribe({
          next: (result: BasicInformationProperty) => {
            if (result && result?.baunitIdE) {
              setTimeout(() => this.data = result, 300);
            }
          }
        });
    }
  }

  openGeographicViewerMain(data: BasicInformationProperty): void {
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
      this.searchBasicInformationProperty();
    }
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_NO_DISPONIBLE_CERO = NAME_NO_DISPONIBLE_CERO;
  protected readonly GUION = GUION;
}
