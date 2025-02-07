import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import {
  ContentInformationConstruction
} from '../../../../interfaces/information-property/content-information-construction';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { InformationPropertyService } from '../../../../services/territorial-organization/information-property.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { GUION, NAME_NO_DISPONIBLE, TWO_POINT_ } from '../../../../constants/constant';
import { MatTabsModule } from '@angular/material/tabs';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  HeaderCadastralInformationPropertyComponent
} from '../../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CcCalificacionUB } from '../../../../interfaces/information-property/cc-calificacion-ub';
import { MatGridListModule } from '@angular/material/grid-list';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { Observable } from 'rxjs';
import { VexLayoutService } from '@vex/services/vex-layout.service';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'vex-detail-information-constructions-property',
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
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatTabsModule,
    VexPageLayoutContentDirective,
    DatePipe,
    HeaderCadastralInformationPropertyComponent,
    MatExpansionModule,
    NgForOf,
    MatGridListModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './detail-information-constructions-property.component.html',
  styleUrl: './detail-information-constructions-property.component.scss'
})
export class DetailInformationConstructionsPropertyComponent implements OnInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  data!: ContentInformationConstruction;
  dataCalification!: CcCalificacionUB[];
  schema = `${environment.schemas.main}`;
  baunitId!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInformationConstruction | undefined,
    private dialogRef: MatDialogRef<DetailInformationConstructionsPropertyComponent>,
    private informationPropertyService: InformationPropertyService,
    private layoutService: VexLayoutService
  ) {
  }

  ngOnInit() {
    if (this.defaults === null || this.defaults === undefined) {
      this.close();
      return;
    }
    if (this.defaults?.baunitId === null || this.defaults?.baunitId === undefined) {
      this.close();
      return;
    }
    if (this.defaults?.unitBuiltId === null || this.defaults?.unitBuiltId === undefined) {
      this.close();
      return;
    }
    if (this.defaults?.schema !== null && this.defaults?.schema !== undefined) {
      this.schema = this.defaults?.schema;
    }

    this.data = this.defaults;
    this.loadDetailInformationCalificationConstructions();
  }

  loadDetailInformationConstructions(): void {
    if (this.defaults?.unitBuiltId === null || this.defaults?.unitBuiltId === undefined) {
      this.close();
      return;
    }
    this.informationPropertyService
      .getDetailBasicInformationPropertyConstructions(this.defaults.unitBuiltId)
      .subscribe({
          next: (result: ContentInformationConstruction) => this.data = result,
          error: (err: any) => console.log('Consulta NOK.')
        }
      );
  }

  loadDetailInformationCalificationConstructions(): void {
    if (this.defaults?.unitBuiltId === null || this.defaults?.unitBuiltId === undefined ||
      this.defaults?.baunitId === null || this.defaults?.baunitId === undefined) {
      this.close();
      return;
    }
    this.informationPropertyService
      .getDetailBasicInformationPropertyCalificationConstructions(
        this.defaults.unitBuiltId)
      .subscribe({
          next: (result: CcCalificacionUB[]) => this.dataCalification = result,
          error: (err: any) => console.log('Consulta NOK.')
        }
      );

  }

  close(): void {
    this.dialogRef.close();
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly TWO_POINT_ = TWO_POINT_;
  protected readonly GUION = GUION;
}
