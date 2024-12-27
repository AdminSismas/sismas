// Angular framework
import { AsyncPipe } from '@angular/common'
import {
  AfterViewInit,
  Component,
  computed,
  Input,
  OnInit,
  ViewChild
} from '@angular/core'

// Vex

// Material
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { Observable } from 'rxjs'
import {
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from 'src/app/apps/constants/constant'

// Custom
import {
  DATA_SOURCE_DIGITALIZED_SIGNATURES,
  DIGITALIZED_SIGNATURES_COLUMNS
} from 'src/app/apps/constants/digitalized-signatures.constants'
import { DigitalizedSignaturesData } from 'src/app/apps/interfaces/digitalized-signatures'
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model'
import { PageSortByData } from 'src/app/apps/interfaces/page-sortBy-data.model'
import { Pegeable } from 'src/app/apps/interfaces/pegeable.model'

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
  @Input({ required: true }) public isDesktop$!: Observable<boolean>

  public dataSource: MatTableDataSource<DigitalizedSignaturesData> =
    new MatTableDataSource<DigitalizedSignaturesData>([])
  public columns: { name: string; title: string }[] =
    DIGITALIZED_SIGNATURES_COLUMNS
  public displayColumns: string[] = []

  // MatPaginator configuration
  public page: number = PAGE
  public pageSize: number = PAGE_SIZE
  public pageSizeOptions: number[] = [...PAGE_SIZE_OPTION, 1]
  public totalElements: number = 0
  public contentInformation!: InformationPegeable
  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator
  @ViewChild(MatSort, { static: true }) sort?: MatSort

  public actionsBtn = computed(() => {
    return [
      {
        icon: 'mat:edit',
        label: 'Editar',
        action: (row: DigitalizedSignaturesData) =>
          this.editingDigitalizedSignatures(row)
      },
      {
        icon: 'mat:visibility',
        label: 'Ver Detalles',
        action: (row: DigitalizedSignaturesData) =>
          this.viewDetailsDigitalizedSignatures(row)
      }
    ]
  })

  constructor(private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.displayColumns = this.columns.map((column) => column.name)
    this.displayColumns.push('actions')

    this.getDataDigitalizedSignatures()
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator
    }

    if (this.sort) {
      this.dataSource.sort = this.sort
    }
  }

  getDataDigitalizedSignatures() {
    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = DATA_SOURCE_DIGITALIZED_SIGNATURES.slice(startIndex, endIndex);

    this.dataSource.data = paginatedData;
    this.totalElements = DATA_SOURCE_DIGITALIZED_SIGNATURES.length;
  }

  generateObjectPageWorkflowData(): PageSortByData {
    const sortBy: string = 'fullName'
    return new PageSortByData(this.page, this.pageSize, sortBy)
  }

  captureInformationWorkflowData() {
    let data: any[]
    if (
      this.contentInformation != null &&
      this.contentInformation.content != null
    ) {
      data = this.contentInformation.content
      this.dataSource.data = data
    }

    if (this.contentInformation == null) {
      this.page = PAGE
      return
    }

    if (this.contentInformation.totalElements) {
      this.totalElements = this.contentInformation.totalElements
    }

    if (this.contentInformation.pageable == null) {
      this.page = PAGE
      return
    }

    if (this.contentInformation.pageable.pageNumber != null) {
      this.page = this.contentInformation.pageable.pageNumber
    }
  }

  refreshInformationPaginator(event: any): void {
    if (event == null) {
      return
    }
    this.page = event.pageIndex
    this.pageSize = event.pageSize

    this.getDataDigitalizedSignatures()
  }

  editingDigitalizedSignatures(row: DigitalizedSignaturesData) {
    this.snackbar.open('Editando firma...', 'Aceptar', { duration: 3000 })
    console.log('Editando firma...', row)
  }

  viewDetailsDigitalizedSignatures(row: DigitalizedSignaturesData) {
    this.snackbar.open('Ver detalles de la firma...', 'Aceptar', {
      duration: 3000
    })
    console.log('Ver detalles de la firma...', row)
  }
}
