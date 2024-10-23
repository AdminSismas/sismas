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
import { ContentInfoSchema } from '../../../interfaces/content-info-schema';
import { TWO_POINT_, TYPEINFORMATION_VISUAL } from '../../../constants/constant';
import { NgForOf, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as envi } from '../../../../../environments/environments';
import { ObjectSchema, TypeInformation } from '../../../interfaces/content-info';
import {
  CONSTANT_INFOMATION_PREDIAL,
  CONSTANT_INFOMATION_PREDIAL_HIST,
  CONSTANT_INFOMATION_PREDIAL_MAIN,
  CONSTANT_INFOMATION_PREDIAL_TEMP
} from '../../../constants/constantLabels';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';


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
    NgForOf,
    MatMenuModule,
    NgIf
  ],
  templateUrl:
    './layout-card-cadastral-information-property-component.component.html',
  styleUrl:
    './layout-card-cadastral-information-property-component.component.scss'
})
export class LayoutCardCadastralInformationPropertyComponentComponent
  implements OnInit, AfterViewInit
{
  typeInformation: TypeInformation = TYPEINFORMATION_VISUAL;
  optionschemas: ObjectSchema[] = [];
  baunitHead: BaunitHead | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LayoutCardCadastralInformationPropertyComponentComponent>
  ) {}

  ngOnInit(): void {
    if (
      this.defaults == null ||
      this.defaults.schemas == null ||
      this.defaults.typeInformation == null
    ) {
      return;
    }

    this.optionschemas = [];
    if (this.defaults.content != null) {
      this.baunitHead = this.defaults.content;
    }

    this.defaults.schemas.forEach((schema: string) =>
      this.createObjectLayout(schema)
    );
    //On init of component set type information according to the component
    this.setTypeInformation(0);
  }

  createObjectLayout(schema: string): void {
    let title = '';
    title =
      schema === `${envi.schemas.main}`
        ? CONSTANT_INFOMATION_PREDIAL_MAIN
        : schema === `${envi.schemas.temp}`
          ? CONSTANT_INFOMATION_PREDIAL_TEMP
          : CONSTANT_INFOMATION_PREDIAL_HIST;
    this.optionschemas.push({ schema, title });
  }

  ngAfterViewInit(): void {
    if (
      this.defaults?.baunitIdE === null ||
      this.defaults?.baunitIdE === undefined
    ) {
      this.snackBar.open('ID no valido no es posible continuar!', 'CLOSE', {
        duration: 3000,
        horizontalPosition: 'right'
      });
      this.close();
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
    if (index >= 0 && this.optionschemas.length > 0){
      const selectedOptionSchema: ObjectSchema = this.optionschemas[index];
      if (selectedOptionSchema) {
        this.setTypeInformation(index);
      }
    }
  }

  /**
   * Set type of information depending on the schema type
   */
  private setTypeInformation(index: number): void {
    if (Array.isArray(this.optionschemas) && this.optionschemas.length > 0) {
      const optionSchema = this.optionschemas[index];
      this.typeInformation = optionSchema.schema === 'temp' ? 'edition' : 'visualization';
    } else {
      this.typeInformation = 'visualization';
    }
  }

  protected readonly CONSTANT_INFOMATION_PREDIAL = CONSTANT_INFOMATION_PREDIAL;
  protected readonly TWO_POINT_ = TWO_POINT_;
}
