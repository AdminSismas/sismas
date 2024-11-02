import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { GUION, NAME_NO, NAME_NO_DISPONIBLE, NAME_SI } from 'src/app/apps/constants/constant';
import { BasicInformationConstruction } from 'src/app/apps/interfaces/information-property/basic-information-construction';
import { ContentInformationConstruction, CreateBasicInformationConstruction } from 'src/app/apps/interfaces/information-property/content-information-construction';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { environment } from 'src/environments/environments';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { TextAreaComponent } from '../../../text-area/text-area.component';
import { InputComponent } from '../../../input/input.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



export interface AddEditInformationConstructionI {
  type: 'edit' | 'new';
  basicInformationConstruction: BasicInformationConstruction | undefined;
  baunitId: string | undefined;
}

@Component({
  selector: 'vex-edit-information-constructions-property',
  standalone: true,
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
  templateUrl: './edit-information-constructions-property.component.html',
  styleUrl: './edit-information-constructions-property.component.scss'
})
export class EditInformationConstructionsPropertyComponent implements OnInit {

  protected readonly GUION = GUION;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly NAME_SI = NAME_SI;
  protected readonly NAME_NO = NAME_NO;
  informationConstructionForm!: FormGroup;
  schema = signal<string>(`${environment.schemas.main}`);
  detailBasicInformation = signal<ContentInformationConstruction | null>(null);
  isLoading = signal<boolean>(false);
  private dialogRef = inject(MatDialogRef<EditInformationConstructionsPropertyComponent>);
  private informationPropertyService = inject(InformationPropertyService);
  private fBuilder = inject(FormBuilder);
  readonly addEditInformationData = inject<AddEditInformationConstructionI>(MAT_DIALOG_DATA);


  
  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDetailInformationConstruction();
  }

  /**
   * Load date for detail information selected
   */
  async loadDetailInformationConstruction(): Promise<void> {
    try {
      if (this.addEditInformationData.type === 'new') {
        return;
      }
      const detailBasicInformationConstruction: ContentInformationConstruction =
        await lastValueFrom(
          this.informationPropertyService.getDetailBasicInformationPropertyConstructions(
            this.schema(),
            this.addEditInformationData.basicInformationConstruction?.unitBuiltId
          )
        );
      this.detailBasicInformation.set(detailBasicInformationConstruction);
      Object.entries(detailBasicInformationConstruction)
      .forEach(([key, value]) => {
        if (this.informationConstructionForm.controls[key]) {
          this.informationConstructionForm.controls[key].setValue(value);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  async onSubmitForm(): Promise<void> {
    if (this.informationConstructionForm.invalid) {
      this.informationConstructionForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    try {
      const value = this.informationConstructionForm.value || {};
      let detailBasicInformationConstruction: ContentInformationConstruction | undefined; 
      if (this.addEditInformationData.type === 'new') {
        const createBasicInformationConstruction: CreateBasicInformationConstruction = {
          domBuiltType: value?.domBuiltType,
          domBuiltUse: value?.domBuiltUse,
          unitBuiltLabel: value?.unitBuiltLabel,
          unitBuiltAreaE: value?.unitBuiltAreaE,
          domTipologiaTipo: value?.domTipologiaTipo,
        };
        const baunitId: string = this.addEditInformationData.baunitId || '';
        if (!baunitId) {
          throw new Error('baunitId is not set.')
        }
        // detailBasicInformationConstruction = await lastValueFrom(
        //   this.informationPropertyService.createBasicInformationPropertyAddress(
        //     baunitId,
        //     createBasicInformationConstruction
        //   )
        // );
      } else {
        // detailBasicInformationConstruction  = await lastValueFrom(
        //   this.informationPropertyService.updateBasicInformationPropertyAddress(
        //     this.detailBasicInformation()?.direccionId as string,
        //     { ...value },
        //   )
        // );
      }
      this.dialogRef.close(detailBasicInformationConstruction);
    } catch (e) {
      console.error(e);
    }

    this.isLoading.set(false);
  }

  /**
   * Init information address form
   */
  private initForm(): void {
    this.informationConstructionForm = this.fBuilder.group({
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
      const names: string[] = ['unitBuiltId'];
      names.forEach((name: string) => {
        if (this.informationConstructionForm.controls[name]) {
          this.informationConstructionForm.controls[name].clearValidators();
          this.informationConstructionForm.controls[name].updateValueAndValidity();
        }
      })
    }
  }


}
