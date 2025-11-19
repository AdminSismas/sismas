import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TABLE_REASSIGN_PROCEDURE } from '@features/bpm-workflows/constants/procedures/procedures.constants';
import { InformationPageableUser } from '@features/configuration/interfaces/users/user';
import { ProceduresService } from '@shared/services/general/procedures.service';
import { CadastralUserService } from '@features/configuration/services/general/users/user.service';

interface RowUserAssign {
  userId: number;
  username: string;
  email: string;
  fullName: string;
}

@Component({
  selector: 'vex-reassign-procedure',
  standalone: true,
  imports: [
    TitleCasePipe,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reassign-procedure.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReassignProcedureComponent implements OnInit {
  dataUser: InformationPageableUser = {} as InformationPageableUser;
  dataSource: RowUserAssign[] = [];
  dataSource$: RowUserAssign[] = [];
  selectedUser: RowUserAssign | null = null;

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { executionId: number },
    private cadastralUserService: CadastralUserService,
    private procedureService: ProceduresService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ReassignProcedureComponent>,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      filter: ['']
    });
  }

  get columns() {
    return TABLE_REASSIGN_PROCEDURE;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.cadastralUserService
      .getUsers(0, 1000)
      .subscribe((res: InformationPageableUser) => {
        this.dataUser = res;
        this.dataSource = (this.dataUser.content || []).map((user) => {
          return {
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.individual.fullName.toLowerCase()
          };
        });
        this.dataSource$ = this.dataSource;
        this.cdr.detectChanges();
      });
  }

  reassign() {
    this.procedureService
      .reassignProcedure(
        this.data.executionId,
        this.selectedUser!.username,
        this.selectedUser!.userId
      )
      .subscribe({
        next: () => {
          this.dialogRef.close('success');
        },
        error: () => {
          this.dialogRef.close('error');
        }
      });
  }

  selectUser(row: RowUserAssign) {
    this.selectedUser = row;
  }

  filterUsers(): void {
    const value = this.form.controls['filter'].value;

    if (!value) {
      this.dataSource$ = this.dataSource;
      return;
    }

    this.dataSource$ = this.dataSource.filter((user) => {
      const newValue = value.toLowerCase();
      for (const key in user) {
        const rowValue = user[key as keyof RowUserAssign].toString();
        if (rowValue.includes(newValue)) return true;
      }
      return false;
    });
  }
}
