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
import { SearchData } from '../../../../interfaces/general/search-data.model';
import { ComboboxCollectionComponent } from '../../../general-components/combobox-collection/combobox-collection.component';
import { InputComponent } from '../../../general-components/input/input.component';
import { MODAL_LARGE } from '../../../../constants/general/constants';

import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { InformationPersonService } from 'src/app/apps/services/bpm/information-person.service';
import { ViewCertificateManagementComponent } from '../../../general-components/view-certificate-management/view-certificate-management.component';
import Swal from 'sweetalert2';
import { AlfaMainService } from 'src/app/apps/services/bpm/core/alfa-main.service';

interface DataViewCertificate {
  documentNumber: string;
  documentType: string;
  fullName: string;
  typeCertificate: string;
  baunitID: string;
}

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
    fullName: this.defaults?.firstName ?? '',
    baunitID: this.defaults?.baunitIdE ?? ''
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: SearchData | undefined,
    private fb: FormBuilder,
    private personService: InformationPersonService,
    private alfaMainService: AlfaMainService,
    private dialog: MatDialog
  ) {}

  viewFile(): void {
    this.validatBaunit({
      documentNumber: this.form.value['number'],
      documentType: this.form.value['domIndividualTypeNumber'],
      fullName: this.form.value['fullName'],
      baunitID: this.form.value['baunitID'],
      typeCertificate: 'CERT_POSEER_BIEN_TAQUILLA',
    });
  }

  openViewCertificateManagement(data: DataViewCertificate): void {
    this.dialog.open(ViewCertificateManagementComponent, {
      ...MODAL_LARGE,
      disableClose: true,
      data
    });
  }

  validatBaunit(data: DataViewCertificate) {
    if (!data.baunitID) {
      this.openViewCertificateManagement(data);
      return;
    }

    this.alfaMainService.getBaUnitHead(data.baunitID).subscribe((response) => {
      if (!response || Object.keys(response).length === 0) {
        Swal.fire({
          icon: 'warning',
          text: 'El número de ficha no existe en el sistema, por favor verificar',
          showConfirmButton: false,
          timer: 5000
        });
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
          this.form.get('fullName')?.patchValue('');
        },
        next: (result) => {
          this.captureInformationCadastralData(result);
        }
      });
  }

  captureInformationCadastralData(result: InfoPerson): void {
    if (result?.fullName) {
      this.form.get('fullName')?.patchValue(result.fullName);
      this.isFullNameEditable = false;
      this.form.get('fullName')?.disable();
    }
  }

  enableFullNameInput(): void {
    this.isFullNameEditable = true;
    this.form.get('fullName')?.enable();
  }

  get fullNameControl(): FormControl {
    return this.form.get('fullName') as FormControl;
  }

  get baunitIDControl(): FormControl {
    return this.form.get('baunitID') as FormControl;
  }
}
