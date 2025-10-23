import { AfterViewInit, Component, DestroyRef, inject, Inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TypeOperationAlfaMain } from '@shared/interfaces';
import {
  CONSTANT_TYPEDOMAIN_BAUNITCONDITION,
  CONSTANT_TYPEDOMAIN_DISPNAME_CO_,
  CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATRIZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PC_,
  CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATRIZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PH_,
  CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATRIZ,
  CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATZ,
  PAGE,
  PAGE_OPTION_UNIQUE,
  STRING_INFORMATION_NOT_FOUND,
  TABLE_COLUMN_PROPERTIES_CRUD_ALFA_MAIN,
  TYPE_OPERATION_ADD,
  TYPE_OPERATION_CREATE,
  TYPE_OPERATION_DELETE
} from '../../../../constants/general/constants';
import {
  CONSTANT_NAME_ADD_LABEL,
  CONSTANT_NAME_CREATE_LABEL,
  CONSTANT_NAME_DELETE_LABEL
} from '../../../../constants/general/constantLabels';
import { ComboboxCollectionComponent } from '@shared/components';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { AlfaMainService } from '@shared/services';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { DataAlfaMain } from '@shared/interfaces';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaunitHead } from '@shared/interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { HttpErrorResponse } from '@angular/common/http';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { CurrencyLandsPipe } from '../../../../pipes/currency-lands.pipe';
import Swal from 'sweetalert2';
import { Operation } from '@shared/interfaces';
import { DomainCollection } from '@shared/interfaces';
import { CollectionServices } from '@shared/services';
import { LoaderComponent } from '@shared/components';

@Component({
  selector: 'vex-crud-alfa-main',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    AsyncPipe,
    ComboboxCollectionComponent,
    CurrencyLandsPipe,
    LoaderComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    ReactiveFormsModule,
  ],
  templateUrl: './crud-alfa-main.component.html',
  styleUrl: './crud-alfa-main.component.scss'
})
export class CrudAlfaMainComponent implements OnInit, AfterViewInit {

  baunitConditionOptions: DomainCollection[] = [];

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  subject$: ReplaySubject<BaunitHead[]> = new ReplaySubject<BaunitHead[]>(1);
  data$: Observable<BaunitHead[]> = this.subject$.asObservable();
  baunitHeads: BaunitHead[] = [];

  optionsListNpnlike: string[] = [];
  optionsListNpnlike$: Observable<string[]> | undefined;
  executionId!: string;
  typeOperation!: TypeOperationAlfaMain;
  operationBaUnitHead: Operation | null = null;
  createBaunitHeadUpdateLoading = signal(false);


  columns: TableColumn<BaunitHead>[] = TABLE_COLUMN_PROPERTIES_CRUD_ALFA_MAIN;
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_OPTION_UNIQUE;
  pageSizeOptions: number[] = [PAGE_OPTION_UNIQUE];

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
    private collectionServicesService: CollectionServices,
    private readonly layoutService: VexLayoutService,
    private alfaMainService: AlfaMainService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CrudAlfaMainComponent>
  ) {
    this.destroyRef.onDestroy(() => console.log('destroyRef'));
  }

  ngOnInit(): void {
    if (!this.defaults || !this.defaults?.executionId ||
      !this.defaults?.typeOperation) {
      return;
    }
    this.dataSource = new MatTableDataSource();
    this.executionId = this.defaults.executionId;
    this.typeOperation = this.defaults?.typeOperation;
    if (this.defaults?.operationBaUnitHead) {
      this.operationBaUnitHead = this.defaults?.operationBaUnitHead;
      this.obtainsCollectionsListUnitProperty();
    }

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
    if (this.typeOperation === TYPE_OPERATION_ADD) {
      return;
    }

    if (!this.formCreateDelete.value || !this.formCreateDelete.value.npnLike) {
      this.getAlertError('No se puede consultar información, con los datos suministrados.');
      return;
    }
    this.alfaMainService.loadingListBeaUnitheadByExecutionIdAndNpnLike(
      this.executionId, this.formCreateDelete.value.npnLike)
      .subscribe((result: BaunitHead[]) => {
        this.subject$.next(result);
      });
  }

  onSubmitFormAdd(): void {
    if (!this.formAdd.value) {
      return;
    }

    const addNpnLike = this.formAdd.value.addNpnLike;
    const bAunitCondition = this.formAdd.value.bAunitCondition;
    if (!addNpnLike || !bAunitCondition) {
      this.getAlertError('Para poder continuar diligencie los campos obligatorios');
      return;
    }

    this.alfaMainService.createTemporalBeaUnithead(addNpnLike, this.executionId, bAunitCondition)
      .subscribe({
        next: () => {
          this.getAlertSuccess('Se creó una nueva unidad predial.');
          this.dialogRef.close();
        },
        error: (error: HttpErrorResponse) => {
          this.getAlertError('Error al crear la unidad predial.');
          throw error;
        }
      });
  }

  createBeaUnitHeadUpdate(baunit: BaunitHead): void {
    if (!baunit || !baunit?.baunitIdE) {
      return;
    }
    this.createBaunitHeadUpdateLoading.set(true);
    this.alfaMainService.createUpdateTemporalBeaUnithead(baunit?.baunitIdE, this.executionId)
      .subscribe({
        next: (() => {
          this.createBaunitHeadUpdateLoading.set(false);
          this.getAlertSuccess('Se creó una nueva unidad predial para actualizar.');
          this.loadPropertiesInformation();
        }),
        error: (error: HttpErrorResponse) => {
          this.createBaunitHeadUpdateLoading.set(false);
          throw error;
        }
      });
  }

  createBeaUnitHeadDelete(baunit: BaunitHead): void {
    if (!baunit || !baunit?.baunitIdE) {
      return;
    }

    this.createBaunitHeadUpdateLoading.set(true);
    this.alfaMainService.createDeleteTemporalBeaUnitHead(baunit?.baunitIdE, this.executionId)
      .subscribe({
        next: () => {
          this.getAlertSuccess('Se creó una nueva unidad predial para eliminar.');
          this.loadPropertiesInformation();
          this.createBaunitHeadUpdateLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.getAlertError('Error al crear la unidad predial para eliminar.');
          this.createBaunitHeadUpdateLoading.set(false);
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

  getAlertError(msg: string, timer = 10000) {
    Swal.fire({
      text: msg,
      icon: 'error',
      showConfirmButton: false,
      timer: timer
    }).then();
  }


  getAlertSuccess(msg: string, timer = 10000) {
    Swal.fire({
      text: msg,
      icon: 'success',
      showConfirmButton: false,
      timer: timer
    }).then();
  }

  obtainsCollectionsListUnitProperty() {
    this.collectionServicesService.getDataDomainName(CONSTANT_TYPEDOMAIN_BAUNITCONDITION)
      .subscribe((result: DomainCollection[]) => this.captureCollectionsListUnitProperty(result)
      );
  }

  captureCollectionsListUnitProperty(result: DomainCollection[]) {
    let data:DomainCollection[] = [];
    if(this.typeOperation === this.TYPEOPERATION_ADD && this.operationBaUnitHead &&
    this.operationBaUnitHead.baunitHead) {
      const domBaunitCondition = this.operationBaUnitHead.baunitHead?.domBaunitCondition;
      if(domBaunitCondition === CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATRIZ){
        data = result.filter(dm => dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PH_) && !dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PH_MATZ));
      } else if(domBaunitCondition === CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATRIZ){
        data = result.filter(dm => dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_CO_) && !dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_CO_MATZ));
      } else if(domBaunitCondition === CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATRIZ){
        data = result.filter(dm => dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PC_) && !dm.code?.includes(CONSTANT_TYPEDOMAIN_DISPNAME_PC_MATZ));
      }
      this.baunitConditionOptions = data;
    }
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  protected readonly TYPEOPERATION_ADD = TYPE_OPERATION_ADD;
  protected readonly TYPEOPERATION_CREATE = TYPE_OPERATION_CREATE;
  protected readonly CONSTANT_NAME_ADD_LABEL = CONSTANT_NAME_ADD_LABEL;
  protected readonly CONSTANT_NAME_DELETE_LABEL = CONSTANT_NAME_DELETE_LABEL;
  protected readonly CONSTANT_NAME_CREATE_LABEL = CONSTANT_NAME_CREATE_LABEL;
  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
  protected readonly TYPEOPERATION_DELETE = TYPE_OPERATION_DELETE;
}
