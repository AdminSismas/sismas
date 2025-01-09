// Angular framework
import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

// Vex

// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

// Custom
import { DynamicFormsComponent } from '../../../dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { PeopleService } from 'src/app/apps/services/people.service';
import { SEARCH_INPUTS } from 'src/app/apps/constants/users.constants';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { CREATE_SIGNATURE_INPUTS } from 'src/app/apps/constants/digitalized-signatures.constants';

@Component({
  selector: 'vex-create-signature',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    // Custom
    DynamicFormsComponent
  ],
  templateUrl: './create-signature.component.html',
  styles: ``
})
export class CreateSignatureComponent {
  public searchForm: FormGroup = new FormGroup({});
  public searchInputs: JSONInput[] = SEARCH_INPUTS;
  public createForm: FormGroup = new FormGroup({});
  public createInputs: JSONInput[] = CREATE_SIGNATURE_INPUTS;

  public personName = '';
  public disableCreateForm = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private peopleService: PeopleService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateSignatureComponent>
  ) {}

  searchPeople() {
    this.peopleService
      .getPeopleTypeNumber(this.searchForm.value)
      .subscribe((data: InfoPerson) => {
        this.personName = data.fullName;
        this.disableCreateForm = false;
      });
  }

  createSignature() {
    this.dialogRef.close(this.createForm.value);
  }
}
