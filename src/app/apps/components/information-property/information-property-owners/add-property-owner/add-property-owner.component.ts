import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ContentInfoSchema } from 'src/app/apps/interfaces/content-info-schema';


@Component({
  selector: 'vex-add-property-owner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ComboxColletionComponent,
    MatButtonModule,
    MatButtonToggleModule
  ],
  templateUrl: './add-property-owner.component.html',
  styleUrl: './add-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPropertyOwnerComponent implements OnInit{

  public form: FormGroup = this.fb.group({

  })
  public infoDoc: string = 'ID';
  public document = new UntypedFormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema,
    private dialogRef: MatDialogRef<AddPropertyOwnerComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log(this.defaults)
  }

  close(): void {
    this.dialogRef.close();
  }

  infoSelect( info: string ) {
    this.infoDoc = info
  }

  searchPerson(): void {
    console.log('Consultar')
    console.log(this.document.value)
    console.log(this.infoDoc)
  }

}
