// Angular framework
import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, computed, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// Vex
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PAGE, PAGE_OPTION__10_20_50_100, PAGE_SIZE } from '../../../constants/general/constants';

// Custom
import { CreateSignatureComponent } from './create-signature/create-signature.component';
import { DIGITALIZED_SIGNATURES_COLUMNS } from '../../../constants/general/digitalized-signatures.constants';
import { DigitalizedSignaturesService } from 'src/app/apps/services/users/digitalized-signatures.service';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { PageSortByData } from '../../../interfaces/general/page-sortBy-data.model';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';
import { UsersSignatures } from '../../../interfaces/users/digitalized-signatures';

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
    MatTableModule,
    // Custom
    SweetAlert2Module
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
  public pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  public totalElements = 0;
  public contentInformation!: InformationPegeable;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog') private confirmDialog!: SwalComponent;

  public actionsBtn = computed(() => {
    return [
      {
        icon: 'mat:edit',
        label: 'Editar',
        action: (row: UserDetails) => this.editingDigitalizedSignatures(row)
      },
      {
        icon: 'mat:delete',
        label: 'Eliminar',
        action: (row: UserDetails) => this.deleteDigitalizedSignature(row)
      }
    ];
  });

  constructor(
    private snackbar: MatSnackBar,
    private digitalizedSignaturesService: DigitalizedSignaturesService,
    private dialog: MatDialog
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
            };
          });
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
    console.log(row);
    this.dialog
      .open(CreateSignatureComponent, {
        data: {
          username: row.username
        }
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.snackbar.open('Editando firma...', 'Aceptar', {
            duration: 10000
          });
          this.getDataDigitalizedSignatures();
        }
      });
  }

  deleteDigitalizedSignature(row: UserDetails) {
    this.confirmDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.digitalizedSignaturesService
          .deleteSignature(row.userId)
          .subscribe({
            next: () => {
              this.snackbar.open('Eliminando firma...', 'Aceptar', {
                duration: 10000
              });
              this.getDataDigitalizedSignatures();
            },
            error: (error) => {
              this.snackbar.open('Error al eliminar la firma', 'CERRAR', {
                duration: 10000
              });
              throw error;
            }
          });
      }
    });
  }
}
