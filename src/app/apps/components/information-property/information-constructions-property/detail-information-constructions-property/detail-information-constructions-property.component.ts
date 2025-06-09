import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import {
  ContentInformationConstruction,
  CrudInformationConstruction
} from '../../../../interfaces/information-property/content-information-construction';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NAME_NO_DISPONIBLE, TYPE_READ_ONLY } from '../../../../constants/general/constants';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe } from '@angular/common';
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
import {
  InformationConstructionsService
} from '../../../../services/information-property/information-constructions-property/information-constructions.service';
import { TypeOperation } from '../../../../interfaces/general/content-info';
import { validateIsNumber, validateVariable } from '../../../../utils/general';

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
    MatExpansionModule,
    MatGridListModule,
    AsyncPipe
  ],
  templateUrl: './detail-information-constructions-property.component.html',
  styleUrl: './detail-information-constructions-property.component.scss'
})
export class DetailInformationConstructionsPropertyComponent implements OnInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  executionId: string | null | undefined;
  baunitId: string | null | undefined;
  unitBuiltId!: number | null | undefined; // ID de la construcción creada
  typeCrud: TypeOperation | null = null;
  constructionData: ContentInformationConstruction | null = null;
  dataCalification: CcCalificacionUB[] = [];
  schema: string | null | undefined = `${environment.schemas.main}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public crudInformationData: CrudInformationConstruction | null,
    private dialogRef: MatDialogRef<DetailInformationConstructionsPropertyComponent>,
    private constructionsService: InformationConstructionsService,
    private layoutService: VexLayoutService
  ) {
  }

  ngOnInit() {
    if (!this.crudInformationData || !this.crudInformationData?.contentInformation) {
      this.close();
      return;
    }
    this.typeCrud = this.crudInformationData?.type || TYPE_READ_ONLY;
    this.executionId = this.crudInformationData?.contentInformation?.executionId;
    this.baunitId = this.crudInformationData?.contentInformation?.baunitId;
    this.unitBuiltId = this.crudInformationData?.contentInformation?.unitBuiltId;
    if (validateVariable(this.crudInformationData?.contentInformation?.schema)) {
      this.schema = this.crudInformationData?.contentInformation?.schema;
    }

    if (!validateVariable(this.executionId) || !validateVariable(this.baunitId) ||
      (this.unitBuiltId == null || !validateIsNumber(this.unitBuiltId))) {
      this.close();
      return;
    }

    this.constructionData = this.crudInformationData?.contentInformation;
    this.loadDetailInformationCalificationConstructions(this.constructionData);
  }

  loadDetailInformationCalificationConstructions(detailInformationConstruction: ContentInformationConstruction | null) {
    if (!detailInformationConstruction) {
      return;
    }

    const executionId = detailInformationConstruction.executionId ?? null;
    const baunitId = detailInformationConstruction.baunitId ?? null;
    const unitBuiltId = detailInformationConstruction.unitBuiltId ?? null;
    if (!baunitId || !unitBuiltId) {
      return;
    }
    this.constructionsService.getQualificationConstructions(
      executionId, baunitId, unitBuiltId, this.schema)
      .subscribe((result: CcCalificacionUB[]) => this.dataCalification = result);
  }

  close(): void {
    this.dialogRef.close();
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
