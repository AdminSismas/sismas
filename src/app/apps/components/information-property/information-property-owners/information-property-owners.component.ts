/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  computed,
  forwardRef,
  inject,
  Input,
  OnInit,
  output,
  signal,
  ViewChild
} from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from 'src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { MatCardModule } from '@angular/material/card';
import {
  MODAL_MEDIUM,
  MODAL_SMALL,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE,
  PAGE_SIZE_SORT,
  TYPE_INFORMATION_EDITION
} from '@shared/constants';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { InformationPropertyService } from '@shared/services';
import { InfoOwners } from '@shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DetailInformationPropertyOwnerComponent } from './detail-information-property-owner/detail-information-property-owner.component';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatSort } from '@angular/material/sort';
import { lastValueFrom } from 'rxjs';
import { TypeInformation } from '@shared/interfaces';
import { AddPropertyOwnerComponent } from './add-property-owner/add-property-owner.component';
import { EditingPropertyOwnerComponent } from './editing-property-owner/editing-property-owner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {
  FRACTION_DECIMALS,
  TABLE_COLUMNS
} from '../../../constants/information-property/information-property-owners.constants';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RrrightService } from '@features/bpm-workflows/services/rrright.service';
import { DeleteParamsRrright } from '@shared/interfaces';
import Big from 'big.js';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { input } from '@angular/core';

export type InfoOwnerRowT = Pick<
  InfoOwners,
  'rightId' | 'beginAt' | 'fractionS' | 'domRightType'
> &
  Pick<InfoPerson, 'domIndividualTypeNumber' | 'number' | 'fullName'>;

@Component({
  selector: 'vex-information-property-owners',
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
    CommonModule,
    HeaderCadastralInformationPropertyComponent,
    MatCardModule,
    MatRippleModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    SweetAlert2Module,
    MatDialogModule,
    MatSort
  ],
  templateUrl: './information-property-owners.component.html',
  styleUrl: './information-property-owners.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InformationPropertyOwnersComponent),
      multi: true
    }
  ]
})
export class InformationPropertyOwnersComponent
  implements OnInit, AfterViewInit
{
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Input() editable? = true;

  // Input signal
  expandedComponent = input.required<boolean>();
  showEditPerson = input(false, {
    transform: (value: boolean | string) => {
      if (value === true || value === 'true' || value === '1') {
        return true;
      }
      return false;
    }
  });

  // Output signal
  emitExpandedComponent = output<number>();

  protected readonly TABLE_COLUMNS: TableColumn<InfoOwnerRowT>[] =
    TABLE_COLUMNS;

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true }) confirmDialog!: SwalComponent;
  @ViewChild('successEdit', { static: true }) successEdit!: SwalComponent;

  fractions_sum = 0;
  fractions_decimals: number = FRACTION_DECIMALS;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  rightIdSelected?: number;
  dataSource: MatTableDataSource<InfoOwners> =
    new MatTableDataSource<InfoOwners>([]);
  columns = signal(this.TABLE_COLUMNS);
  textColumns = computed(() =>
    this.columns().filter((column) => column.type === 'text')
  );
  visibleColumns = computed(() => {
    return this.TABLE_COLUMNS.filter((column) => column.visible).map(
      (column) => column.property
    );
  });
  actionBtns = computed(() => {
    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      },
      {
        id: 'delete',
        label: 'Eliminar',
        icon: 'mat:delete'
      }
    ];
  });
  addEditDialogContent = computed<{ title: string }>(() => {
    const initialState: any = {
      title: 'Nueva información de propietario'
    };
    return { ...initialState };
  });

  private informationPropertyService = inject(InformationPropertyService);
  private matDialog = inject(MatDialog);

  constructor(
    private snackbar: MatSnackBar,
    private rrrigthtService: RrrightService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator || null;
    this.dataSource.sort = this.sort || null;
  }

  ngOnInit(): void {
    this.TABLE_COLUMNS.at(-1)!.visible =
      this.typeInformation === 'edition' && this.editable;
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(3);
    this.loadInformationPropertyOwners();
  }

  /**
   * Load information property
   * @returns
   */
  async loadInformationPropertyOwners(): Promise<void> {
    if (!this.schema || !this.baunitId) {
      return;
    }
    try {
      const infoOwners: InfoOwners[] = await lastValueFrom(
        this.informationPropertyService.getInformationPropertyOwners(
          this.schema,
          this.baunitId,
          this.executionId
        )
      );
      this.totalElements = infoOwners.length;
      this.dataSource.data = infoOwners;
      this.fractions_sum = infoOwners.reduce(
        (acc: number, owner: InfoOwners) => {
          const fraction = Big(owner.fractionS!);
          return fraction.add(acc).toNumber();
        },
        0
      );
    } catch (e) {
      console.error(e);
    }
  }

  openInformationPropertyOwner(owner: InfoOwners): void {
    this.matDialog.open(DetailInformationPropertyOwnerComponent, {
      ...MODAL_SMALL,
      disableClose: true,
      data: owner
    });
  }

  onClickOpenAddEditModal(data: any): void {
    if (this.fractions_sum >= 1) {
      this.snackbar.open('El predio ya está completamente asignado', 'CERRAR', {
        duration: 10000
      });
      return;
    }

    this.matDialog
      .open(AddPropertyOwnerComponent, {
        ...MODAL_MEDIUM,
        data: {
          ownersData: data.data,
          baunitId: this.baunitId,
          schema: this.schema,
          executionId: this.executionId
        }
      })
      .afterClosed()
      .subscribe(() => {
        setTimeout(() => (this.loadInformationPropertyOwners(), 200));
      });
  }

  onClickActionBtn(id: string, infoOwner: InfoOwners) {
    this.rightIdSelected = infoOwner.rightId;
    if (id === 'delete') {
      this.confirmDialog.fire().then((result) => {
        if (result.isConfirmed) {
          const parameters: DeleteParamsRrright = {
            executionId: this.executionId!,
            baunitId: this.baunitId!,
            rightId: this.rightIdSelected!
          };

          this.rrrigthtService.deletePropertyOwner(parameters).subscribe(() => {
            setTimeout(() => this.loadInformationPropertyOwners(), 200);
          });
        }
      });
    } else if (id === 'edit') {
      const fractions_sum = Big(this.fractions_sum);
      this.matDialog
        .open(EditingPropertyOwnerComponent, {
          ...MODAL_SMALL,
          data: {
            fractions_sum: fractions_sum.minus(infoOwner.fractionS!).toNumber(),
            rightId: this.rightIdSelected,
            executionId: this.executionId,
            baunitId: this.baunitId,
            schema: this.schema,
            rrrightInfo: {
              fraction: infoOwner.fractionS,
              beginAt: infoOwner.beginAt,
              domRightType: infoOwner.domRightType
            },
            individual: infoOwner.individual,
            showEditPerson: this.showEditPerson()
          }
        })
        .afterClosed()
        .subscribe((response: boolean) => {
          if (response) {
            this.successEdit.fire();
            setTimeout(() => this.loadInformationPropertyOwners(), 200);
          }
        });
    }
  }

  /**
   * On refresh paginator
   *
   * @param pageEvent
   */
  refreshPaginator(pageEvent: PageEvent): void {
    const { pageIndex, pageSize } = pageEvent || {};
    this.page = pageIndex ?? PAGE;
    this.pageSize = pageSize ?? PAGE_SIZE;
  }

  individualInfo(column: TableColumn<InfoOwnerRowT>): boolean {
    return (
      column.label === 'Tipo documento' ||
      column.label === 'Número' ||
      column.label === 'Nombre completo'
    );
  }
}
