import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AlfaMainService } from 'src/app/apps/services/bpm/core/alfa-main.service';

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
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './auto-appraisal.component.html'
})
export class AutoAppraisalComponent implements OnInit {
  fb = inject(FormBuilder);
  data = inject<AutoAppraisalData>(MAT_DIALOG_DATA);
  alfaMainService = inject(AlfaMainService);
  dialogRef = inject(MatDialogRef);

  validityOptions = signal<string[]>([]);
  autoAppraisalForm = signal<FormGroup>(
    this.fb.group({
      validity: ['', Validators.required],
      selfValuationValue: ['', Validators.required]
    })
  );

  ngOnInit(): void {
    this.getValidityOptions();
  }

  getValidityOptions(): void {
    this.alfaMainService.getValidityOptions(this.data.executionId).subscribe({
      next: (response) => {
        this.validityOptions.set(response);
      }
    });
  }

  sendAppraisalForm() {
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
}
