import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { InputComponent } from '../../../input/input.component';
import { TextAreaComponent } from '../../../text-area/text-area.component';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-edit-information-construction-dialog',
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
  templateUrl: './edit-information-construction-dialog.component.html',
  styleUrl: './edit-information-construction-dialog.component.scss'
})
export class EditInformationConstructionDialogComponent implements OnInit{
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditInformationConstructionDialogComponent>,
    private informationPropertyService: InformationPropertyService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.editForm = this.fb.group({
      unitBuiltId: [data.unitBuiltId], 
      domBuiltType: [data.domBuiltType, Validators.required],
      domBuiltUse: [data.domBuiltUse, Validators.required],
      unitBuiltLabel: [data.unitBuiltLabel, Validators.required],
      unitBuiltFloors: [data.unitBuiltFloors, Validators.required],
      unitBuiltYear: [data.unitBuiltYear],
      unitBuiltArea: [data.unitBuiltArea, Validators.required],
      unitBuiltScore: [data.unitBuiltScore],
      domTipologiaTipo: [data.domTipologiaTipo],
      unitBuiltValuation: [data.unitBuiltValuation],
      unitBuiltValuationM2: [data.unitBuiltValuationM2],
      unitBuiltPrivateArea: [data.unitBuiltPrivateArea],
      unitBuiltObservation: [data.unitBuiltObservation]
    });

  }

  ngOnInit(): void {}

  save(): void {
    if (this.editForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas guardar los cambios realizados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.informationPropertyService.updateConstruction(68, 2282747, this.editForm.value)
            .subscribe({
              next: () => {
                Swal.fire({
                  title: '¡Guardado!',
                  text: 'Los datos se han actualizado correctamente.',
                  confirmButtonColor: '#3f51b5',
                  icon: 'success'
                });
                this.dialogRef.close(this.editForm.value);  // Envía el valor actualizado al cerrar el diálogo
              },
              error: () => {
                Swal.fire({
                  title: '¡Error!',
                  text: 'Ha ocurrido un error al guardar los datos.',
                  confirmButtonColor: '#3f51b5',
                  icon: 'error' 
                });
              }
            });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }



}
