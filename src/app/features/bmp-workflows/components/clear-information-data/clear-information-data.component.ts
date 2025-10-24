import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ClearInformationData } from '@shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {
  CONSTANT_MSG_ERROR_CLEAR_INFORMATION,
  CONSTANT_NAME_CONFIRMATION
} from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TWO_POINT_ } from '@shared/constants';

@Component({
  selector: 'vex-clear-information-data',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    MatDialogClose,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './clear-information-data.component.html',
  styleUrl: './clear-information-data.component.scss'
})
export class ClearInformationDataComponent implements OnInit{

  message!: string;

  form = this.fb.group({
    clearData: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public defaults: ClearInformationData | undefined,
    public dialogRef: MatDialogRef<ClearInformationDataComponent>,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(){
    if (!this.defaults || !this.defaults?.keyWord) {
      this.closed();
      return;
    }
    this.message = this.defaults?.message;
  }

  get validateInputClearInformation() {
    return this.form.get('clearData')?.value !== this.defaults?.keyWord;
  }

  validateClearInformation(){
    const objectform = this.form.value;
    if (objectform == null || !objectform.clearData) {
      this.snackbar.open(
        'Información no correspondiente, consulte al administrador.',
        'CERRAR', { duration: 10000 }
      );
    }

    if(objectform.clearData !== this.defaults?.keyWord){
      this.snackbar.open(
        'No se puede continuar palabra incorrecta, consulte al administrador.',
        'CERRAR', { duration: 10000 }
      );
      return;
    }

    this.closed(objectform.clearData);
  }

  closed(keyWord: string | null = null) {
    if(!keyWord){
      this.dialogRef.close();
      return;
    }
    this.dialogRef.close(keyWord);
  }

  protected readonly CONSTANT_NAME_CONFIRMATION = CONSTANT_NAME_CONFIRMATION;
  protected readonly CONSTANT_MSG_ERROR_CLEAR_INFORMATION = CONSTANT_MSG_ERROR_CLEAR_INFORMATION;
  protected readonly TWO_POINT_ = TWO_POINT_;
}
