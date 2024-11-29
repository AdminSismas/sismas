import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { GUION, NAME_NO_DISPONIBLE } from '../../../constants/constant';
import { environment } from '../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { EditBasicPropertyInformationComponent } from './edit-basic-property-information/edit-basic-property-information.component';

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
    DatePipe
  ],
  templateUrl: './basic-property-information.component.html',
  styleUrl: './basic-property-information.component.scss'
})
export class BasicPropertyInformationComponent implements OnInit {

  data!:BasicInformationProperty;

  @Input({ required: true }) id: string = '';
  @Input() expandedComponent: boolean = true;
  @Input({ required: true }) schema: string = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() propertyUnit: boolean = false;
  @Input() typeInformation: string = 'visualization';

  constructor(
    private informationPropertyService:InformationPropertyService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema;
    this.searchBasicInformationProperty();
  }

  searchBasicInformationProperty():void {
    if(!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService.getBasicInformationProperty(
      this.schema , this.baunitId, this.executionId)
      .subscribe({
        error: (err: any) => this.captureInformationSubscribeError(err),
        next: (result: BasicInformationProperty) => this.captureInformationSubscribe(result)
      });
  }

  captureInformationSubscribeError(err: any): void {
    this.data = new BasicInformationProperty();
  }

  captureInformationSubscribe(result: BasicInformationProperty): void {
    this.data = result;
  }

  editBasicInformationProperty(): void {
    this.dialog.open(EditBasicPropertyInformationComponent, {
      width: '60%',
      data: { executionId: this.executionId ,...this.data }
    }).afterClosed()
      .subscribe({
        next: (result: BasicInformationProperty) => {
          console.log(result);
          setTimeout(() => this.data = result, 300);
        }
      })
  }

  private getRandomInt(max: number):number {
    return Math.floor(Math.random() * max);
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly GUION = GUION;
}
