/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MODAL_SMALL,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
  TABLE_COLUMN_PROPERTIES_ADDRESS,
  TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION,
  TYPEINFORMATION_EDITION,
  TYPEINFORMATION_VISUAL
} from '../../../constants/general/constant';
import { MatCardModule } from '@angular/material/card';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatMenuModule } from '@angular/material/menu';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { BasicInformationAddress } from '../../../interfaces/information-property/basic-information-address';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailInformationAddressComponent } from './detail-information-address/detail-information-address.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddEditInformationDataI,
  EditInformationAddressComponent
} from './edit-information-address/edit-information-address.component';
import { TypeInformation } from '../../../interfaces/general/content-info';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

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
    NgForOf,
    NgIf,
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
  styleUrl: './information-addresses-property.component.scss'
})
export class InformationAddressesPropertyComponent
  implements OnInit, AfterViewInit, OnChanges
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  @Input({ required: true }) id = '';
  @Input({ required: true }) expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;
  @Input() editable? = true;

  columns: TableColumn<any>[] = TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public hasMainAddress = false;

  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  // @ViewChild('confirmDialog', { static: true }) confirmDialog!: TemplateRef<any>;
  @ViewChild('confirmDialog', { static: true }) confirmDialog!: SwalComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    if (
      this.typeInformation &&
      this.typeInformation === TYPEINFORMATION_VISUAL
    )

    this.informationPropertyService.reloadTableStarted$.subscribe(value=>{
      if(value){
        this.searchBasicInformationPropertyAddresses();
      }
    });

    this.isExpandPanel(this.expandedComponent);
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['typeInformation'].currentValue){
      const { currentValue: typeInformation } = changes['typeInformation'];
      if (typeInformation === TYPEINFORMATION_VISUAL || !this.editable) {
        this.pageSize = PAGE_SIZE;
        this.pageSizeOptions = PAGE_OPTION__10_20_50_100;
        this.columns = TABLE_COLUMN_PROPERTIES_ADDRESS;
      } else {
        this.pageSize = PAGE_SIZE;
        this.pageSizeOptions = PAGE_OPTION__10_20_50_100;
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

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  deleteInformations(basicInformationAddress: BasicInformationAddress): void {
    this.confirmDialog.fire().then(async (result) => {
      if (result.isConfirmed) {
        let msg = 'Información eliminada con éxito';
        try {
          await lastValueFrom(
            this.informationPropertyService.deleteBasicInformationPropertyAddress(basicInformationAddress.direccionId as string)
            );
            this.dataSource.data = this.dataSource.data.filter((row: BasicInformationAddress) => {
              return row.direccionId !== basicInformationAddress.direccionId;
            });
          } catch (e) {
            msg = 'Error, no se pudo eliminar la dirección';
            console.error(e);
          }
          this.snackBar.open(msg, 'CERRAR', { duration: 10000 });
      }
    });

    // const dialogRef = this.dialog.open(this.confirmDialog);

    // dialogRef.afterClosed().subscribe(async (data: any) => {
    //   if (data === 'delete' && basicInformationAddress.direccionId) {
    //     let msg = 'Información eliminada con éxito';
    //     try {
    //       await lastValueFrom(
    //         this.informationPropertyService.deleteBasicInformationPropertyAddress(
    //           basicInformationAddress.direccionId
    //         )
    //       );
    //       this.dataSource.data = this.dataSource.data.filter((row: BasicInformationAddress) => {
    //         return row.direccionId !== basicInformationAddress.direccionId;
    //       });
    //     } catch (e) {
    //       msg = 'Error, no se pudo eliminar la dirección';
    //       console.error(e);
    //     }
    //     this.snackBar.open(msg, 'CLOSE', { duration: 10000 });
    //   }
    // });
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
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchBasicInformationPropertyAddresses();
    }
  }

  searchBasicInformationPropertyAddresses(): void {
    if (!this.schema || !this.baunitId) {
      return;
    }

    this.informationPropertyService
      .getBasicInformationPropertyAddresses(this.executionId, this.baunitId , this.schema ,this.page,this.pageSize)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: BasicInformationAddress[]) =>{
          this.filterAddressMain(result);
          this.captureInformationSubscribe(result);
        }
      });
  }

  public filterAddressMain(result: BasicInformationAddress[]){
    const direccionesPrincipales = result.filter(d => d.esDireccionPrincipal);

    // Verifica que solo haya una dirección con "esDireccionPrincipal"
    if (direccionesPrincipales.length === 0) {
      this.hasMainAddress = false;  // Desbloquea
    } else {
      this.hasMainAddress = true;  // Bloquea
    }

  }

  captureInformationSubscribeError(): void {
    this.dataSource.data = [];
  }

  openAddressInformationProperty(data: BasicInformationAddress) {
    this.dialog
      .open(DetailInformationAddressComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: new BasicInformationAddress(data, this.schema)
      })
      .afterClosed();
  }

  /**
   * Open add/edit address information dialog with form
   *
   * @param data
   */
  openAddEditAddressInformationPropertyDialog(
    data?: BasicInformationAddress
  ): void {
    const dialogData: AddEditInformationDataI = {
      type: data ? 'edit' : 'new',
      basicInformationAddress: data ? new BasicInformationAddress(data, this.schema) : undefined,
      baunitId: this.baunitId || undefined,
      hasMainAddress: this.hasMainAddress
    };
    const dialogRef = this.dialog
      .open(EditInformationAddressComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: dialogData,
      });

    dialogRef.afterClosed().subscribe((result: any) => {
      //Update information address object
      if (result && Array.isArray(this.dataSource?.data)) {
        const foundAddress = this.dataSource.data.find(
          (row: any) => +row?.direccionId === +result?.direccionId
        );
        if (foundAddress) {
          Object.keys(foundAddress).forEach((key: string) => {
            if (result[key]) {
              foundAddress[key] = result[key];
            }
          });
        }
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

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
