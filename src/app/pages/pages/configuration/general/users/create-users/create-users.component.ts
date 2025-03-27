import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, map, Observable } from 'rxjs';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';
import { CREATE_USER_INPUTS, SEARCH_INPUTS } from '../../../../../../apps/constants/general/users.constants';
import { JSONInput } from '../../../../../../apps/interfaces/forms/dynamic-forms';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { User, CreateOutput, CreateUserDialogData, CreateUserParams } from 'src/app/apps/interfaces/users/user';
import { PeopleService } from '../../../../../../apps/services/users/people.service';
import { UserService } from 'src/app/apps/services/users/user.service';
import {
  CreatePeopleComponent
} from 'src/app/pages/pages/operation-support/people/create-people/create-people.component';

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
export class CreateUsersComponent implements OnInit {

  public searchInputs: JSONInput[] = SEARCH_INPUTS;
  public createUserInputs: JSONInput[] = CREATE_USER_INPUTS;

  public searchForm?: FormGroup;
  public newUserForm?: FormGroup;
  public individualFound?: InfoPerson | undefined;
  public newUserFormDisabled = true;
  public searchFormDisabled = false;
  public initValuesSearchForm?: { number: string; individualTypeNumber: string; };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateUserDialogData,
    private peopleService: PeopleService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateUsersComponent>
  ) { }

  ngOnInit(): void {
    if (this.data.mode === 'edit') {
      this.newUserFormDisabled = false;
      this.newUserForm?.reset(this.data);
      this.initValuesSearchForm = {
        number: this.data.individual.number,
        individualTypeNumber: this.data.individual.domIndividualTypeNumber
      };
      this.searchFormDisabled = true;
    }
  }

  actionBtnLabel(): string {
    if (this.data.mode === 'create') {
      return 'Crear';
    }
    return 'Editar';
  }

  searchIndividual(): void {
    if (this.searchForm!.invalid) {
      this.snackbar.open('Se deben diligenciar el número de documento y el tipo de documento', 'CERRAR', {
        duration: 10000
      });
      return;
    }
    const { number, individualTypeNumber } = this.searchForm!.value;
    this.peopleService.getPeopleTypeNumber({ number, individualTypeNumber })
      .subscribe({
        next: (result: InfoPerson) => {
          this.individualValidator(result.individualId)
            .subscribe((resultValidation: boolean) => {
              if (!resultValidation) {
                this.individualFound = result;
                this.searchFormDisabled = true;
                this.newUserFormDisabled = false;
              } else {
                this.snackbar.open('El individuo ya tiene un usuario asociado', 'CERRAR', { duration: 10000 });
              }
            });
        },
        error: (error: any) => {
          if (error.status === 404) {
            this.snackbar.open('Creando persona', 'CERRAR', { duration: 10000 });
            this.dialog.open(CreatePeopleComponent, {
              data: {
                number: this.searchForm!.value.number,
                domIndividualTypeNumber: this.searchForm!.value.individualTypeNumber,
                mode: 'create'
              }
            }).afterClosed()
              .subscribe({
                next: (result: any) => {
                },
                error: (error: any) => {
                  this.snackbar.open('Error al crear el individuo', 'CERRAR', { duration: 10000 });
                  throw error;
                }
              });
          }
        }
      });
  }

  createIndividual(): void {
    this.snackbar.open('Creando usuario', 'CERRAR', { duration: 10000 });

    this.dialog.open(CreatePeopleComponent, {
      data: {
        number: this.searchForm!.value.number,
        domIndividualTypeNumber: this.searchForm!.value.individualTypeNumber,
        mode: 'create'
      }
    }).afterClosed()
      .subscribe({
        next: (result: any) => {
        },
        error: (error: any) => {
          this.snackbar.open('Error al crear el individuo', 'CERRAR', { duration: 10000 });
          throw error;
        }
      });

  }

  actionBtn(): void {
    if (this.data.mode === 'create') {
      this.createUser();
    } else if (this.data.mode === 'edit') {
      this.editUser();
    }
  }

  createUser(): void {
    if (this.newUserForm!.invalid) {
      this.snackbar.open('Se deben diligenciar los datos del usuario', 'CERRAR', { duration: 10000 });
      return;
    }

    this.usernameAndEmailValidator()
      .subscribe((result: boolean) => {
        if (!result) {
          this.createUserService();
        }
      });
  }

  usernameAndEmailValidator(): Observable<boolean> {
    const { email } = this.newUserForm!.value;
    const username: string = `${this.individualFound!.firstName}.${this.individualFound!.lastName}`.toLowerCase();

    return forkJoin({
      usernameExists: this.userService.existUserName(username),
      emailExists: this.userService.existEmail(email)
    }).pipe(
      map((result: any) => {
        if (result.usernameExists) {
          this.newUserForm?.get('username')?.setErrors({ usernameExists: true });
          this.snackbar.open('El nombre de usuario ya existe', 'CERRAR', { duration: 10000 });
          return true;
        }

        if (result.emailExists) {
          this.newUserForm?.get('email')?.setErrors({ emailExists: true });
          this.snackbar.open('El correo electrónico ya existe', 'CERRAR', { duration: 10000 });
          return true;
        }

        return false;
      }));
  }

  individualValidator(individualId: number): Observable<boolean> {
    return this.userService.existIndividual(individualId)
      .pipe(map((result: boolean) => {
        if (!result) {
          this.newUserForm?.get('individualId')?.setErrors({ individualIdExists: true });
          return false;
        }

        return true;
      }));

  }

  createUserService(): void {
    const username = this.formatUsername(this.individualFound!.firstName, this.individualFound!.lastName);

    const params: CreateUserParams = {
      username: username,
      email: this.newUserForm!.value.email,
      individual: {
        individualId: this.individualFound!.individualId
      }
    };

    this.userService.createUser(params)
      .subscribe({
        next: (result: CreateOutput) => {
          this.snackbar.open('Usuario creado', 'CERRAR', { duration: 10000 });
          this.dialogRef.close(result);
        },
        error: (error: any) => {
          this.snackbar.open('Error al crear el usuario', 'CERRAR', { duration: 10000 });
          this.dialogRef.close();
          throw error;
        }
      });
  }

  formatUsername(firstName: string, lastName: string): string {
    let username = `${firstName}.${lastName}`;
    username = username.toLowerCase();
    username = username.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return username;

  }

  editUser(): void {
    if (this.newUserForm!.invalid) {
      this.snackbar.open('Se deben diligenciar los datos del usuario', 'CERRAR', { duration: 10000 });
      return;
    }

    this.userService.existEmail(this.newUserForm!.value.email)
      .subscribe((result: boolean) => {
        if (!result) {
          this.editUserService();
        }
      });
  }

  editUserService(): void {
    this.userService.updateUser(this.data.userId!, this.newUserForm!.value.email)
      .subscribe({
        next: (result: User) => {
          this.snackbar.open('Usuario actualizado', 'CERRAR', { duration: 10000 });
          this.dialogRef.close(result);
        },
        error: (error: any) => {
          this.snackbar.open('Error al actualizar el usuario', 'CERRAR', { duration: 10000 });
          this.dialogRef.close();
          throw error;
        }
      });
  }
}

