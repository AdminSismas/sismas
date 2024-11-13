import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';

@Component({
  selector: 'vex-editing-property-owner',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './editing-property-owner.component.html',
  styleUrl: './editing-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditingPropertyOwnerComponent {

  public form: FormGroup = this.fb.group({
    fraction: [0, Validators.required],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rrrightService: RrrightService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditingPropertyOwnerComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  editRrrightOwnerProperty(): any {
    console.log(this.form.value)
  }
}
