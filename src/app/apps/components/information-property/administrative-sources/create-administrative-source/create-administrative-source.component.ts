/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  AdministrativeSource,
  CreateAdministrativeSourceParams
} from 'src/app/apps/interfaces/information-property/administrative-source';
import { DynamicFormsComponent } from '../../../dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { INPUTS_ADMINISTRATIVE_SOURCE } from 'src/app/apps/constants/administrative-source.constants';
import { MatSelectModule } from '@angular/material/select';
import { TerritorialOrganizationService } from 'src/app/apps/services/territorial-organization/territorial-organization.service';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

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
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    // Custom
    DynamicFormsComponent
  ],
  templateUrl: './create-administrative-source.component.html',
  styleUrl: './create-administrative-source.component.scss'
})
export class CreateAdministrativeSourceComponent
  implements OnInit, AfterViewInit
{
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      executionId: string;
      baunitId: string;
      params?: AdministrativeSource;
    },
    private administrativeSourceService: AdministrativeSourcesService,
    private territorialOrganizationService: TerritorialOrganizationService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateAdministrativeSourceComponent>
  ) {}

  public form: FormGroup = new FormGroup({});
  public inputs: JSONInput[] = INPUTS_ADMINISTRATIVE_SOURCE;
  public departments: Department[] = [];
  public initValues?: AdministrativeSource;

  ngOnInit(): void {
    this.getDataDepartment(() => {
      if (this.data.params) {
        const formParams = {
          ...this.data.params,
          fechaDocumentoFuente: new Date(
            this.data.params.fechaDocumentoFuente + 'T00:00:00-05:00'
          )
        };
  
        this.initValues = formParams;
      }

      if (this.initValues?.departamentoOrigen) {
        const ccdpto = this.departments.find(department => department.divpolLvl1Name === this.initValues?.departamentoOrigen)!;

        if (ccdpto) {
          this.loadMunicipalities(ccdpto.divpolLvl1Code!)
          .subscribe(() => {
            this.form.reset(this.initValues);
          });
        }
        return;
      }
      this.form.reset(this.initValues);
      return;
    });

  }

  ngAfterViewInit(): void {
    this.getDataMunicipality();
  }

  requestManager(): void {
    this.form.markAllAsTouched();
    if (this.data.params) {
      this.editAdministrativeSourceFunction();
    } else {
      this.createAdministrativeSourceFunction();
    }
  }

  private getDataDepartment(callback: () => void): void {
    this.territorialOrganizationService
      .getAllDataDepartments()
      .subscribe((result: Department[]) => {
        this.departments = result;
        let departamentoOrigen: { label: string; value: string }[] = result.map(
          (dpto) => {
            return {
              label: dpto.divpolLvl1Name!,
              value: dpto.divpolLvl1Name!
            };
          }
        );
        departamentoOrigen = departamentoOrigen.sort((a, b) =>
          a.label.localeCompare(b.label)
        );

        this.inputs.find(
          (input) => input.name === 'departamentoOrigen'
        )!.options = departamentoOrigen;

        callback();
      });
  }

  private loadMunicipalities(divpolLvl1Code: string) {
    return this.territorialOrganizationService
      .getAllDataMunicipalities(divpolLvl1Code)
      .pipe(
        map((result: Municipality[]) => {
          let municipioOrigen = result.map(municipio => ({
            label: municipio.divpolLvl2Name!,
            value: municipio.divpolLvl2Name!
          }));
          
          municipioOrigen = municipioOrigen.sort((a, b) => a.label.localeCompare(b.label));
  
          const ciudadInput = this.inputs.find(input => input.name === 'ciudadOrigen');
          if (ciudadInput) {
            ciudadInput.options = municipioOrigen;
          }
        })
      );
  }

  getDataMunicipality(): void {
    this.form.get('departamentoOrigen')!.valueChanges.subscribe((value) => {
      this.form.get('ciudadOrigen')!.setValue(null);
      const ccdpto = this.departments.find(department => department.divpolLvl1Name === value)!;
      this.territorialOrganizationService
        .getAllDataMunicipalities(ccdpto.divpolLvl1Code!)
        .subscribe((result: Municipality[]) => {
          let municipioOrigen: { label: string; value: string }[] = result.map(
            (municipio) => {
              return {
                label: municipio.divpolLvl2Name!,
                value: municipio.divpolLvl2Name!
              };
            }
          );
          municipioOrigen = municipioOrigen.sort((a, b) =>
            a.label.localeCompare(b.label)
          );

          this.inputs.find((input) => input.name === 'ciudadOrigen')!.options =
            municipioOrigen;
        });
    });
  }

  createAdministrativeSourceFunction(): void {
    if (this.form.invalid) {
      this.handleError();
      return;
    };

    const formsValue: any = this.form.value;

    formsValue.fechaDocumentoFuente = formsValue.fechaDocumentoFuente
      ?.toISOString()
      .split('T')[0];

    const params: CreateAdministrativeSourceParams = {
      executionId: this.data.executionId,
      baunitId: this.data.baunitId,
      administrativeSource: formsValue
    };

    this.administrativeSourceService
      .createAdministrativeSource(params)
      .subscribe({
        next: (data: AdministrativeSource) => {
          this.snackbar.open('Fuente administrativa creada', 'CLOSE', {
            duration: 10000
          });
          this.dialogRef.close(data);
        },
        error: () => {
          this.snackbar.open(
            'Error al crear la fuente administrativa',
            'CLOSE',
            { duration: 10000 }
          );
        }
      });
  }

  editAdministrativeSourceFunction(): void {
    if (this.form.invalid) {
      this.handleError();
      return;
    };

    const formsValue: any = this.form.value;

    formsValue.fechaDocumentoFuente = formsValue.fechaDocumentoFuente
      .toISOString()
      .split('T')[0];

    this.administrativeSourceService
      .updateAdministrativeSource({
        baunitId: this.data.baunitId,
        executionId: this.data.executionId,
        params: {
          fuenteAdminId: this.data!.params!.fuenteAdminId,
          ...formsValue
        }
      })
      .subscribe({
        next: () => {
          this.snackbar.open('Fuente Administrativa actualizada', 'CLOSE', {
            duration: 10000
          });
          this.dialogRef.close();
        },
        error: () => {
          this.snackbar.open(
            'Error al actualizar la fuente administrativa',
            'CLOSE',
            { duration: 10000 }
          );
        }
      });
  }

  handleError(): void {
    const errorList: any[] = [];
    Object.values(this.form.controls).forEach((control) => {
      if (!control.errors) return;
      errorList.push(control.errors);
    });

    console.log(errorList);

    if (errorList.some((error) => error.required)) {
      this.snackbar.open('Por favor, completa todos los campos', 'Aceptar', { duration: 5000 });
      return;
    }

    if (errorList.some((error) => error.futureDate)) {
      this.snackbar.open('La fecha de inicio no puede ser mayor a la fecha actual', 'Aceptar', { duration: 5000 });
      return;
    }
  }
}
