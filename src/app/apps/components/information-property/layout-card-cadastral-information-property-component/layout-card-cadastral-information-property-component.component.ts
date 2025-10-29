import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import {
  CadastralInformationPropertyComponent
} from '../cadastral-information-property/cadastral-information-property.component';
import { ContentInfoSchema } from '@shared/models';
import {
  RULE_PAGE_CADASTRAL_DA,
  TWO_POINT_,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '@shared/constants';
import { environment as envi } from '@environments/environments';
import { ObjectSchema, TypeInformation } from '@shared/interfaces';
import {
  CONSTANT_INFORMATION_PREDIAL,
  CONSTANT_INFORMATION_PREDIAL_HIST,
  CONSTANT_INFORMATION_PREDIAL_MAIN,
  CONSTANT_INFORMATION_PREDIAL_TEMP
} from '../../../constants/general/constantLabels';
import { BaunitHead } from '@shared/interfaces';
import {
  InformationPropertyService
} from 'src/app/apps/services/territorial-organization/information-property.service';
import { FluidHeightDirective } from '../../../directives/fluid-height.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-layout-card-cadastral-information-property-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    VexPageLayoutContentDirective,
    MatTabsModule,
    CadastralInformationPropertyComponent,
    FluidHeightDirective
  ],
  templateUrl:
    './layout-card-cadastral-information-property-component.component.html',
  styleUrl:
    './layout-card-cadastral-information-property-component.component.scss'
})
export class LayoutCardCadastralInformationPropertyComponentComponent implements OnInit, AfterViewInit {
  typeInformation: TypeInformation = TYPE_INFORMATION_VISUAL;

  optionSchemas: ObjectSchema[] = [];
  baUnitHead: BaunitHead | null = null;
  dataFlag = '';
  rulePage = '';

  schemaMain = `${envi.schemas.main}`;
  schemaTemp = `${envi.schemas.temp}`;
  schemaHist = `${envi.schemas.hist}`;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema,
    private dialogRef: MatDialogRef<LayoutCardCadastralInformationPropertyComponentComponent>,
    private informationPropertyService: InformationPropertyService
  ) {

  }

  ngOnInit(): void {
    if (
      this.defaults == null ||
      this.defaults.schemas == null ||
      this.defaults.typeInformation == null ||
      this.defaults.flagData == null
    ) {
      return;
    }

    this.optionSchemas = [];
    if (this.defaults.content !== null) {
      this.baUnitHead = this.defaults.content;
    }

    this.defaults.schemas.forEach((schema: string) =>
      this.createObjectLayout(schema, this.defaults)
    );
    this.typeInformation = this.defaults.typeInformation;

    if (this.defaults.flagData !== '') {
      this.dataFlag = this.defaults.flagData;
      if (this.defaults.flagData === 'openDataFlag') {
        this.informationPropertyService.showOptionsPersonSet(true);
      }
    }
    this.proccessRulePage();
  }

  proccessRulePage() {
    if (this.defaults && this.defaults.rulePage) {
      if (this.defaults.rulePage === RULE_PAGE_CADASTRAL_DA) {
        this.rulePage = this.defaults.rulePage;
        this.informationPropertyService.showRulePageSet(true);
      }

    }
  }

  createObjectLayout(schema: string, defaults: ContentInfoSchema): void {
    const defaultObject: ContentInfoSchema = { ...defaults };
    let title = '';
    if (schema === `${envi.schemas.main}`) {
      title = CONSTANT_INFORMATION_PREDIAL_MAIN;
      defaultObject.executionId = null;
    } else if (schema === `${envi.schemas.temp}`) {
      title = CONSTANT_INFORMATION_PREDIAL_TEMP;
    } else {
      title = CONSTANT_INFORMATION_PREDIAL_HIST;
    }
    this.optionSchemas.push({ schema, title, defaultObject });
  }

  ngAfterViewInit(): void {
    if (this.defaults?.baunitIdE === null || this.defaults?.baunitIdE === undefined) {
      Swal.fire({
        title: '¡Error!',
        text: 'ID no válido no es posible continuar!',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then(() => this.close());
    }
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * On tab change check schema for edit permissions
   *
   * @param matTabChangeEvent
   */
  onTabChange(matTabChangeEvent: MatTabChangeEvent): void {
    const { index = -1 } = matTabChangeEvent || {};
    if (index >= 0 && this.optionSchemas.length > 0) {
      // Non empty block
    }
  }

  /**
   * Set type of information depending on the schema type
   */
  private setTypeInformation(index: number): void {
    if (Array.isArray(this.optionSchemas) && this.optionSchemas.length > 0) {
      const optionSchema = this.optionSchemas[index];
      this.typeInformation =
        optionSchema.schema === 'temp' ? 'edition' : 'visualization';
    } else {
      this.typeInformation = 'visualization';
    }
  }

  protected readonly CONSTANT_INFORMATION_PREDIAL = CONSTANT_INFORMATION_PREDIAL;
  protected readonly TWO_POINT_ = TWO_POINT_;
  protected readonly TYPE_INFORMATION_VISUAL = TYPE_INFORMATION_VISUAL;
  protected readonly TYPE_INFORMATION_EDITION = TYPE_INFORMATION_EDITION;
  protected readonly CONSTANT_INFORMATION_PREDIAL_MAIN = CONSTANT_INFORMATION_PREDIAL_MAIN;
  protected readonly CONSTANT_INFORMATION_PREDIAL_TEMP = CONSTANT_INFORMATION_PREDIAL_TEMP;
  protected readonly CONSTANT_INFORMATION_PREDIAL_HIST = CONSTANT_INFORMATION_PREDIAL_HIST;
}
