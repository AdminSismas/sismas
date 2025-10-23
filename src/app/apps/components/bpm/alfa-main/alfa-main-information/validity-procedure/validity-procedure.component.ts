import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlfaMainService } from '@shared/services';
import { ChangeControl } from 'src/app/apps/interfaces/bpm/change-control';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from 'src/app/apps/constants/general/constants';

interface DialogDataValidity {
  executionId: string;
  validateChangeLog: ChangeControl;
}

@Component({
  selector: 'vex-validity-procedure',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './validity-procedure.component.html',
  providers: [
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ValidityProcedureComponent implements OnInit{

  fb = inject(FormBuilder);
  alfaMainService = inject(AlfaMainService);
  data: DialogDataValidity = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ValidityProcedureComponent>);

  validityForm = this.fb.group({
    beginAt: ['', Validators.required],
    validity: ['', Validators.required]
  });
  validityOptions = signal<string[]>([]);
  maxDate = signal<Date>(new Date());

  ngOnInit() {
    this.getValidityOptions();
    this.resetValidityForm();
  }

  resetValidityForm() {
    this.validityForm.patchValue({
      beginAt: this.data.validateChangeLog.beginAt,
      validity: this.data.validateChangeLog.validity
    });
  }

  getValidityOptions() {
    this.alfaMainService.getValidityOptions(this.data.executionId)
    .subscribe({
      next: (response) => {
        this.validityOptions.set(response);
      }
    });
  }

  sendDialogButton() {
    const formValue = this.validityForm.value!;

    const beginAtFormat = new Date(formValue['beginAt']!);

    formValue.beginAt = beginAtFormat.toISOString().split('T')[0] as string;

    const body: ChangeControl = {
      ...this.data.validateChangeLog,
      ...formValue
    };

    this.alfaMainService.changeValidityProcedure(this.data.executionId, body)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close(false);
        }
      });

    // Aquí puedes realizar la lógica adicional que necesites con los valores seleccionados
  }
}
