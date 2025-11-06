import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SearchData } from '@shared/interfaces';
import { ComboboxCollectionComponent } from '@shared/utils/combobox-collection/combobox-collection.component';
import { InputComponent } from '@shared/ui/input/input.component';import { MODAL_LARGE } from '@shared/constants';

import { InfoPerson } from '@features/property-management/models/info-person';
import { InformationPersonService } from '@features/bpm-workflows/services/core/information-person.service';
import Swal from 'sweetalert2';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main/alfa-main.service';
import { PaymentValidationComponent } from 'src/app/apps/components/general-components/payment-validation/payment-validation.component';
import { DataViewCertificate } from 'src/app/apps/interfaces/document-management/view-certificate-management-data.interface';

@Component({
  selector: 'vex-filter-certificate-search',
  templateUrl: './filter-certificate-search.component.html',
  standalone: true,
  imports: [
    ComboboxCollectionComponent,
    InputComponent,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class FilterCertificateSearchComponent {
  isFullNameEditable = false;

  person!: InfoPerson | null;
  form: FormGroup = this.fb.group({
    domIndividualTypeNumber: this.defaults?.domIndividualTypeNumber ?? '',
    number: this.defaults?.number ?? '',
    individualNameNoExist: this.defaults?.firstName ?? '',
    baunitId: this.defaults?.baunitIdE ?? ''
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: SearchData | undefined,
    private fb: FormBuilder,
    private personService: InformationPersonService,
    private alfaMainService: AlfaMainService,
    private dialog: MatDialog
  ) {}

  sendCertificateQuery(): void {
//     {
//        "baunitId": 20711886,
//        "domIndividualTypeNumber": null,
//        "individualNameNoExist": null,
//        "number": null,
//        "paymentReference":"REF123456XYZ"
//        "templateCode": "CERT_INST_PUBL",
//     }
    this.form.enable();
    this.validatBaunit({
      ...this.form.value,
      templateCode: 'CERT_POSEER_BIEN_TAQUILLA',
    });
  }

  openViewCertificateManagement(data: DataViewCertificate): void {
    this.dialog.open(PaymentValidationComponent, {
      ...MODAL_LARGE,
      disableClose: true,
      data
    });
  }

  validatBaunit(data: DataViewCertificate) {
    if (!data.baunitId) {
      this.dialog.closeAll();
      this.openViewCertificateManagement({ ...data, baunitId: null });
      return;
    }

    this.alfaMainService.getBaUnitHead(data.baunitId).subscribe((response) => {
      if (!response || Object.keys(response).length === 0) {
        Swal.fire({
          icon: 'warning',
          text: 'El número de ficha no existe en el sistema, por favor verificar',
          showConfirmButton: false,
          timer: 5000
        });
        this.form.get('individualNameNoExist')?.disable();
        return;
      }

      this.dialog.closeAll();
      this.openViewCertificateManagement(data);
    });
  }

  findParticipant() {
    const info = this.form.value;
    if (!info.domIndividualTypeNumber || !info.number) {
      Swal.fire({
        icon: 'warning',
        text: 'Ingresar tipo documento y número de documento',
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }

    this.personService
      .getFindPersonByNumber(info.number, info.domIndividualTypeNumber)
      .subscribe({
        error: () => {
          Swal.fire({
            icon: 'error',
            text: 'No existe una persona con ese tipo de documento y número',
            showConfirmButton: false,
            timer: 5000
          });
          this.enableFullNameInput();
          this.form.get('individualNameNoExist')?.patchValue('');
        },
        next: (result) => {
          this.captureInformationCadastralData(result);
        }
      });
  }

  captureInformationCadastralData(result: InfoPerson): void {
    if (result?.fullName) {
      this.form.get('individualNameNoExist')?.patchValue(result.fullName);
      this.isFullNameEditable = false;
      this.form.get('individualNameNoExist')?.disable();
    }
  }

  enableFullNameInput(): void {
    this.isFullNameEditable = true;
    this.form.get('individualNameNoExist')?.enable();
  }

  get individualNameNoExistControl(): FormControl {
    return this.form.get('individualNameNoExist') as FormControl;
  }

  get baunitIdControl(): FormControl {
    return this.form.get('baunitId') as FormControl;
  }
}
