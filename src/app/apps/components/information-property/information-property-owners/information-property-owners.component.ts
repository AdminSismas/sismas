import { AfterViewInit, Component, computed, effect, inject, Input, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatCardModule } from '@angular/material/card';
import { PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TYPEINFORMATION_EDITION } from '../../../constants/constant';
import { MatRippleModule } from '@angular/material/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '../../../../../environments/environments';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { InfoOwners } from '../../../interfaces/information-property/info-owners';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  DetailInformationPropertyOwnerComponent
} from './detail-information-property-owner/detail-information-property-owner.component';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatSort } from '@angular/material/sort';
import { lastValueFrom } from 'rxjs';
import { TypeInformation } from 'src/app/apps/interfaces/content-info';
import { AddEditInformationPropertyOwnerComponent } from './add-edit-information-property-owner/add-edit-information-property-owner.component';

export type InfoOwnerRowT = Pick<InfoOwners, 'beginAt' | 'fractionS' | 'domRightType'> &
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
    HeaderCadastralInformationPropertyComponent,
    MatCardModule,
    MatRippleModule,
    NgForOf,
    MatExpansionModule,
    MatIconModule,
    NgIf,
    DatePipe,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    AddEditInformationPropertyOwnerComponent,
  ],
  templateUrl: './information-property-owners.component.html',
  styleUrl: './information-property-owners.component.scss'
})
export class InformationPropertyOwnersComponent implements OnInit, AfterViewInit {
  protected readonly TABLE_COLUMNS: TableColumn<InfoOwnerRowT>[] = [
    {
      label: 'Detalle',
      property: 'viewDetail',
      type: 'button',
      visible: true
    },
    {
      label: 'Tipo Documento',
      property: 'domIndividualTypeNumber',
      type: 'text',
      visible: true
    },
    {
      label: 'Número',
      property: 'number',
      type: 'text',
      visible: true
    },
    {
      label: 'Nombre Completo',
      property: 'fullName',
      type: 'text',
      visible: true
    },
    {
      label: 'Fracción',
      property: 'fractionS',
      type: 'text',
      visible: true
    },
    {
      label: 'Tipo Derecho',
      property: 'domRightType',
      type: 'text',
      visible: true
    },
    {
      label: 'A partil del',
      property: 'beginAt',
      type: 'text',
      visible: true
    },
    {
      label: 'Actions',
      property: 'actions',
      type: 'button',
      visible: true
    }
  ];

  @Input({ required: true }) id: string = '';
  @Input({ required: true }) expandedComponent: boolean = true;
  @Input({ required: true }) schema: string = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;
  
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('addEditDialog', { static: true }) addEditDialog: TemplateRef<any> | undefined;
  @ViewChild('confirmDialog', { static: true }) confirmDialog: TemplateRef<any> | undefined;

  page: number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  dataSource: MatTableDataSource<InfoOwnerRowT> =
    new MatTableDataSource<InfoOwnerRowT>([]);
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
  addEditDialogContent = computed<{ title: string}>(() => {
    const initialState: any = {
      title: 'Nueva información de propietario'
    };
    return { ...initialState };
  });

  private informationPropertyService = inject(InformationPropertyService);
  private matDialog = inject(MatDialog);

  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator || null;
    this.dataSource.sort = this.sort || null;
  }

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema;
    this.isExpandPanel(this.expandedComponent);
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.loadInformationPropertyOwners();
    }
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
      const data = infoOwners.map((infoOwner: InfoOwners) => {
        const infoOwnerRow: InfoOwnerRowT = {
          beginAt: infoOwner?.beginAt,
          fractionS: infoOwner?.fractionS,
          domRightType: infoOwner?.domRightType,
          domIndividualTypeNumber:
            infoOwner?.individual?.domIndividualTypeNumber || '',
          number: infoOwner?.individual?.number || '',
          fullName: infoOwner?.individual?.fullName || ''
        };
        return infoOwnerRow;
      });
      this.dataSource.data = data;
    } catch (e) {
      console.error(e);
    }
  }

  openInformationPropertyOwner(owner: InfoOwners): void {
    const dialog = this.matDialog
      .open(DetailInformationPropertyOwnerComponent, {
        minWidth: '50%',
        minHeight: '40%',
        disableClose: true,
        data: owner
      });
    dialog.afterClosed().subscribe((data: any) => console.log(data));
  }

  onClickOpenAddEditModal(): void {
    if (this.addEditDialog) {
      const dialog = this.matDialog.open(this.addEditDialog, {
        width: '80%',
      });

      dialog.afterClosed().subscribe((data: any) => console.log(data));
    }
  }

  onClickActionBtn(id: string, infoOwner: InfoOwnerRowT) {
    if (id === 'delete') {
      if (this.confirmDialog) {
        const dialog = this.matDialog.open(this.confirmDialog);
        dialog.afterClosed().subscribe((data: any) => console.log(data));
      }
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

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
