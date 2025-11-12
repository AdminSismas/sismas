/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { Group } from './interfaces/group.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkgroupsService } from './services/work-group.service';
import { GroupDialogComponent } from './components/group-dialog/group-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  PAGE_SIZE_OPTION,
  MODAL_SMALL,
  MODAL_SMALL_XS,
  MODAL_LARGE
} from '@shared/constants/constants';
import { GroupMemberComponent } from './components/group-member/group-member.component';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/auth/user.service';

@Component({
  selector: 'vex-workgroups',
  standalone: true,
  imports: [
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './workgroups.component.html',
  styleUrl: './workgroups.component.scss'
})
export class WorkgroupsComponent implements OnInit {
  // Injects
  private workgroupsService = inject(WorkgroupsService);
  private dialog = inject(MatDialog);
  private userService = inject(UserService);

  // Signals
  user = signal(this.userService.getUser());

  // Computed
  canModifyWorkGroup = computed(() => {
    if (this.user()?.role === 'ADMIN') return true;
    return false;
  });

  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<Group> = new MatTableDataSource<Group>([]);
  public actionBtns = computed(() => {
    const actionsMenu = [
      {
        name: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      },
      {
        name: 'delete',
        label: 'Borrar',
        icon: 'mat:delete'
      },
      {
        name: 'members',
        label: 'Miembros',
        icon: 'mat:people'
      }
    ];
    if (this.canModifyWorkGroup()) return actionsMenu;
    return actionsMenu.filter((item) => item.name !== 'delete' && item.name !== 'edit');
  });

  // Paginación
  page = 0;
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;

  ngOnInit(): void {
    this.getWorkgroups();
  }

  // Método para obtener los grupos
  getWorkgroups(): void {
    this.workgroupsService
      .getAll(this.page, this.pageSize)
      .subscribe((data) => {
        this.dataSource.data = data.content.map((item: any) => new Group(item));
        this.totalElements = data.totalElements!; // Establecer el número total de elementos
      });
  }

  // Método para abrir el modal de crear/editar
  openDialog(group?: Group): void {
    if (!this.canModifyWorkGroup()) return;

    const dialogRef = this.dialog.open(GroupDialogComponent, {
      ...MODAL_SMALL,
      data: group || {} // Si existe un grupo, lo pasa al modal, si no, se pasa un objeto vacío
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.groupId) {
          this.editGroup(result); // Si el grupo tiene un ID, es una edición
        } else {
          this.createGroup(result); // Si no tiene ID, es una creación
        }
      }
    });
  }

  createGroup(group: Group): void {
    this.workgroupsService.create(group).subscribe({
      next: () => {
        this.getWorkgroups(); // Recargar la lista de grupos
        Swal.fire({
          icon: 'success',
          title: 'Grupo creado con éxito',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 10000
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear el grupo',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 10000
        });
      }
    });
  }

  editGroup(group: Group): void {
    this.workgroupsService.update(group).subscribe({
      next: () => {
        this.getWorkgroups(); // Recargar la lista de grupos
        Swal.fire({
          icon: 'success',
          title: 'Grupo editado con éxito',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 10000
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error al editar el grupo',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 10000
        });
      }
    });
  }

  // Método para cambiar de página
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getWorkgroups(); // Llamar al método de obtención de grupos con los parámetros actualizados
  }
  // Método de búsqueda
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const { value } = input;
    if (!value.trim()) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = value.trim().toLowerCase();
    }
  }

  actionMenuHandler(action: string, row: Group) {
    switch (action) {
      case 'edit':
        this.openEditGroup(row);
        break;
      case 'delete':
        console.log('delete');
        break;
      case 'members':
        this.openMembers(row);
        break;
    }
  }

  openEditGroup(row: Group) {
    this.dialog
      .open(GroupDialogComponent, {
        ...MODAL_SMALL_XS,
        data: {
          ...row,
          mode: 'edit'
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result.groupId) {
            this.editGroup(result);
          } else {
            this.createGroup(result);
          }
        }
      });
  }

  openMembers(row: Group) {
    this.workgroupsService.getGroupMembers(row.groupId).subscribe((members) => {
      this.dialog.open(GroupMemberComponent, {
        ...MODAL_LARGE,
        data: { members, title: row.name, groupId: row.groupId }
      });
    });
  }
}
