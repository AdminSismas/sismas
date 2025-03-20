import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatStepLabel } from '@angular/material/stepper';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TextAreaComponent } from '../../../general-components/text-area/text-area.component';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { CollectionServices } from '../../../../services/general/collection.service';
import { GeneralValidationsService } from '../../../../services/validations/general-validations.service';
import { CommonGeneralValidationsService } from '../../../../services/general/common-general-validations.service';
import {
  CrudInformationAdjacent,
  InformationAdjacent
} from '../../../../interfaces/information-property/information-adjacent';
import { TYPE_CREATE_CONSTRUCTION } from '../../../../constants/general/constant';
import { validateVariable } from '../../../../utils/general';
import { TypeOperation } from '../../../../interfaces/general/content-info';

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
    MatStepLabel,
    ReactiveFormsModule,
    SweetAlert2Module,
    TextAreaComponent,
    MatDialogClose
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

  editForm: FormGroup = this.fb.group({
    //   unitBuiltId: [this.crudInformationData?.contentInformation?.unitBuiltId ?? null],
    //   domBuiltType: [this.crudInformationData?.contentInformation?.domBuiltType ?? null, Validators.required],
    //   domBuiltUse: [this.crudInformationData?.contentInformation?.domBuiltUse ?? null, Validators.required],
    //   unitBuiltLabel: [this.crudInformationData?.contentInformation?.unitBuiltLabel ?? null, [Validators.required, this.generalValidations.validateCapitalLettersOnly()]],// Solo letras mayúsculas
    //   unitBuiltFloors: [this.crudInformationData?.contentInformation?.unitBuiltFloors ?? null, [Validators.required, this.generalValidations.validateNumberMax99()]],// Números del 1 al 99
  });

  @ViewChild('closeDialog') closeDialog!: SwalComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public crudInformationData: CrudInformationAdjacent | null,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrudInformationAdjacentPropertyComponent>,
    private collectionServicesService: CollectionServices,
    private generalValidations: GeneralValidationsService,
    private validationsService: CommonGeneralValidationsService
  ) {
  }


  ngOnInit(): void {
    this.typeCrud = this.crudInformationData?.type || TYPE_CREATE_CONSTRUCTION;
    this.executionId = this.crudInformationData?.contentInformation?.executionId;
    this.baUnitId = this.crudInformationData?.contentInformation?.baUnitId;
    this.ccColindanteBaunitId = this.crudInformationData?.contentInformation?.ccColindanteBaunitId;

    if (!validateVariable(this.executionId) || !validateVariable(this.baUnitId) ||
      !this.crudInformationData || !this.crudInformationData?.contentInformation ||
      this.typeCrud === 'DELETE') {
      return;
    }

    if (this.typeCrud === 'UPDATE') {
      this.informationAdjacentData = this.crudInformationData?.contentInformation;
      this.changeDetailInformationConstruction(this.informationAdjacentData);
    }
  }

  changeDetailInformationConstruction(detailInformation: InformationAdjacent | null) {
    if (detailInformation) {
      Object.entries(detailInformation).forEach(([key, value]) => {
        if (this.editForm.controls[key]) {
          this.editForm.controls[key].setValue(value);
        }
      });
    }
  }

  saveInformacionAdjacent(){

  }


  handleDialogClose(): void {
    this.closeDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.closedDialog(this.informationAdjacentData);
      }
    });
  }

  closedDialog(dataInformation: InformationAdjacent | null) {
    this.dialogRef.close(dataInformation);
  }

}
