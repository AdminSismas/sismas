import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AdministrativeSource, CreateAdministrativeSourceParams } from 'src/app/apps/interfaces/information-property/administrative-source';

@Component({
  selector: 'vex-create-administrative-source',
  standalone: true,
  imports: [
    ComboxColletionComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
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
    private fb: FormBuilder
  ) { }

  public form = this.fb.group({
    domFuenteAdministrativaTipo: ['', Validators.required],
    fechaDocumentoFuente: [new Date(), Validators.required],
    numeroFuente: ['', Validators.required],
    enteEmisor: ['', Validators.required]
  })

  ngOnInit(): void {
    console.log(this.data.params)
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
