import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormsComponent } from 'src/app/apps/components/dynamic-forms/dynamic-forms.component';
import { SEARCH_INPUTS } from 'src/app/apps/constants/users.constants';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { CreateUserDialogData, DOMIndividualTypeNumber } from 'src/app/apps/interfaces/users/user';
import { PeopleService } from 'src/app/apps/services/people.service';
import { UserService } from 'src/app/apps/services/users/user.service';
import { CreatePeopleComponent } from 'src/app/pages/pages/operation-support/people/create-people/create-people.component';

@Component({
  selector: 'vex-create-users',
  standalone: true,
  imports: [
    /* Material */
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    /* Vex */
    /* Custom */
    DynamicFormsComponent
  ],
  templateUrl: './create-users.component.html',
  styles: ``
})
export class CreateUsersComponent {

  public searchForm?: FormGroup;
  public newUserForm?: FormGroup;
  public searchInputs: JSONInput[] = SEARCH_INPUTS;
  public individualFinded?: InfoPerson | undefined;

  @ViewChild('searchButton', { static: true }) searchButton!: MatButton;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateUserDialogData,
    private peopleService: PeopleService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  searchIndividual(): void {
    if (this.searchForm!.invalid) {
      this.snackbar.open('Se deben diligenciar el número de documento y el tipo de documento', 'CLOSE', {
        duration: 4000
      })
      return
    }
    const { number, individualTypeNumber } = this.searchForm!.value
    this.peopleService.getPeopleTypeNumber({ number, individualTypeNumber })
      .subscribe({
        next: (result: InfoPerson) => {
          this.individualFinded = result
          this.searchForm?.disable()
          this.searchButton.disabled = true
          console.log(result)
        },
        error: (error: any) => {
          if (error.status === 404) {
            this.createIndividual()
          } else {
            this.snackbar.open('Error al obtener información del individuo', 'CLOSE', { duration: 4000 })
            throw error
          }
        }
      })
  }

  createIndividual(): void {
    this.snackbar.open('Creando usuario', 'CLOSE', { duration: 4000 })

    this.dialog.open(CreatePeopleComponent, {
      data: {
        number: this.searchForm!.value.number,
        domIndividualTypeNumber: this.searchForm!.value.individualTypeNumber,
        mode: 'create'
      }
    }).afterClosed()
      .subscribe({
        next: (result: any) => {
          console.log(result)
        },
        error: (error: any) => {
          this.snackbar.open('Error al crear usuario', 'CLOSE', {
            duration: 4000
          })
          throw error
        }
      })
  }
}

