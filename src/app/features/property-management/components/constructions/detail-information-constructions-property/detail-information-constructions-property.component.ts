import { Component, inject, OnInit } from '@angular/core';
import { environment } from '@environments/environments';
import {
  ContentInformationConstruction,
  CrudInformationConstruction
} from '@features/property-management/models/content-information-construction';
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
import { NAME_NO_DISPONIBLE } from '@shared/constants/constants';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { CcCalificacionUB } from '@features/property-management/models/';
import { MatGridListModule } from '@angular/material/grid-list';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationConstructionsService } from '@features/property-management/services/constructions/information-constructions.service';
import {
  validateIsNumber,
  validateVariable
} from '@shared/utils/functions/general';
import { toSignal } from '@angular/core/rxjs-interop';

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
    MatGridListModule
  ],
  templateUrl: './detail-information-constructions-property.component.html',
  styleUrl: './detail-information-constructions-property.component.scss'
})
export class DetailInformationConstructionsPropertyComponent implements OnInit {
  /* ---- Injects ---- */
  public readonly crudInformationData =
    inject<CrudInformationConstruction | null>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<
    MatDialogRef<DetailInformationConstructionsPropertyComponent>
  >(MatDialogRef<DetailInformationConstructionsPropertyComponent>);
  private readonly constructionsService = inject(
    InformationConstructionsService
  );
  private readonly layoutService = inject(VexLayoutService);

  /* ---- Properties ---- */
  private executionId: string | null | undefined;
  private baunitId: string | null | undefined;
  private unitBuiltId!: number | null | undefined; // ID de la construcción creada
  private schema: string | null | undefined = `${environment.schemas.main}`;
  public constructionData: ContentInformationConstruction | null = null;
  public dataCalification: CcCalificacionUB[] = [];

  /* ---- Signals ---- */
  public readonly isDesktop$ = toSignal(this.layoutService.isDesktop$);

  ngOnInit() {
    if (
      !this.crudInformationData ||
      !this.crudInformationData?.contentInformation
    ) {
      this.close();
      return;
    }
    this.executionId =
      this.crudInformationData?.contentInformation?.executionId;
    this.baunitId = this.crudInformationData?.contentInformation?.baunitId;
    this.unitBuiltId =
      this.crudInformationData?.contentInformation?.unitBuiltId;
    if (
      validateVariable(this.crudInformationData?.contentInformation?.schema)
    ) {
      this.schema = this.crudInformationData?.contentInformation?.schema;
    }

    if (
      !validateVariable(this.executionId) ||
      !validateVariable(this.baunitId) ||
      this.unitBuiltId == null ||
      !validateIsNumber(this.unitBuiltId)
    ) {
      this.close();
      return;
    }

    this.constructionData = this.crudInformationData?.contentInformation;
    this.loadDetailInformationCalificationConstructions(this.constructionData);
  }

  loadDetailInformationCalificationConstructions(
    detailInformationConstruction: ContentInformationConstruction | null
  ) {
    if (!detailInformationConstruction) {
      return;
    }

    const executionId = detailInformationConstruction.executionId ?? null;
    const baunitId = detailInformationConstruction.baunitId ?? null;
    const unitBuiltId = detailInformationConstruction.unitBuiltId ?? null;
    if (!baunitId || !unitBuiltId) {
      return;
    }
    this.constructionsService
      .getQualificationConstructions(
        executionId,
        baunitId,
        unitBuiltId,
        this.schema
      )
      .subscribe(
        (result: CcCalificacionUB[]) => (this.dataCalification = result)
      );
  }

  close(): void {
    this.dialogRef.close();
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
