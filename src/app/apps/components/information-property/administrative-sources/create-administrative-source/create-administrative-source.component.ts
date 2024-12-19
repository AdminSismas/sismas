import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdministrativeSource, CreateAdministrativeSourceParams } from 'src/app/apps/interfaces/information-property/administrative-source';
import { DynamicFormsComponent } from '../../../dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { INPUTS_ADMINISTRATIVE_SOURCE } from 'src/app/apps/constants/administrative-source.constants';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'vex-create-administrative-source',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    // Custom
    DynamicFormsComponent,
  ],
  templateUrl: './create-administrative-source.component.html',
  styleUrl: './create-administrative-source.component.scss'
})
export class CreateAdministrativeSourceComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { executionId: string, baunitId: string, params?: AdministrativeSource },
    private administrativeSourceService: AdministrativeSourcesService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateAdministrativeSourceComponent>,
  ) { }

  public form: FormGroup = new FormGroup({})
  public inputs: JSONInput[] = INPUTS_ADMINISTRATIVE_SOURCE

  ngOnInit(): void {
    if (this.data.params) {
      const formParams = {
        domFuenteAdministrativaTipo: this.data.params.domFuenteAdministrativaTipo,
        fechaDocumentoFuente: new Date(this.data.params.fechaDocumentoFuente + 'T00:00:00-05:00'),
        numeroFuente: this.data.params.numeroFuente,
        enteEmisor: this.data.params.enteEmisor
      }

      this.form.reset(formParams)
    }
  }

  requestManager(): void {
    if (this.data.params) {
      this.editAdministrativeSourceFunction()
    } else {
      this.createAdministrativeSourceFunction()
    }
  }


  createAdministrativeSourceFunction(): void {
    const formsValue: any = this.form.value;

    formsValue.fechaDocumentoFuente = formsValue.fechaDocumentoFuente?.toISOString().split('T')[0];
    formsValue.enteEmisor = `${formsValue.cateEnteEmisor} ${formsValue.tipoEnteEmisor}`

    const params: CreateAdministrativeSourceParams = {
      executionId: this.data.executionId,
      baunitId: this.data.baunitId,
      administrativeSource: formsValue
    }

    this.administrativeSourceService.createAdministrativeSource(params)
      .subscribe({
        next: (data: AdministrativeSource) => {
          this.snackbar.open('Fuente administrativa creada', 'CLOSE', { duration: 4000 })
          this.dialogRef.close(data)
        },
        error: (error: any) => {
          this.snackbar.open('Error al crear la fuente administrativa', 'CLOSE', { duration: 4000 })
        }
      })
  }

  editAdministrativeSourceFunction(): void {
    const formsValue: any = this.form.value;

    formsValue.fechaDocumentoFuente = formsValue.fechaDocumentoFuente.toISOString().split('T')[0]

    this.administrativeSourceService.updateAdministrativeSource({
      baunitId: this.data.baunitId,
      executionId: this.data.executionId,
      params: {
        fuenteAdminId: this.data!.params!.fuenteAdminId,
        ...formsValue
      }
    })
      .subscribe({
        next: (data: AdministrativeSource) => {
          this.snackbar.open('Fuente Administrativa actualizada', 'CLOSE', { duration: 4000 })
          this.dialogRef.close()
        },
        error: (error: any) => {
          this.snackbar.open('Error al actualizar la fuente administrativa', 'CLOSE', { duration: 4000 })
        }
      })
  }
}
