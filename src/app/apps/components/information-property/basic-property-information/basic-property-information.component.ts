import {
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  signal,
  input,
  output
} from '@angular/core';
import { DatePipe, NgClass, PercentPipe } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
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
import { HeaderCadastralInformationPropertyComponent } from '@shared/components';
import { MatExpansionModule } from '@angular/material/expansion';
import { InformationPropertyService } from '@shared/services';
import {
  BasicInformationProperty,
  CrudBasicInformationProperty
} from '@shared/interfaces';
import {
  GUION,
  LIST_SCHEMAS_CONTROL_MAIN,
  LIST_SCHEMAS_CONTROL_TEMP,
  MODAL_LARGE,
  MODAL_MEDIUM_SMALL,
  MODAL_MIN_SMALL_40_25,
  MODAL_SMALL,
  NAME_NO_DISPONIBLE,
  NAME_NO_DISPONIBLE_CERO,
  TYPE_INFORMATION_VISUAL,
  TYPE_UPDATE,
  TYPE_UPDATE_PROPERTY_UNIT
} from '@shared/constants';
import { environment } from '../../../../../environments/environments';
import { MatDialog } from '@angular/material/dialog';
import { EditBasicPropertyInformationComponent } from '@shared/components';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { GeographicViewerComponent } from '@shared/components';
import { ContentInfoSchema } from '@shared/interfaces';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutCardCadastralInformationPropertyComponentComponent } from '@shared/components';
import { BaunitHead } from '@shared/interfaces';
import { AlfaMainService } from '@shared/services';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    CurrencyLandsPipe,
    DatePipe,
    FormsModule,
    HeaderCadastralInformationPropertyComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    NgClass,
    PercentPipe,
    ReactiveFormsModule
  ],
  templateUrl: './basic-property-information.component.html',
  styleUrl: './basic-property-information.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BasicPropertyInformationComponent),
      multi: true
    }
  ]
})
export class BasicPropertyInformationComponent {
  data!: BasicInformationProperty;

  //Inputs signal
  expandedComponent = input.required<boolean>();

  //Inputs zone.js
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() propertyUnit = false;
  @Input() typeInformation = 'visualization';
  @Input() editable? = true;
  @Input() editNpn? = false;
  @Input() editArea? = false;
  @Input() editCondition? = false;

  // Outputs signal
  emitExpandedComponent = output<number>();

  //Outputs zone.js
  @Output() propertyRegistryNumber: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() propertyRegistryOffice: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() isMatriz = new EventEmitter<boolean>();

  private alfaMainService: AlfaMainService = inject(AlfaMainService);

  existDetailGroup = signal<boolean>(false);
  existMasterGroup = signal<boolean>(false);

  constructor(
    private informationPropertyService: InformationPropertyService,
    private dialog: MatDialog
  ) {}

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(0);
    this.searchBasicInformationProperty();
  }

  searchBasicInformationProperty(): void {
    if (!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService
      .getBasicInformationProperty(this.schema, this.baunitId, this.executionId)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: BasicInformationProperty) =>
          this.captureInformationSubscribe(result)
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
    this.isMatriz.emit(this.existMasterGroup());
  }

  editBasicInformationProperty(): void {
    if (!this.executionId) {
      return;
    }
    const data: BasicInformationProperty = this.data;
    data.executionId = this.executionId;
    const dataBasicInformationProperty: CrudBasicInformationProperty = {
      type: TYPE_UPDATE,
      contentInformation: data,
      npnEdit: this.editNpn,
      areaEdit: this.editArea,
      isMatriz: this.existMasterGroup(),
      conditionEdit: this.editCondition
    };
    this.dialog
      .open(EditBasicPropertyInformationComponent, {
        ...MODAL_MEDIUM_SMALL,
        disableClose: true,
        data: dataBasicInformationProperty
      })
      .afterClosed()
      .subscribe({
        next: (result: BasicInformationProperty) => {
          if (result && result?.baunitIdE) {
            setTimeout(() => (this.data = result), 300);
          }
        }
      });
  }

  editDetailGroupProperty(): void {
    if (this.existDetailGroup() && this.executionId) {
      const data: BasicInformationProperty = this.data;
      data.executionId = this.executionId;
      const dataBasicInformationProperty: CrudBasicInformationProperty = {
        type: TYPE_UPDATE_PROPERTY_UNIT,
        contentInformation: data
      };
      this.dialog
        .open(EditBasicPropertyInformationComponent, {
          ...MODAL_MIN_SMALL_40_25,
          disableClose: true,
          data: dataBasicInformationProperty
        })
        .afterClosed()
        .subscribe({
          next: (result: BasicInformationProperty) => {
            if (result && result?.baunitIdE) {
              setTimeout(() => (this.data = result), 300);
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

  openCadastralMasterGroupE(): void {
    const masterGroupE: string | null | undefined =
      this.data?.detailGroup?.masterGroupE;
    if (!masterGroupE) {
      return;
    }

    if (!this.executionId) {
      this.openCadastralMasterGroupEMain(masterGroupE);
      return;
    }

    this.alfaMainService
      .getBaUnitHeadTemporal(this.executionId, masterGroupE)
      .subscribe({
        next: (result: BaunitHead) =>
          this.executeOpenCadastralMaster(result, masterGroupE),
        error: () => this.swalErrorBaUnitHead(this.executionId, masterGroupE)
      });
  }

  openCadastralMasterGroupEMain(masterGroupE: string | null | undefined) {
    if (!masterGroupE) {
      return;
    }
    this.alfaMainService.getBaUnitHead(masterGroupE).subscribe({
      next: (result: BaunitHead) =>
        this.executeOpenCadastralMaster(result, masterGroupE),
      error: () => this.swalErrorBaUnitHead(this.executionId, masterGroupE)
    });
  }

  executeOpenCadastralMaster(
    result: BaunitHead,
    masterGroupE: string | null | undefined
  ) {
    if (!masterGroupE) {
      return;
    }
    if (result === null) {
      this.swalErrorInformationProceduresNotFound();
      return;
    }
    let schemas: string[] = [];
    schemas = this.executionId
      ? LIST_SCHEMAS_CONTROL_TEMP
      : LIST_SCHEMAS_CONTROL_MAIN;
    const dataInfo: ContentInfoSchema = new ContentInfoSchema(
      masterGroupE,
      result,
      this.executionId,
      schemas,
      TYPE_INFORMATION_VISUAL
    );
    dataInfo.levelInfo = 3;
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: dataInfo
      })
      .afterClosed();
  }

  swalErrorBaUnitHead(
    executionId: string | null | undefined,
    baunitId: string | null | undefined
  ) {
    Swal.fire({
      title: '¡Error!',
      text:
        'Hubo un error, verifique la información de la unidad predial: ' +
        baunitId +
        ' y la version: ' +
        executionId,
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    }).then();
  }

  swalErrorInformationProceduresNotFound() {
    Swal.fire({
      title: '¡Error!',
      text: 'Hubo un error al obtener la informacion, actualmente no se encuentra disponible',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    }).then();
  }

  refreshCadastralAreaGeoE(): void {
    if (!this.baunitId) return;

    const executionId =
      this.schema === environment.schemas.temp && this.executionId
        ? this.executionId
        : '';

    this.informationPropertyService
      .refreshCadastralAreaGeoE(this.baunitId, executionId)
      .subscribe((response) => {
        this.captureInformationSubscribe(response);
        Swal.fire({
          icon: 'success',
          text: 'Área catastral geográfica actualizada correctamente',
          showConfirmButton: false,
          timer: 10000
        });
      });
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_NO_DISPONIBLE_CERO = NAME_NO_DISPONIBLE_CERO;
  protected readonly GUION = GUION;
}
