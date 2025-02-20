import { AfterViewInit, Component, DestroyRef, inject, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TypeOperationAlfaMain } from '../../../interfaces/general/content-info';
import {
  PAGE,
  PAGE_OPTION_UNIQUE_7,
  STRING_INFORMATION_NOT_FOUND,
  TABLE_COLUMN_PROPERTIES_CRUD_ALFA_MAIN,
  TYPEOPERATION_ADD,
  TYPEOPERATION_CREATE,
  TYPEOPERATION_DELETE
} from '../../../constants/general/constant';
import {
  CONSTANT_NAME_ADD_LABEL,
  CONSTANT_NAME_CREATE_LABEL,
  CONSTANT_NAME_DELETE_LABEL
} from '../../../constants/general/constantLabels';
import { MatMenuModule } from '@angular/material/menu';
import { ComboxColletionComponent } from '../../general-components/combox-colletion/combox-colletion.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { AlfaMainService } from '../../../services/bpm/core/alfa-main.service';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { DataAlfaMain } from '../../../interfaces/bpm/data-alfa-main.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { HttpErrorResponse } from '@angular/common/http';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { CurrencyLandsPipe } from '../../../pipes/currency-lands.pipe';

@Component({
  selector: 'vex-crud-alfa-main',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    CurrencyLandsPipe,
    MatDialogContent,
    MatDialogActions,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatMenuModule,
    ComboxColletionComponent,
    AsyncPipe,
    MatAutocompleteModule,
    MatOptionModule,
    ReactiveFormsModule,
    NgIf,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgForOf,
    FormsModule,
    NgClass
  ],
  templateUrl: './crud-alfa-main.component.html',
  styleUrl: './crud-alfa-main.component.scss'
})
export class CrudAlfaMainComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  subject$: ReplaySubject<BaunitHead[]> = new ReplaySubject<BaunitHead[]>(1);
  data$: Observable<BaunitHead[]> = this.subject$.asObservable();
  baunitHeads: BaunitHead[] = [];

  optionsListNpnlike: string[] = [];
  optionsListNpnlike$: Observable<string[]> | undefined;
  executionId!: string;
  typeOperation!: TypeOperationAlfaMain;


  columns: TableColumn<BaunitHead>[] = TABLE_COLUMN_PROPERTIES_CRUD_ALFA_MAIN;
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_OPTION_UNIQUE_7;
  pageSizeOptions: number[] = [PAGE_OPTION_UNIQUE_7];

  dataSource!: MatTableDataSource<BaunitHead>;
  selection: SelectionModel<BaunitHead> = new SelectionModel<BaunitHead>(true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  formAdd: FormGroup = this.fb.group({
    addNpnLike: this.defaults?.addNpnLike ?? '',
    bAunitCondition: this.defaults?.bAunitCondition ?? ''
  });

  formCreateDelete: FormGroup = this.fb.group({
    npnLike: this.defaults?.addNpnLike ?? '',
    bAunitCondition: this.defaults?.bAunitCondition ?? ''
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: DataAlfaMain,
    private readonly layoutService: VexLayoutService,
    private snackBar: MatSnackBar,
    private alfaMainService: AlfaMainService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrudAlfaMainComponent>
  ) {
  }

  ngOnInit(): void {
    if (!this.defaults || !this.defaults?.executionId ||
      !this.defaults?.typeOperation) {
      return;
    }
    this.dataSource = new MatTableDataSource();
    this.executionId = this.defaults.executionId;
    this.typeOperation = this.defaults?.typeOperation;

    this.loadingNpnlike();

    this.data$.pipe(filter<BaunitHead[]>(Boolean)).subscribe((dataList) => {
      let dataBaunitHead: BaunitHead[];
      if (dataList != null && dataList.length > 0) {
        this.baunitHeads = dataList;
        dataBaunitHead = dataList.map((row: BaunitHead) => new BaunitHead(row));
        this.dataSource.data = dataBaunitHead;
        this.totalElements = dataBaunitHead.length;
      } else {
        this.baunitHeads = [];
        this.page = PAGE;
      }
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadingNpnlike() {
    if (this.defaults?.addNpnLike) {
      this.formAdd.get('addNpnLike')?.setValue(this.defaults.addNpnLike);
      return;
    };

    this.alfaMainService.loadingNpnlikeByExecutionId(this.executionId)
      .subscribe({
          next: (result: string[]) => this.captureDepartmentInformation(result)
        }
      );
  }

  captureDepartmentInformation(result: string[]) {
    this.optionsListNpnlike = result;
    this.optionsListNpnlike$ = this.formAdd.get('addNpnLike')?.valueChanges.pipe(
      startWith(''),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((value): any[] => this.optionsListNpnlike.filter(
        (option: string) => option?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }

  loadPropertiesInformation() {
    if (this.typeOperation === TYPEOPERATION_ADD) {
      return;
    }

    if (!this.formCreateDelete.value || !this.formCreateDelete.value.npnLike) {
      this.snackBar.open(
        'No se puede consultar información, con los datos suministrados.',
        'CERRAR', { duration: 10000 }
      );
      return;
    }
    this.alfaMainService.loadingListBeaUnitheadByExecutionIdAndNpnLike(
      this.executionId, this.formCreateDelete.value.npnLike)
      .subscribe((result: BaunitHead[]) => {
        this.subject$.next(result);
      });
  }

  onSubmitFormAdd(): void {
    if(!this.formAdd.value) {
      return;
    }

    const addNpnLike = this.formAdd.value.addNpnLike;
    const bAunitCondition = this.formAdd.value.bAunitCondition;
    if(!addNpnLike || !bAunitCondition) {
      this.snackBar.open(
        'Para poder continuar diligencie los campos obligatorios',
        'CERRAR', { duration: 10000 }
      );
      return;
    }

    this.alfaMainService.createTemporalBeaUnithead(addNpnLike, this.executionId, bAunitCondition)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Se creó una nueva unidad predial.',
            'CERRAR', { duration: 10000 }
          );
          this.dialogRef.close();
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(
            'Error al crear la unidad predial.',
            'CERRAR', { duration: 10000 }
          );
          throw error;
        }
      });
    // this.alfaMainService.createTemporalBeaUnithead(
    //   addNpnLike, this.executionId, bAunitCondition)
    //   .then(() => {
    //     this.snackBar.open(
    //       'Se creó una nueva unidad predial.',
    //       'CLOSE', { duration: 10000 }
    //     );
    //     this.dialogRef.close();
    //   });
  }

  createBeaUnitHeadUpdate(baunit: BaunitHead): void {
    if (!baunit || !baunit?.baunitIdE) {
      return;
    }
    this.alfaMainService.createUpdateTemporalBeaUnithead(baunit?.baunitIdE, this.executionId)
      .subscribe({
        next: (() => {
          this.snackBar.open(
            'Se creó una nueva unidad predial para actualizar.',
            'CERRAR', { duration: 10000 }
          );
          this.loadPropertiesInformation();
        }),
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(
            'Error al crear la unidad predial para actualizar.',
            'CERRAR', { duration: 10000 }
          );
          throw error;
        }
      });
  }

  createBeaUnitHeadDelete(baunit: BaunitHead): void {
    if (!baunit || !baunit?.baunitIdE) {
      return;
    }
    this.alfaMainService.createDeleteTemporalBeaUnithead(baunit?.baunitIdE, this.executionId)
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Se creó una nueva unidad predial para eliminar.',
            'CERRAR', { duration: 10000 }
          );
          this.loadPropertiesInformation();
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(
            'Error al crear la unidad predial para eliminar.',
            'CERRAR', { duration: 10000 }
          );
          throw error;
        }
      });
  }

  toggleColumnVisibility(column: TableColumn<BaunitHead>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  protected readonly TYPEOPERATION_ADD = TYPEOPERATION_ADD;
  protected readonly TYPEOPERATION_CREATE = TYPEOPERATION_CREATE;
  protected readonly CONSTANT_NAME_ADD_LABEL = CONSTANT_NAME_ADD_LABEL;
  protected readonly CONSTANT_NAME_DELETE_LABEL = CONSTANT_NAME_DELETE_LABEL;
  protected readonly CONSTANT_NAME_CREATE_LABEL = CONSTANT_NAME_CREATE_LABEL;
  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
  protected readonly TYPEOPERATION_DELETE = TYPEOPERATION_DELETE;
}
