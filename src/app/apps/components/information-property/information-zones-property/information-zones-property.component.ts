import { Component, Input, OnInit, TemplateRef, ViewChild, computed, inject, signal } from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  NAME_NO_DISPONIBLE,
  NAVIGATION_ITEMS_INFORMACION_PROPERTIY,
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION,
  TYPEINFORMATION_EDITION
} from '../../../constants/constant';
import { environment } from '../../../../../environments/environments';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDialog, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { Observable, lastValueFrom } from 'rxjs';
import { ZoneBAUnit } from '../../../interfaces/information-property/zone-baunit';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { VexHighlightDirective } from '@vex/components/vex-highlight/vex-highlight.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { TypeInformation } from '../../../interfaces/content-info';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { InfoOwnerRowT } from '../information-property-owners/information-property-owners.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InfoOwners } from 'src/app/apps/interfaces/information-property/info-owners';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { DetailInformationPropertyOwnerComponent } from '../information-property-owners/detail-information-property-owner/detail-information-property-owner.component';
import { AddPropertyOwnerComponent } from '../information-property-owners/add-property-owner/add-property-owner.component';
import { DeletePropertyOwnerComponent } from '../information-property-owners/delete-property-owner/delete-property-owner.component';
import { EditingPropertyOwnerComponent } from '../information-property-owners/editing-property-owner/editing-property-owner.component';

@Component({
  selector: 'vex-information-zones-property',
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
    MatExpansionModule,
    CdkAccordionModule,
    AsyncPipe,
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
    VexHighlightDirective,
    ReactiveFormsModule,
    VexPageLayoutHeaderDirective,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatSlideToggleModule,
    MatCardModule,
    HeaderCadastralInformationPropertyComponent,
    MatExpansionModule,
    DatePipe,
    MatDialogContent,
    HeaderCadastralInformationPropertyComponent,
    MatCardModule,
    MatRippleModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatTableModule,
  ],
  templateUrl: './information-zones-property.component.html',
  styleUrl: './information-zones-property.component.scss'
})
export class InformationZonesPropertyComponent implements OnInit {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  zoneBAUnit: ZoneBAUnit[] = [];
  zoneBAUnitRural: ZoneBAUnit[] = [];
  zoneBAUnitUrban: ZoneBAUnit[] = [];
  zoneBAUnitGeoeconomic: ZoneBAUnit[] = [];

  @Input({ required: true }) id: string = '';
  @Input({ required: true }) public expandedComponent: boolean = true;
  @Input({ required: true }) schema: string = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

  protected readonly TABLE_COLUMNS: TableColumn<InfoOwnerRowT>[] = [
    {
      label: 'Detalle',
      property: 'viewDetail',
      type: 'button',
      visible: true
    },
    {
      label: 'Código',
      property: 'domIndividualTypeNumber',
      type: 'text',
      visible: true
    },
    {
      label: 'Área',
      property: 'number',
      type: 'text',
      visible: true
    },
    {
      label: 'Vigencia',
      property: 'fullName',
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

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog', { static: true }) confirmDialog: TemplateRef<any> | undefined;
  
  fractions_sum: number = 0;
  page: number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
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
      title: 'Nueva zona'
    };
    return { ...initialState };
  });

  
  private informationPropertyService = inject(InformationPropertyService);
  private matDialog = inject(MatDialog);


  
  protected readonly navigationItems = NAVIGATION_ITEMS_INFORMACION_PROPERTIY;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private snackbar: MatSnackBar
  ) {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator || null;
    this.dataSource.sort = this.sort || null;
  }

  refreshPaginator(pageEvent: PageEvent): void {
    const { pageIndex, pageSize } = pageEvent || {};
    this.page = pageIndex ?? PAGE;
    this.pageSize = pageSize ?? PAGE_SIZE;
  }

  ngOnInit() {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    this.isExpandPanel(this.expandedComponent);
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchInformationsZonesProperty();
    }
  }

  searchInformationsZonesProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.informationPropertyService.getBasicInformationPropertyZones(
      this.baunitId, this.schema, this.executionId)
      .subscribe({
        error: (err: any) => this.captureInformationSubscribeError(err),
        next: (result: ZoneBAUnit[]) => this.captureInformationSubscribe(result)
      });
    return true;
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

  onClickOpenAddEditModal(data: any): void {
    if (this.fractions_sum >= 1) {
      this.snackbar.open('El predio ya está completamente asignado', 'CLOSE', { duration: 4000 })
      return;
    }

    this.matDialog.open(AddPropertyOwnerComponent, {
      width: '35%',
      data: {
        ownersData: data.data,
        baunitId: this.baunitId,
        schema: this.schema,
        executionId: this.executionId
      },
    }).afterClosed()
      .subscribe(() => setTimeout(() => this.loadInformationPropertyOwners(), 200));
  }

  
  onClickActionBtn(id: string, infoOwner: InfoOwners) {
    this.rightIdSelected = infoOwner.rightId;
    if (id === 'delete') {
      this.matDialog.open(DeletePropertyOwnerComponent, {
        width: '35%',
        data: {
          baunitId: this.baunitId,
          executionId: this.executionId,
          rightId: this.rightIdSelected,
          individual: infoOwner.individual
        }
      }).afterClosed()
        .subscribe(() => setTimeout(() => this.loadInformationPropertyOwners(), 200))
    } else if (id === 'edit') {
      this.matDialog.open(EditingPropertyOwnerComponent, {
        width: '35%',
        data: {
          fractions_sum: this.fractions_sum - Number(infoOwner.fractionS),
          rightId: this.rightIdSelected,
          executionId: this.executionId,
          baunitId: this.baunitId,
          schema: this.schema,
          rrrightInfo: {
            fraction: infoOwner.fractionS,
            beginAt: infoOwner.beginAt,
            domRightType: infoOwner.domRightType
          },
          individual: infoOwner.individual
        }
      }).afterClosed()
        .subscribe(() => setTimeout(() => this.loadInformationPropertyOwners(), 200))
    }
  }

  captureInformationSubscribeError(err: any): void {
    this.zoneBAUnit = [];
    this.zoneBAUnitRural = [];
    this.zoneBAUnitUrban = [];
    this.zoneBAUnitGeoeconomic = [];
  }

  captureInformationSubscribe(result: ZoneBAUnit[]): void {
    this.zoneBAUnit = result;
    this.zoneBAUnitRural = this.filterByObject(result, 'ccZonaHomoFisicaRu');
    this.zoneBAUnitUrban = this.filterByObject(result, 'ccZonaHomoFisicaUr');
    this.zoneBAUnitGeoeconomic = this.filterByObject(result,'ccZonaHomoGeoEconomica');
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  filterByObject(result: ZoneBAUnit[], key: string ):ZoneBAUnit[]{
    return result.filter((zn: ZoneBAUnit) => this.validateObjet(zn, key));
  }

  validateObjet(object: any, key: string) {
    return object && object[key] !== null && object[key] !== undefined && object[key] != '';
  }

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
      this.dataSource.data = infoOwners;
      this.fractions_sum = infoOwners.reduce((acc: number, owner: InfoOwners) => {
        const fraction = Number(owner.fractionS)
        return acc + fraction ;
      }, 0)
    } catch (e) {
      console.error(e);
    }
  }

}
