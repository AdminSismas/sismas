import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, map, Observable } from 'rxjs';
import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';import {
  CREATE_USER_INPUTS,
  SEARCH_INPUTS
} from '@shared/constants/users.constants';
import { JSONInput } from '@shared/interfaces/forms';
import { InfoPerson } from '@features/property-management/models/info-person';
import {
  User,
  CreateUserParams
} from '@features/tenant-configuration/models';
import { PeopleService } from '@features/property-management/services/property/people.service';
import { CadastralUserService } from '@features/tenant-configuration/services/users/user.service';
import { CreatePeopleComponent } from '@features/operation-support/components/people/create-people/create-people.component';
import { MODAL_SMALL_LARGE } from '@shared/constants/constants';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  /* ---- Injects ---- */
  private peopleService = inject(PeopleService);
  private cadastralUserService = inject(CadastralUserService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<CreateUsersComponent>);
  public data = inject(MAT_DIALOG_DATA);

  public searchInputs: JSONInput[] = SEARCH_INPUTS;
  public createUserInputs: JSONInput[] = CREATE_USER_INPUTS;

  public searchForm?: FormGroup;
  public newUserForm?: FormGroup;
  public individualFound?: InfoPerson | undefined;
  public newUserFormDisabled = true;
  public searchFormDisabled = false;
  public initValuesSearchForm?: {
    number: string;
    individualTypeNumber: string;
  };

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
      Swal.fire({
        text: 'Se deben diligenciar el número de documento y el tipo de documento',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        timer: 10000
      });
      return;
    }
    const { number, domIndividualTypeNumber } = this.searchForm!.value;
    this.peopleService
      .getPersonByDocumentNumber({ number, domIndividualTypeNumber })
      .subscribe({
        next: (result: InfoPerson) => {
          this.individualValidator(result.individualId).subscribe(
            (resultValidation: boolean) => {
              if (!resultValidation) {
                this.individualFound = result;
                this.searchFormDisabled = true;
                this.newUserFormDisabled = false;
              } else {
                Swal.fire({
                  text: 'El individuo ya tiene un usuario asociado',
                  icon: 'error',
                  confirmButtonText: 'Cerrar',
                  timer: 10000
                });
              }
            }
          );
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            Swal.fire({
              text: 'Creando individuo',
              icon: 'warning',
              confirmButtonText: 'Cerrar',
              timer: 10000
            });
            this.dialog
              .open(CreatePeopleComponent, {
                ...MODAL_SMALL_LARGE,
                disableClose: true,
                data: {
                  number: this.searchForm!.value.number,
                  domIndividualTypeNumber:
                    this.searchForm!.value.domIndividualTypeNumber,
                  mode: 'create'
                }
              })
              .afterClosed()
              .subscribe();
          }
        }
      });
  }

  createIndividual(): void {
    this.dialog
      .open(CreatePeopleComponent, {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: {
          number: this.searchForm!.value.number,
          domIndividualTypeNumber: this.searchForm!.value.individualTypeNumber,
          mode: 'create'
        }
      })
      .afterClosed()
      .subscribe();
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
      Swal.fire({
        text: 'Se deben diligenciar los datos del usuario',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        timer: 10000
      });
      return;
    }

    this.usernameAndEmailValidator().subscribe((result: boolean) => {
      if (!result) {
        this.createUserService();
      }
    });
  }

  usernameAndEmailValidator(): Observable<boolean> {
    const { email } = this.newUserForm!.value;
    const username: string =
      `${this.individualFound!.firstName}.${this.individualFound!.lastName}`.toLowerCase();

    return forkJoin({
      usernameExists: this.cadastralUserService.existUserName(username),
      emailExists: this.cadastralUserService.existEmail(email)
    }).pipe(
      map((result) => {
        if (result.usernameExists) {
          this.newUserForm
            ?.get('username')
            ?.setErrors({ usernameExists: true });
          Swal.fire({
            text: 'El nombre de usuario ya existe',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            timer: 10000
          });
          return true;
        }

        if (result.emailExists) {
          this.newUserForm?.get('email')?.setErrors({ emailExists: true });
          Swal.fire({
            text: 'El correo electrónico ya existe',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            timer: 10000
          });
          return true;
        }

        return false;
      })
    );
  }

  individualValidator(individualId: number): Observable<boolean> {
    return this.cadastralUserService.existIndividual(individualId).pipe(
      map((result: boolean) => {
        if (!result) {
          this.newUserForm
            ?.get('individualId')
            ?.setErrors({ individualIdExists: true });
          return false;
        }
        return true;
      })
    );
  }

  createUserService(): void {
    const username = this.formatUsername(
      this.individualFound!.firstName,
      this.individualFound!.lastName
    );

    const params: CreateUserParams = {
      username: username,
      email: this.newUserForm!.value.email,
      individual: {
        individualId: this.individualFound!.individualId
      }
    };

    this.cadastralUserService.createUser(params).subscribe({
      next: (result) => {
        Swal.fire({
          text: 'Usuario creado exitosamente',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          timer: 10000
        });
        this.dialogRef.close(result);
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
      Swal.fire({
        text: 'Se deben diligenciar los datos del usuario',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        timer: 10000
      });
      return;
    }

    this.cadastralUserService
      .existEmail(this.newUserForm!.value.email)
      .subscribe((result: boolean) => {
        if (!result) {
          this.editUserService();
        }
      });
  }

  editUserService(): void {
    this.cadastralUserService
      .updateUser(this.data.userId!, this.newUserForm!.value.email)
      .subscribe({
        next: (result: User) => {
          Swal.fire({
            text: 'Usuario actualizado exitosamente',
            icon: 'success',
            confirmButtonText: 'Cerrar',
            timer: 10000
          });
          this.dialogRef.close(result);
        }
      });
  }
}
