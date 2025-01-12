// Angular framework
import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

// Vex

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import {
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from 'src/app/apps/constants/constant';

// Custom
import { DIGITALIZED_SIGNATURES_COLUMNS } from 'src/app/apps/constants/digitalized-signatures.constants';
import { UsersSignatures } from 'src/app/apps/interfaces/digitalized-signatures';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { PageSortByData } from 'src/app/apps/interfaces/page-sortBy-data.model';
import { DigitalizedSignaturesService } from 'src/app/apps/services/users/digitalized-signatures.service';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';

@Component({
  selector: 'table-digitalized-signatures',
  standalone: true,
  imports: [
    AsyncPipe,
    // Vex
    // Material
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
    // Custom
  ],
  templateUrl: './table-digitalized-signatures.component.html',
  styles: ``
})
export class TableDigitalizedSignaturesComponent
  implements OnInit, AfterViewInit
{
  @Input({ required: true }) public isDesktop$!: Observable<boolean>;

  public dataSource: MatTableDataSource<UserDetails> =
    new MatTableDataSource<UserDetails>([]);
  public columns: { name: string; title: string }[] =
    DIGITALIZED_SIGNATURES_COLUMNS;
  public displayColumns: string[] = [];

  // MatPaginator configuration
  public page: number = PAGE;
  public pageSize: number = PAGE_SIZE;
  public pageSizeOptions: number[] = [...PAGE_SIZE_OPTION, 1];
  public totalElements = 0;
  public contentInformation!: InformationPegeable;
  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  public actionsBtn = computed(() => {
    return [
      {
        icon: 'mat:edit',
        label: 'Editar',
        action: (row: UserDetails) => this.editingDigitalizedSignatures(row)
      },
      {
        icon: 'mat:visibility',
        label: 'Ver Detalles',
        action: (row: UserDetails) => this.viewDetailsDigitalizedSignatures(row)
      }
    ];
  });

  constructor(
    private snackbar: MatSnackBar,
    private digitalizedSignaturesService: DigitalizedSignaturesService
  ) {}

  ngOnInit(): void {
    this.displayColumns = this.columns.map((column) => column.name);
    this.displayColumns.push('actions');

    this.getDataDigitalizedSignatures();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  getDataDigitalizedSignatures() {
    this.digitalizedSignaturesService
      .getUsersWithSignatures(this.page, this.pageSize)
      .subscribe({
        next: (result: UsersSignatures) => {
          const content = result.content.map((user: UserDetails) => {
            return {
              ...user,
              enabled: user.enabled ? 'Activo' : 'Inactivo'
            }
          })
          this.dataSource.data = content;
          this.totalElements = result.totalElements;
        }
      });
  }

  generateObjectPageWorkflowData(): PageSortByData {
    const sortBy = 'username';
    return new PageSortByData(this.page, this.pageSize, sortBy);
  }

  refreshInformationPaginator(event: any): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getDataDigitalizedSignatures();
  }

  editingDigitalizedSignatures(row: UserDetails) {
    this.snackbar.open('Editando firma...', 'Aceptar', { duration: 3000 });
    console.log('Editando firma...', row);
  }

  viewDetailsDigitalizedSignatures(row: UserDetails) {
    this.snackbar.open('Ver detalles de la firma...', 'Aceptar', {
      duration: 3000
    });
    console.log('Ver detalles de la firma...', row);
  }
}
