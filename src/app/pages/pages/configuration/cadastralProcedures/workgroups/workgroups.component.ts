import { Component, computed, OnInit } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/general-components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { Group } from './interfaces/group.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { WorkgroupsService } from './services/work-group.service';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PAGE_OPTION__10_20_50_100, MODAL_SMALL } from '../../../../../apps/constants/general/constant';

@Component({
  selector: 'vex-workgroups',
  standalone: true,
  imports: [
    InConstructionComponent,
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

  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<Group> = new MatTableDataSource<Group>([]);
    public actionBtns = computed(() => {
      return [
        {
          name: 'edit',
          label: 'Editar',
          icon: 'mat:edit'
        },
        {
          name: 'delete',
          label: 'Borrar',
          icon: 'mat:delete'
        }
      ];
    });

  // Paginación
  page = 0;
  pageSize = 10;
  totalElements = 0;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;

  // Buscador
  searchTerm = '';

  constructor(
    private workgroupsService: WorkgroupsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getWorkgroups();
  }

  // Método para obtener los grupos
  getWorkgroups(): void {
    this.workgroupsService.getAll(this.page, this.pageSize).subscribe((data) => {
      this.dataSource.data = data.content.map((item: any) => new Group(item));
      this.totalElements = data.totalElements; // Establecer el número total de elementos
    });
  }

  // Método para abrir el modal de crear/editar
  openDialog(group?: Group): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      ...MODAL_SMALL,
      data: group || {} // Si existe un grupo, lo pasa al modal, si no, se pasa un objeto vacío
    });

    dialogRef.afterClosed().subscribe(result => {
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
    this.workgroupsService.create(group).subscribe(() => {
      this.getWorkgroups();  // Recargar la lista de grupos
      this.showSnackBar('Grupo creado con éxito'); // Mostrar mensaje de éxito
    }, error => {
      this.showSnackBar('Error al crear el grupo'); // Mostrar mensaje de error en caso de fallo
    });
  }

  editGroup(group: Group): void {
    this.workgroupsService.update(group).subscribe(() => {
      this.getWorkgroups();  // Recargar la lista de grupos
      this.showSnackBar('Grupo editado con éxito'); // Mostrar mensaje de éxito
    }, error => {
      this.showSnackBar('Error al editar el grupo'); // Mostrar mensaje de error en caso de fallo
    });
  }

  // Método para cambiar de página
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getWorkgroups(); // Llamar al método de obtención de grupos con los parámetros actualizados
  }
  // Método de búsqueda
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.getWorkgroups(); // Si no hay término de búsqueda, recarga todos los grupos
    } else {
      this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  actionMenuHandler(action: string, row: any) {
    if (action === 'edit') {
      const dialogRef = this.dialog.open(GroupDialogComponent, {
        data: {
          ...row,
          mode: 'edit'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.groupId) {
            this.editGroup(result);
          } else {
            this.createGroup(result);
          }
        }
      });
    }

  }

}
