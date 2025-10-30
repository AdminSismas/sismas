import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main.service';import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';import { JSONInput } from 'src/app/apps/interfaces/forms/dynamic-forms';
import { AUTO_APPRAILSAL_INPUTS } from 'src/app/apps/constants/information-property/appraisal.constants';
import { map, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

interface AutoAppraisalData {
  executionId: string;
  baunitId: string;
}

@Component({
  selector: 'vex-auto-appraisal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    DynamicFormsComponent
  ],
  templateUrl: './auto-appraisal.component.html'
})
export class AutoAppraisalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  data = inject<AutoAppraisalData>(MAT_DIALOG_DATA);
  alfaMainService = inject(AlfaMainService);
  dialogRef = inject(MatDialogRef);

  autoAppraisalForm = signal<FormGroup>(new FormGroup({}));
  formInputJson = signal<JSONInput[]>(AUTO_APPRAILSAL_INPUTS);
  toggleTotalValuationSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.getValidityOptions();
  }

  ngAfterViewInit(): void {
    this.createToggleTotalValuationSubscription();
  }

  ngOnDestroy(): void {
    if (this.toggleTotalValuationSubscription) {
      this.toggleTotalValuationSubscription.unsubscribe();
    }
  }

  createToggleTotalValuationSubscription(): void {
    this.autoAppraisalForm().controls['selfValuationValueLand'].enable();
    this.autoAppraisalForm().controls['selfValuationValueUnits'].enable();
    this.autoAppraisalForm().controls['selfValuationValue'].disable();

    this.toggleTotalValuationSubscription = this.autoAppraisalForm().controls[
      'toggleValuationType'
    ].valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.autoAppraisalForm().controls['selfValuationValueLand'].disable();
        this.autoAppraisalForm().controls['selfValuationValueUnits'].disable();
        this.autoAppraisalForm().controls['selfValuationValue'].enable();
      } else {
        this.autoAppraisalForm().controls['selfValuationValueLand'].enable();
        this.autoAppraisalForm().controls['selfValuationValueUnits'].enable();
        this.autoAppraisalForm().controls['selfValuationValue'].disable();
      }
    });
  }

  getValidityOptions(): void {
    this.alfaMainService
      .getValidityOptions(this.data.executionId)
      .pipe(
        map((response) =>
          response.map((item) => ({ value: item, label: item }))
        )
      )
      .subscribe((response) => {
        this.setupFormInputs(response);
      });
  }

  setupFormInputs(response: { value: string; label: string }[]): void {
    this.formInputJson.update((inputs) => {
      return inputs.map((input) => {
        if (input.name === 'validity') {
          input.options = response;
        }
        return input;
      });
    });
  }

  sendAppraisalForm() {
    if (!this.validationForm()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos habilitados.',
        icon: 'error',
        timer: 2000
      });
      return;
    }

    const params = this.autoAppraisalForm().value;
    const { executionId, baunitId } = this.data;

    this.alfaMainService
      .autoAppraisalExecution(executionId, baunitId, params)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close(false);
        }
      });
  }

  validationForm(): boolean {
    const totalAppraisal = this.autoAppraisalForm().get(
      'toggleValuationType'
    )?.value;
    const {
      selfValuationValue,
      selfValuationValueUnits,
      selfValuationValueLand
    } = this.autoAppraisalForm().value;
    if (totalAppraisal) {
      return (
        selfValuationValue !== null &&
        selfValuationValue !== undefined &&
        selfValuationValue !== ''
      );
    }
    return (
      selfValuationValueLand !== null &&
      selfValuationValueLand !== undefined &&
      selfValuationValueLand !== '' &&
      selfValuationValueUnits !== null &&
      selfValuationValueUnits !== undefined &&
      selfValuationValueUnits !== ''
    );
  }
}
