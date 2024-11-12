import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { GUION, NAME_NO, NAME_NO_DISPONIBLE, NAME_SI } from 'src/app/apps/constants/constant';
import { environment } from 'src/environments/environments';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { CreateBasicInformationAddress, DetailBasicInformationAddress } from 'src/app/apps/interfaces/information-property/detail-basic-information-address';
import { BasicInformationAddress } from 'src/app/apps/interfaces/information-property/basic-information-address';
import { lastValueFrom } from 'rxjs';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { InputComponent } from '../../../input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextAreaComponent } from '../../../text-area/text-area.component';

export interface AddEditInformationDataI {
  type: 'edit' | 'new';
  basicInformationAddress: BasicInformationAddress | undefined;
  baunitId: string | undefined;
}

@Component({
  selector: 'vex-edit-information-address',
  standalone: true,
  animations: [
    stagger40ms,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    InputComponent,
    TextAreaComponent,
    ComboxColletionComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-information-address.component.html',
  styleUrl: './edit-information-address.component.scss'
})
export class EditInformationAddressComponent implements OnInit {

  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_SI = NAME_SI;
  protected readonly NAME_NO = NAME_NO;
  informationAddressForm!: FormGroup;
  schema = signal<string>(`${environment.schemas.main}`);
  detailBasicInformation = signal<DetailBasicInformationAddress | null>(null);
  isLoading = signal<boolean>(false);
  private dialogRef = inject(MatDialogRef<EditInformationAddressComponent>);
  private informationPropertyService = inject(InformationPropertyService);
  private fBuilder = inject(FormBuilder);
  readonly addEditInformationData = inject<AddEditInformationDataI>(MAT_DIALOG_DATA);
  
  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDetailInformationAddress();

    console.log('addEditInformationData', this.addEditInformationData.type);
  }

  /**
   * Load date for detail information selected
   */
  async loadDetailInformationAddress(): Promise<void> {
    try {
      if (this.addEditInformationData.type === 'new') {
        return;
      }
      const detailBasicInformationAddress: DetailBasicInformationAddress =
        await lastValueFrom(
          this.informationPropertyService.getDetailBasicInformationPropertyAddresses(
            this.schema(),
            this.addEditInformationData.basicInformationAddress?.direccionId
          )
        );
      this.detailBasicInformation.set(detailBasicInformationAddress);
      Object.entries(detailBasicInformationAddress)
      .forEach(([key, value]) => {
        if (this.informationAddressForm.controls[key]) {
          this.informationAddressForm.controls[key].setValue(value);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  async onSubmitForm(): Promise<void> {
    if (this.informationAddressForm.invalid) {
      this.informationAddressForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      const value = this.informationAddressForm.value || {};
      let detailBasicInformationAddress: DetailBasicInformationAddress | undefined; 
      if (this.addEditInformationData.type === 'new') {
        const createBasicInformationAddress: CreateBasicInformationAddress = {
          esDireccionPrincipal: value?.esDireccionPrincipal,
          codigoPostal: value?.codigoPostal,
          valorViaPrincipal: value?.valorViaPrincipal,
          letraViaPrincipal: value?.letraViaPrincipal,
          letraViaGeneradora: value?.letraViaGeneradora,
          valorViaGeneradora: value?.valorViaGeneradora,
          numeroPredio: value?.numeroPredio,
          complemento: value?.complemento,
          nombrePredio: value?.nombrePredio,
          domTipoDireccion: value?.domTipoDireccion,
          domClaseViaPrincipal: value?.domClaseViaPrincipal,
          domSectorCiudad: value?.domSectorCiudad,
          domSectorPredio: value?.domSectorPredio,
        };
        const baunitId: string = this.addEditInformationData.baunitId || '';
        if (!baunitId) {
          throw new Error('baunitId is not set.')
        }
        detailBasicInformationAddress = await lastValueFrom(
          this.informationPropertyService.createBasicInformationPropertyAddress(
            baunitId,
            createBasicInformationAddress
          )
        );
      } else {
        detailBasicInformationAddress  = await lastValueFrom(
          this.informationPropertyService.updateBasicInformationPropertyAddress(
            this.detailBasicInformation()?.direccionId as string,
            { ...value },
          )
        );
      }
      this.dialogRef.close(detailBasicInformationAddress);
    } catch (e) {
      console.error(e);
    }

    this.isLoading.set(false);
  }

  /**
   * Init information address form
   */
  private initForm(): void {
    this.informationAddressForm = this.fBuilder.group({
      letraViaPrincipal: this.fBuilder.control(null, [Validators.required]),
      valorViaPrincipal: this.fBuilder.control(null, [Validators.required]),
      valorViaGeneradora: this.fBuilder.control(null, [Validators.required]),
      letraViaGeneradora: this.fBuilder.control(null, [Validators.required]),
      numeroPredio: this.fBuilder.control(null, [Validators.required]),
      nombrePredio: this.fBuilder.control(null, [Validators.required]),
      direccionTexto: this.fBuilder.control(null, [Validators.required]),
      domTipoDireccion: this.fBuilder.control(null, [Validators.required]),
      domClaseViaPrincipal: this.fBuilder.control(null, [Validators.required]),
      domSectorCiudad: this.fBuilder.control(null, [Validators.required]),
      domSectorPredio: this.fBuilder.control(null, [Validators.required]),
      codigoPostal: this.fBuilder.control(null, [Validators.required]),
      esDireccionPrincipal: this.fBuilder.control(false, [Validators.required]),
      complemento: this.fBuilder.control(null),
      direccionId: this.fBuilder.control(null, [Validators.required]),
    });

    if (this.addEditInformationData.type === 'new') {
      const names: string[] = ['direccionId'];
      names.forEach((name: string) => {
        if (this.informationAddressForm.controls[name]) {
          this.informationAddressForm.controls[name].clearValidators();
          this.informationAddressForm.controls[name].updateValueAndValidity();
        }
      })
    }
  }
}
