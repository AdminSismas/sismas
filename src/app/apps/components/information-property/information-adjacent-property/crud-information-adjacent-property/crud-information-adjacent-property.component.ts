import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { GeneralValidationsService } from '@shared/services';
import {
  CrudInformationAdjacent,
  InformationAdjacent
} from '@shared/interfaces';
import { validateVariable } from '../../../../utils/general';
import { TypeOperation } from '@shared/interfaces';
import { TYPE_CREATE } from '@shared/constants';
import { ComboboxCollectionComponent } from 'src/app/apps/components/general-components/combobox-collection/combobox-collection.component';
import { TextAreaComponent } from 'src/app/apps/components/general-components/text-area/text-area.component';
import { InformationAdjacentPropertyService } from '@shared/services';

@Component({
  selector: 'vex-crud-information-adjacent-property',
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
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatDivider,
    MatIcon,
    MatIconButton,
    ReactiveFormsModule,
    SweetAlert2Module,
    MatDialogClose,
    ComboboxCollectionComponent,
    MatDialogActions,
    TextAreaComponent
  ],
  templateUrl: './crud-information-adjacent-property.component.html',
  styleUrl: './crud-information-adjacent-property.component.scss'
})
export class CrudInformationAdjacentPropertyComponent implements OnInit {
  executionId: string | null | undefined;
  baUnitId: string | null | undefined;
  ccColindanteBaunitId!: number | null | undefined; // ID del colindante
  typeCrud: TypeOperation | null = null;
  informationAdjacentData: InformationAdjacent | null = null;
  isCreateOrUpdateAdjacent = false; // Estado de carga

  editForm: FormGroup = this.fb.group({
    domPuntoCardinal: this.fb.control(
      this.crudInformationData?.contentInformation?.domPuntoCardinal ?? null,
      [Validators.required]
    ),
    colindante: this.fb.control(
      this.crudInformationData?.contentInformation?.colindante ?? null,
      [Validators.required, this.generalValidations.min03Characters()]
    )
  });

  @ViewChild('closeDialog') closeDialog!: SwalComponent;
  @ViewChild('validationErrorDialog')
  private validationErrorDialog!: SwalComponent;
  @ViewChild('successDialog') private successDialog!: SwalComponent;
  @ViewChild('errorSaveDialog') private errorSaveDialog!: SwalComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public crudInformationData: CrudInformationAdjacent | null,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrudInformationAdjacentPropertyComponent>,
    private generalValidations: GeneralValidationsService,
    private informationAdjacentService: InformationAdjacentPropertyService
  ) {}

  ngOnInit(): void {
    this.typeCrud = this.crudInformationData?.type || TYPE_CREATE;
    this.executionId =
      this.crudInformationData?.contentInformation?.executionId;
    this.baUnitId = this.crudInformationData?.contentInformation?.baUnitId;
    this.ccColindanteBaunitId =
      this.crudInformationData?.contentInformation?.ccColindanteBaunitId;

    if (
      !validateVariable(this.executionId) ||
      !validateVariable(this.baUnitId) ||
      !this.crudInformationData ||
      !this.crudInformationData?.contentInformation ||
      this.typeCrud === 'DELETE'
    ) {
      return;
    }

    if (this.typeCrud === 'UPDATE') {
      this.informationAdjacentData =
        this.crudInformationData?.contentInformation;
      this.changeDetailInformationConstruction(this.informationAdjacentData);
    }

    this.editForm.valueChanges.subscribe(() => {
      this.isCreateOrUpdateAdjacent = false;
    });
  }

  changeDetailInformationConstruction(
    detailInformation: InformationAdjacent | null
  ) {
    if (detailInformation) {
      Object.entries(detailInformation).forEach(([key, value]) => {
        if (this.editForm.controls[key]) {
          this.editForm.controls[key].setValue(value);
        }
      });
    }
  }

  saveInformationAdjacent() {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      this.validationErrorDialog.fire();
      return;
    }

    const formValues: InformationAdjacent = this.processFormValues(
      this.editForm.value
    );
    if (this.typeCrud === 'UPDATE' && this.executionId && this.baUnitId) {
      this.updateAdjacent(this.executionId, this.baUnitId, formValues);
      return;
    }
    if (this.typeCrud === 'CREATE' && this.executionId && this.baUnitId) {
      this.createAdjacent(this.executionId, this.baUnitId, formValues);
      return;
    }
    this.isCreateOrUpdateAdjacent = false;
  }

  createAdjacent(
    executionId: string,
    baunitId: string,
    formValues: InformationAdjacent
  ) {
    this.informationAdjacentService
      .createInformationPropertyAdjacent(executionId, baunitId, formValues)
      .subscribe({
        next: (result: InformationAdjacent) => {
          this.informationAdjacentData = result;
          this.ccColindanteBaunitId = result?.ccColindanteBaunitId;
          this.isCreateOrUpdateAdjacent = true;
          this.closeSuccessDialog(this.informationAdjacentData);
        },
        error: () => {
          this.isCreateOrUpdateAdjacent = false;
          this.errorSaveDialog.fire();
        }
      });
  }

  updateAdjacent(
    executionId: string,
    baunitId: string,
    formValues: InformationAdjacent
  ) {
    this.informationAdjacentService
      .updateInformationPropertyAdjacent(executionId, baunitId, formValues)
      .subscribe({
        next: (result: InformationAdjacent) => {
          this.informationAdjacentData = result;
          this.ccColindanteBaunitId = result?.ccColindanteBaunitId;
          this.isCreateOrUpdateAdjacent = true;
          this.closeSuccessDialog(this.informationAdjacentData);
        },
        error: () => {
          this.isCreateOrUpdateAdjacent = false;
          this.errorSaveDialog.fire();
        }
      });
  }

  closeSuccessDialog(result: InformationAdjacent) {
    this.successDialog.fire().then(() => {
      this.closedDialog(result);
    });
  }

  handleDialogClose(): void {
    if (!this.isCreateOrUpdateAdjacent) {
      this.closedDialog(this.informationAdjacentData);
      return;
    }
    this.closeDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.closedDialog(this.informationAdjacentData);
      }
    });
  }

  closedDialog(dataInformation: InformationAdjacent | null) {
    this.dialogRef.close(dataInformation);
  }

  private processFormValues(values: Record<string, string>): InformationAdjacent {
    if (this.isCreate) {
      return new InformationAdjacent(values);
    }
    const data: InformationAdjacent = new InformationAdjacent(
      this.crudInformationData?.contentInformation
    );
    data.domPuntoCardinal = values['domPuntoCardinal'];
    data.colindante = values['colindante'];
    return data;
  }

  get isCreate() {
    return this.typeCrud === 'CREATE';
  }

  get isUpdate() {
    return this.typeCrud === 'UPDATE';
  }

  get validateAdjacentText() {
    return this.editForm.get('colindante') as FormControl;
  }
}
