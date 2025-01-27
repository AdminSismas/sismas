import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  LIST_SCHEMAS_CONTROL_CHANGES, LIST_SCHEMAS_CONTROL_TEMP,
  PAGE,
  PAGE_SIZE_OPTION_UNIQUE,
  PAGE_SIZE_TABLE_UNIQUE,
  TABLE_ALFA_MAIN_OPERATION_COLUMN, TYPEINFORMATION_EDITION,
  TYPEINFORMATION_VISUAL
} from '../../../constants/constant';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf } from '@angular/common';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { Observable, ReplaySubject } from 'rxjs';
import { InformationPegeable } from '../../../interfaces/information-pegeable.model';
import { SearchData } from '../../../interfaces/search-data.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { MatMenuModule } from '@angular/material/menu';
import { Operation } from '../../../interfaces/bpm/operation';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../../information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from '../../../interfaces/content-info-schema';
import { filter } from 'rxjs/operators';
import { BpmCoreService } from '../../../services/bpm/bpm-core.service';
import { DifferenceChanges } from '../../../interfaces/bpm/difference-changes';
import { ViewChangesBpmOperationComponent } from '../view-changes-bpm-operation/view-changes-bpm-operation.component';
import { MatDividerModule } from '@angular/material/divider';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { DialogTableAlfaMainComponent } from '../dialog-table-alfa-main/dialog-table-alfa-main.component';

@Component({
  selector: 'vex-table-alfa-main',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    CurrencyLandsPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgIf,
    NgClass,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule,
    SweetAlert2Module,
],
  templateUrl: './table-alfa-main.component.html',
  styleUrl: './table-alfa-main.component.scss'
})
export class TableAlfaMainComponent implements OnInit, AfterViewInit, OnChanges {

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input({ required: true }) contentInformations!: InformationPegeable;
  @Input({ required: true }) executionId!: string;
  @Input({ required: true }) mode = 1;
  @Input() resources: string[] = [];
  @Input() columns: TableColumn<Operation>[] = TABLE_ALFA_MAIN_OPERATION_COLUMN;

  @Output() refreshData = new EventEmitter<void>();

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  searchData!: SearchData;

  public page = PAGE;
  public totalElements = 0;
  public pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  public pageSizeOptions: number[] = PAGE_SIZE_OPTION_UNIQUE;
  public dataSource!: MatTableDataSource<Operation>;
  public npnRemoving?: string;

  _contentInformations$: ReplaySubject<InformationPegeable> = new ReplaySubject<InformationPegeable>(0);
  contentInformations$: Observable<InformationPegeable> = this._contentInformations$.asObservable();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDeleteDialog', { static: true}) confirmDeleteDialog!: SwalComponent;

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private snackbar: MatSnackBar,
    private bpmCoreService: BpmCoreService
  ) {
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.contentInformations$
      .pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result: InformationPegeable) => {
        this.captureInformationSubscribe(result);
      });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['contentInformations'] && this.contentInformations) {
      this._contentInformations$.next(this.contentInformations);
    }
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.captureInformationCadastralData();
  }

  captureInformationCadastralData(): void {
    let data: Operation[];
    if (this.contentInformations?.content != null) {
      data = this.contentInformations.content;
      // data = data.map((row: Operation) => new Operation(row));
      this.dataSource.data = data;
    }

    if (this.contentInformations == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.totalElements) {
      this.totalElements = this.contentInformations.totalElements;
    }

    if (this.contentInformations.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.pageable.pageNumber != null) {
      this.page = this.contentInformations.pageable.pageNumber;
    }
  }

  openCadastralInformationProperty(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      this.snackbar.open(
        'No se puede ver la información de la unidad predial, consulte al administrador.',
        'CLOSE', { duration: 10000 }
      );
      return;
    }
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        minWidth: '99%',
        minHeight: '90%',
        disableClose: true,
        data: new ContentInfoSchema(
          operation?.baunitHead?.baunitIdE,
          operation?.baunitHead,
          this.executionId,
          LIST_SCHEMAS_CONTROL_CHANGES,
          TYPEINFORMATION_VISUAL

        )
      })
      .afterClosed();
  }

  viewChanges(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      this.snackbar.open(
        'No se puede visualizar los cambios realizados, consulte al administrador.',
        'CLOSE', { duration: 10000 }
      );
      return;
    }
    this.bpmCoreService.viewChangesBpmOperationTemp(
      this.executionId, operation?.baunitHead?.baunitIdE)
      .subscribe(
        {
          error: () => this.messageChangesNoAvailable(),
          next: (result: DifferenceChanges[]) => {
            console.log("table-alfa-main:::: ",result);
            this.openDifferenceChangesProperty(
              result, this.executionId, operation?.baunitHead?.baunitIdE);
          }
        });
  }

  editInformations(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      this.snackbar.open(
        'No se puede ver la información de la unidad predial, consulte al administrador.',
        'CLOSE', { duration: 10000 }
      );
      return;
    }
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        minWidth: '99%',
        minHeight: '90%',
        disableClose: true,
        data: new ContentInfoSchema(
          operation?.baunitHead?.baunitIdE,
          operation?.baunitHead,
          this.executionId,
          LIST_SCHEMAS_CONTROL_TEMP,
          TYPEINFORMATION_EDITION,
          '',
          this.resources
        )
      })
      .afterClosed();
  }

  deleteInformation(operation: Operation): void {
    this.npnRemoving = operation.npnlike;
    this.confirmDeleteDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.bpmCoreService.clearPropertyBpmOperation(this.executionId, operation.baunitHead!.baunitIdE as string)
          .subscribe({
            next: () => {
              this.refreshData.emit();
            },
            error: (error: HttpErrorResponse) => {
              this.snackbar.open(
                'Error al eliminar la unidad predial.',
                'CLOSE', { duration: 5000 }
              );
              throw error;
            }
          });
      }
    });
  }

  openDifferenceChangesProperty(result: DifferenceChanges[],
                                executionId:string, baunitIdE:string | undefined): void {
    if (!result || result.length <= 0) {
      this.messageChangesNoAvailable();
      return;
    }

    const data: DifferenceChanges[] = result.map((row: DifferenceChanges) => {
      return new DifferenceChanges(row, executionId, baunitIdE);
    });
    this.dialog
      .open(ViewChangesBpmOperationComponent, {
        width: '60%',
        disableClose: true,
        data:data
      })
      .afterClosed();
  }

  messageChangesNoAvailable() {
    this.snackbar.open(
      'Cambios realizados en el control de cambios no disponibles, consulte al administrador.',
      'CLOSE', { duration: 10000 }
    );
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  editCadastralUnits(row: Operation) {
    console.log(row);
    this.dialog.open(DialogTableAlfaMainComponent, {
      width: '80%',
      data: {
        executionId: this.executionId,
        baunitIdE: row.baunitHead?.baunitIdE,
      }
    });
  }
}
