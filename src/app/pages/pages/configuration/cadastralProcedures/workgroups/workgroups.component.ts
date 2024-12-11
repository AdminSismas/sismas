import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { Group } from './interfaces/group.interface';
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
    MatDialogModule


  ],
  templateUrl: './workgroups.component.html',
  styleUrl: './workgroups.component.scss'
})
export class WorkgroupsComponent {

  displayedColumns: string[] = ['name', 'description', 'actions'];
  dataSource: MatTableDataSource<Group> = new MatTableDataSource<Group>([]);
  
  // Paginación
  page: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  // Buscador
  searchTerm: string = '';

  constructor(
    private workgroupsService: WorkgroupsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getWorkgroups();
  }

  // Método para obtener los grupos
  getWorkgroups(): void {
    this.workgroupsService.getAll().subscribe((data) => {
      this.dataSource.data = data.content.map((item: any) => new Group(item));
      this.totalElements = data.totalElements; // Establecer el número total de elementos
    });
  }

  // Método para abrir el modal de crear/editar
  openDialog(group?: Group): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '400px',
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

  // Método para crear un grupo
  createGroup(group: Group): void {
    this.workgroupsService.create(group).subscribe(() => {
      this.getWorkgroups();  // Recargar la lista de grupos
    });
  }

  // Método para editar un grupo
  editGroup(group: Group): void {
    this.workgroupsService.update(group).subscribe(() => {
      this.getWorkgroups();  // Recargar la lista de grupos
    });
  }

  // Método para cambiar de página
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getWorkgroups();
  }

  // Método de búsqueda
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.getWorkgroups(); // Si no hay término de búsqueda, recarga todos los grupos
    } else {
      this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }
  }

}
