/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { lastValueFrom, Observable } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MODAL_SMALL,
  MODAL_SMALL_LARGE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_ADDRESS,
  TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '@shared/constants/constants';
import { MatCardModule } from '@angular/material/card';
import { HeaderCadastralInformationPropertyComponent } from '@features/property-management/components/shared/header-cadastral-information/header-cadastral-information-property.component';
import { MatMenuModule } from '@angular/material/menu';
import { BaunitHead } from '@shared/models';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '@environments/environments';
import {
  InformationPropertyService
} from '@features/property-management/services/property/information-property.service';
import { BasicInformationAddress } from '@features/property-management/models/basic-information-address';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailInformationAddressComponent } from './detail-information-address/detail-information-address.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddEditInformationAddressComponent } from './add-edit-information-address/add-edit-information-address.component';
import { InformationPegeable } from '@shared/models/pageable';
import { TypeInformation } from '@shared/interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DetailBasicInformationAddress } from '@features/property-management/models/detail-basic-information-address';

@Component({
  selector: 'vex-information-addresses-property',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatPaginatorModule,
    MatTooltipModule,
    MatCardModule,
    HeaderCadastralInformationPropertyComponent,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    SweetAlert2Module
  ],
  templateUrl: './information-addresses-property.component.html',
  styleUrl: './information-addresses-property.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InformationAddressesPropertyComponent),
      multi: true
    }
  ]
})
export class InformationAddressesPropertyComponent
  implements OnInit, AfterViewInit, OnChanges
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable? = true;

  // Input signal
  expandedComponent = input.required<boolean>();

  // Output signal
  emitExpandedComponent = output<number>();

  columns: TableColumn<any>[] = TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public hasMainAddress = false;

  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true }) confirmDialog!: SwalComponent;
  @ViewChild('successDelete', { static: true }) successDelete!: SwalComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {}

  ngOnInit() {
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['typeInformation'] && changes['typeInformation'].currentValue) {
      const { currentValue: typeInformation } = changes['typeInformation'];
      if (typeInformation === TYPE_INFORMATION_VISUAL || !this.editable) {
        this.columns = TABLE_COLUMN_PROPERTIES_ADDRESS;
      } else {
        this.columns = TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION;
      }
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  deleteInformations(basicInformationAddress: BasicInformationAddress): void {
    this.confirmDialog.fire().then(async (result) => {
      if (result.isConfirmed) {
        const msg = 'Información eliminada con éxito';
        try {
          await lastValueFrom(
            this.informationPropertyService.deleteBasicInformationPropertyAddress(
              basicInformationAddress.direccionId as string,
              this.baunitId!,
              this.schema,
              this.executionId!
            )
          );
          this.dataSource.data = this.dataSource.data.filter(
            (row: BasicInformationAddress) => {
              return row.direccionId !== basicInformationAddress.direccionId;
            }
          );
          this.successDelete.fire();
        } catch (e) {
          this.snackBar.open(msg, 'CERRAR', { duration: 10000 });
          console.error(e);
        }
      }
    });
  }

  toggleColumnVisibility(column: TableColumn<BaunitHead>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchBasicInformationPropertyAddresses();
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(5);
    this.searchBasicInformationPropertyAddresses();
  }

  searchBasicInformationPropertyAddresses(): void {
    if (!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService
      .getBasicInformationPropertyAddresses(
        this.executionId,
        this.baunitId,
        this.schema,
        this.page,
        this.pageSize
      )
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) => {
          this.filterAddressMain(result.content);
          this.captureInformationSubscribe(result.content);
        }
      });
  }

  public filterAddressMain(result: BasicInformationAddress[]) {
    const direccionesPrincipales = result.filter((d) => d.esDireccionPrincipal);
    // Verifica que solo haya una dirección con "esDireccionPrincipal"
    if (direccionesPrincipales.length === 0) {
      this.hasMainAddress = false; // Desbloquea
    } else {
      this.hasMainAddress = true; // Bloquea
    }
  }

  captureInformationSubscribeError(): void {
    this.dataSource.data = [];
  }

  openAddressInformationProperty(data: BasicInformationAddress) {
    const newData: BasicInformationAddress = new BasicInformationAddress(
      data,
      this.schema
    );
    newData.baunitId = this.baunitId;
    newData.executionId = this.executionId;

    this.dialog
      .open(DetailInformationAddressComponent, {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: newData
      })
      .afterClosed();
  }

  addEditAddressInformationPropertyDialog(): void {
    this.executeEventAddEditAddressInformationPropertyDialog(null);
  }

  editAddressInformationPropertyDialog(content: BasicInformationAddress): void {
    this.executeEventAddEditAddressInformationPropertyDialog(content);
  }

  executeEventAddEditAddressInformationPropertyDialog(
    content: BasicInformationAddress | null
  ): void {
    const newData = new BasicInformationAddress(content, this.schema);
    newData.baunitId = this.baunitId;
    newData.executionId = this.executionId;
    const dialogRef = this.dialog.open(AddEditInformationAddressComponent, {
      ...MODAL_SMALL,
      disableClose: true,
      data: {
        type: !content ? 'CREATE' : 'UPDATE',
        basicInformationAddress: newData,
        hasMainAddress: this.hasMainAddress
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: DetailBasicInformationAddress) => {
        if (result && result.direccionId) {
          this.searchBasicInformationPropertyAddresses();
        }
      });
  }

  captureInformationSubscribe(result: BasicInformationAddress[]): void {
    let data: BasicInformationAddress[];
    if (result != null) {
      data = result;
      data = data.map(
        (row: BasicInformationAddress) => new BasicInformationAddress(row)
      );
      this.dataSource.data = data;
    }
    if (result == null) {
      this.page = PAGE;
      return;
    }
    if (result.length) {
      this.totalElements = result.length;
    }
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }
}
