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
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';
import { PeopleService } from 'src/app/apps/services/people.service';
import { People } from 'src/app/apps/interfaces/people.model';


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
export class AddPropertyOwnerComponent implements OnInit {

  public form: FormGroup = this.fb.group({})
  public secondForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    otherLastName: ['', Validators.required],
    domIndividualSex: ['', Validators.required],
    domIndividualEthnicGroup: ['', Validators.required],
  })

  public infoDoc: string = 'ID';
  public document = new UntypedFormControl();
  public customers: People[] = [];
  public dataSource: People[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ContentInfoSchema,
    private dialogRef: MatDialogRef<AddPropertyOwnerComponent>,
    private fb: FormBuilder,
    private rrrightService: RrrightService,
    private peopleService: PeopleService
  ) { }

  ngOnInit(): void {
    console.log(this.defaults)
    this.secondForm.disable()
  }

  close(): void {
    this.dialogRef.close();
  }

  infoSelect(info: string) {
    this.infoDoc = info
  }

  searchPerson(): void {
    console.log('Consultar')

    this.peopleService.getPeopleTypeNumber({ number: this.document.value, individualTypeNumber: this.infoDoc })
      .subscribe((res: any) => {
        this.customers = [res];

        console.log(res)
        this.secondForm.enable()
        this.setFormValue()
      })
    }

    setFormValue() {
      this.secondForm.setValue({
        firstName: this.customers[0].firstName,
        middleName: this.customers[0].middleName,
        lastName: this.customers[0].lastName,
        otherLastName: this.customers[0].otherLastName,
        domIndividualSex: this.customers[0].domIndividualSex,
        domIndividualEthnicGroup: this.customers[0].domIndividualEthnicGroup
      })
      console.log(this.secondForm.value)
    }

}
