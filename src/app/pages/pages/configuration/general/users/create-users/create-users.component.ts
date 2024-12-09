import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable } from 'rxjs';
import { DynamicFormsComponent } from 'src/app/apps/components/dynamic-forms/dynamic-forms.component';
import { CREATE_USER_INPUTS, SEARCH_INPUTS } from 'src/app/apps/constants/users.constants';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { CreateUserDialogData, CreateUserParams, User } from 'src/app/apps/interfaces/users/user';
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

  public searchInputs: JSONInput[] = SEARCH_INPUTS;
  public createUserInputs: JSONInput[] = CREATE_USER_INPUTS;

  public searchForm?: FormGroup;
  public newUserForm?: FormGroup;
  public individualFinded?: InfoPerson | undefined;
  public newUserFormDisabled: boolean = true;

  @ViewChild('searchButton', { static: true }) searchButton!: MatButton;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateUserDialogData,
    private peopleService: PeopleService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateUsersComponent>
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
          console.log(this.newUserFormDisabled)
          this.newUserFormDisabled = false
          console.log(this.newUserFormDisabled)

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
          this.snackbar.open('Error al crear el individuo', 'CLOSE', { duration: 4000 })
          throw error
        }
      })

  }

  createUser(): void {
    if (this.newUserForm!.invalid) {
      this.snackbar.open('Se deben diligenciar los datos del usuario', 'CLOSE', { duration: 4000 })
      return
    }

    this.usernameAndEmailValidator()
      .subscribe((result: boolean) => {
        if (!result) {
          this.createUserService()
        }
      })
  }

  usernameAndEmailValidator(): Observable<boolean> {
    const { username, email } = this.newUserForm!.value

    return forkJoin({
      usernameExists: this.userService.existUserName(username),
      emailExists: this.userService.existEmail(email)
    }).pipe(
      map((result: any) => {
        if (result.usernameExists) {
          this.newUserForm?.get('username')?.setErrors({ usernameExists: true })
          this.snackbar.open('El nombre de usuario ya existe', 'CLOSE', { duration: 4000 })
          return true
        }

        if (result.emailExists) {
          this.newUserForm?.get('email')?.setErrors({ emailExists: true })
          this.snackbar.open('El correo electrónico ya existe', 'CLOSE', { duration: 4000 })
          return true
        }

        return false
      }))
  }

  createUserService(): void {
    const params: CreateUserParams = {
      username: this.newUserForm!.value.username,
      email: this.newUserForm!.value.email,
      individual: {
        individualId: this.individualFinded!.individualId
      }
    }

    this.userService.createUser(params)
      .subscribe({
        next: (result: string) => {
          this.snackbar.open('Usuario creado', 'CLOSE', { duration: 4000 })
          console.log('Hasta aquí no hay error')
          this.dialogRef.close(result)
        },
        error: (error: any) => {
          this.snackbar.open('Error al crear el usuario', 'CLOSE', { duration: 4000 })
          this.dialogRef.close()
          throw error
        }
      })
  }
}

