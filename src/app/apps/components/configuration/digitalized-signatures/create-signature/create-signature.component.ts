// Angular framework
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

// Vex

// Material
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Custom
import { DynamicFormsComponent } from '../../../dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import {
  CREATE_SIGNATURE_INPUTS,
  SEARCH_INPUTS
} from 'src/app/apps/constants/digitalized-signatures.constants';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { DigitalizedSignaturesService } from 'src/app/apps/services/users/digitalized-signatures.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class CreateSignatureComponent implements OnInit {
  public searchForm: FormGroup = new FormGroup({});
  public searchInputs: JSONInput[] = SEARCH_INPUTS;
  public createForm: FormGroup = new FormGroup({});
  public createInputs: JSONInput[] = CREATE_SIGNATURE_INPUTS;
  public personName = '';
  public disableCreateForm = true;
  public username?: string;

  private userId?: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { username: string } | undefined,
    private userService: UserService,
    private dialogRef: MatDialogRef<CreateSignatureComponent>,
    private digitalizedSignaturesService: DigitalizedSignaturesService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.data?.username) {
      this.username = this.data.username;
      this.searchUser();
    }
  }

  searchUser() {
    const username = this.username ? this.username : this.searchForm.value.username;
    this.userService.getUserInfo(username).subscribe({
      next: (res) => {
        this.personName = res.individual.fullName;
        this.userId = res.userId;
        this.disableCreateForm = false;
      }
    });
  }

  createSignature() {
    const signatureFile = this.createForm.get('signature')?.value;
    const formData = new FormData();
    formData.append('file', signatureFile);

    this.digitalizedSignaturesService
      .addSignature(this!.userId!, formData)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackbar.open('Error al agregar la firma', 'CERRAR', {
            duration: 10000
          });
          throw error;
        }
      });
  }
}
