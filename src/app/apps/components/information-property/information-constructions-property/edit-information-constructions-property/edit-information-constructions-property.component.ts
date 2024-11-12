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
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';



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
    MatFormFieldModule,
    MatOptionModule
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
    console.log('Submitting form with values:', this.informationConstructionForm.value);
    if (this.informationConstructionForm.invalid) {
      this.informationConstructionForm.markAllAsTouched();
      return;
    }

    // Confirmación antes de proceder
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de crear una nueva construcción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    });


    if (!result.isConfirmed) {
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
          unitBuiltFloors: value?.unitBuiltFloors,
          unitBuiltYear: value?.unitBuiltYear,
          unitBuiltArea: value?.unitBuiltArea,
          domTipologiaTipo: value?.domTipologiaTipo,
          unitBuiltPrivateArea: value?.unitBuiltPrivateArea,
          unitBuiltObservation: value?.unitBuiltObservation,
        };
        const baunitId: string = this.addEditInformationData.baunitId || '';
        if (!baunitId) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'baunitId is not set.',
          });
          throw new Error('baunitId is not set.');
        }
        detailBasicInformationConstruction = await lastValueFrom(
          this.informationPropertyService.createBasicInformationPropertyConstruction(
            68,
            baunitId,
            createBasicInformationConstruction,
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Creación exitosa',
          text: 'La información de construcción se ha guardado correctamente.',
          confirmButtonText: 'OK', confirmButtonColor: '#3f51b5'
        });
      } else {
          detailBasicInformationConstruction  = await lastValueFrom(
    this.informationPropertyService.updateBasicInformationPropertyConstruction(
      this.detailBasicInformation()?.unitBuiltId?.toString() || '',
      { ...value },
    )
  );


      }

      this.dialogRef.close(detailBasicInformationConstruction);
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Ocurrió un error al guardar la información: ${e}`,
      });
      console.error(e);
    }

    this.isLoading.set(false);
  }




  /**
   * Init information address form
   */
  private initForm(): void {
    this.informationConstructionForm = this.fBuilder.group({
      domBuiltType: [null, Validators.required],
      domBuiltUse: [null, Validators.required],
      unitBuiltLabel: [
        null,
        [Validators.required, Validators.pattern('^[A-Z]+$')] // Solo letras mayúsculas
      ],
      unitBuiltFloors: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')] // Solo números enteros
      ],
      unitBuiltYear: [
        null,
        [Validators.required, Validators.pattern('^(19|20)\\d{2}$')] // Solo años válidos entre 1900-2099
      ],
      unitBuiltArea: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')] // Solo números
      ],
      domTipologiaTipo: [null, Validators.required],
      unitBuiltPrivateArea: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')] // Solo números
      ],
      unitBuiltObservation: [null] // No es obligatorio
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
