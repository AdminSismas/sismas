import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { Individual, User } from 'src/app/apps/interfaces/users/user';
import { groupMemberColumns } from '../../constants/group-member.constants';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { WorkgroupsService } from '../../services/work-group.service';
import Swal from 'sweetalert2';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { AddMemberGroupComponent } from '../add-member-group/add-member-group.component';
import { MODAL_SMALL_XS } from '@shared/constants';
import { UserService } from 'src/app/apps/services/users/user.service';

@Component({
  selector: 'group-member',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    ModalWindowComponent,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './group-member.component.html'
})
export class GroupMemberComponent {
  // Attributes
  columns = groupMemberColumns;
  actions = [
    {
      label: 'Remover',
      icon: 'mat:delete',
      name: 'delete',
      action: (row: Individual & Partial<User>) => this.removeMember(row)
    }
  ];

  // Injects
  data = inject<{
    members: { id: number; user: User; lastTurn: boolean }[];
    title: string;
    groupId: number;
  }>(MAT_DIALOG_DATA);
  workGroupService = inject(WorkgroupsService);
  userService = inject(UserService);
  dialog = inject(MatDialog);

  // Signals
  dataSource = signal(this.createDataSource(this.data.members));
  title = signal(
    `Grupo de trabajo: ${this.data.title
      .split(/(?=[A-Z])/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ')}`
  );

  // Computed
  visibleColumns = computed(() => {
    return [
      ...this.columns
        .filter((column) => column.visible)
        .map((column) => column.property),
      'actions'
    ];
  });

  createDataSource(members: { id: number; user: User; lastTurn: boolean }[]) {
    const dataSource = new MatTableDataSource<Individual & Partial<User>>(
      members.map((item) => ({
        ...item.user.individual,
        userId: item.user.userId,
        username: item.user.username,
        email: item.user.email,
        validBeginAt: item.user.validBeginAt,
        validToAt: item.user.validToAt,
        role: item.user.role
      }))
    );
    return dataSource;
  }

  removeMember(row: Individual & Partial<User>) {
    if (!row.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el miembro',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar',
        timer: 10000
      });
      return;
    }
    Swal.fire({
      icon: 'warning',
      text: '¿Estás seguro de eliminar este miembro?',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteMember(row);
      }
    });
  }

  deleteMember(row: Individual & Partial<User>) {
    this.workGroupService
      .removeGroupMember(this.data.groupId, row.userId!)
      .subscribe(() => {
        this.refreshMembers();
        Swal.fire({
          icon: 'success',
          title: 'Miembro eliminado con éxito',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 10000
        });
      });
  }

  refreshMembers() {
    this.workGroupService
      .getGroupMembers(this.data.groupId)
      .subscribe((members) => {
        this.dataSource.set(this.createDataSource(members));
      });
  }

  addMember() {
    this.userService.getUsers(0, 1000).subscribe((users) => {
      this.dialog
        .open(AddMemberGroupComponent, {
          ...MODAL_SMALL_XS,
          data: { users: users.content }
        })
        .afterClosed()
        .subscribe(
          (result: {
            result: boolean;
            userId: { label: string; value: number };
          }) => {
            if (!result.result) return;

            const userId = result.userId.value;

            this.workGroupService
              .addGroupMember(this.data.groupId, userId)
              .subscribe(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Miembro agregado con éxito',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Aceptar',
                  timer: 10000
                });
                this.refreshMembers();
              });
          }
        );
    });
  }
}
