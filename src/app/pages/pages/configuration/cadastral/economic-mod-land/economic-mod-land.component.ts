import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ZoneManagerComponent } from './zone-manager/zone-manager.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { AsyncPipe } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { startWith, map, Observable, takeUntil, Subject } from 'rxjs';
import { NAME_CODENAME, STRING_INFORMATION_NOT_FOUND } from 'src/app/apps/constants/constant';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { TerritorialOrganizationService } from 'src/app/apps/services/territorial-organization/territorial-organization.service';
import { Columns, DataSourceZoneManager, DisplayedColumns, GeoEconomicZone, RuralZone, UrbanZone, ZoneServices } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { GeoeconomicZoneService } from 'src/app/apps/services/economic-mod-land/geoeconomic-zone.service';
import { RuralZoneService } from 'src/app/apps/services/economic-mod-land/rural-zone.service';
import { UrbanZoneService } from 'src/app/apps/services/economic-mod-land/urban-zone.service';
import { URBAN_COLUMNS, RURAL_COLUMNS, GEOECONOMICA_COLUMNS } from './zone-constants';
import { MatTableDataSource } from '@angular/material/table';
import { RefreshService } from 'src/app/apps/services/economic-mod-land/refresh-service.service';

@Component({
  selector: 'vex-economic-mod-land',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,

    /* Material Modules */
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatAutocompleteModule,

    /* Vex Components */
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,

    /* Custom Components */
    ZoneManagerComponent
  ],
  templateUrl: './economic-mod-land.component.html',
  styleUrl: './economic-mod-land.component.scss'
})
export class EconomicModLandComponent implements OnInit{

  public form: FormGroup = this.fb.group({
    department: ['', Validators.required],
    municipality: ['', Validators.required]
  })
  public dataSource: DataSourceZoneManager = {
    urban: new MatTableDataSource<UrbanZone>(),
    rural: new MatTableDataSource<RuralZone>(),
    geoeconomic: new MatTableDataSource<GeoEconomicZone>()
  }
  public filteredOptionsDepartments$: Observable<Department[]> | undefined;
  public filteredOptionsMunicipalities$: Observable<Municipality[]> | undefined;
  public optionsDeparments: Department[] = [];
  public optionsMunicipalities: Municipality[] = [];
  public STRING_INFORMATION_NOT_FOUND: string = STRING_INFORMATION_NOT_FOUND;
  public divpolLv1: string = '';
  public divpolLv2: string = '';
  public gettedZones: boolean = false;
  public displayedColumns: DisplayedColumns = {
    urban: [],
    rural: [],
    geoeconomic: []
  };
  public columns: Columns = {
    urban: URBAN_COLUMNS,
    rural: RURAL_COLUMNS,
    geoeconomic: GEOECONOMICA_COLUMNS
  };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private territorialOrganizationService: TerritorialOrganizationService,
    public urbanZoneService: UrbanZoneService,
    public ruralZoneService: RuralZoneService,
    public geoeconomicZoneService: GeoeconomicZoneService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.loadDepartmentalInformation()

    Object.keys(this.displayedColumns).forEach((key: string) => {
      this.displayedColumns[key as keyof DisplayedColumns] = this.columns[key as keyof Columns].map((column) => column.name);
      this.displayedColumns[key as keyof DisplayedColumns].push('actions')
    })

    this.refreshService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getZones()
      })
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDeparments()
      .subscribe({
        next: (result: Department[]) => this.captureDepartmentInformation(result)
      }
      );
  }

  captureDepartmentInformation(result: Department[]): void {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparments = result;

    this.filteredOptionsDepartments$ = this.form.get('department')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsDeparments.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }

  loadMunicipalitiesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }

    let dpto = this._filterInformationCode(
      codeName, this.optionsDeparments, NAME_CODENAME, 'divpolLvl1Code');
    if (dpto == null || dpto?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataMunicipalities(dpto)
      .subscribe({
        next: (result: Municipality[]) => this.captureMunicipalityInformation(result, skipPreloadedValues)
      }
      );
  }

  private _filterInformationCode(code: string, options: any[], keyValue: string, key: string): string | undefined | null {
    let listOptions: any[] = options
      .filter((option: any): boolean => option[keyValue] === code);
    return listOptions?.length > 0 && listOptions[0][key] ? listOptions[0][key] : null;
  }

  captureMunicipalityInformation(result: Municipality[], skipPreloadedValues: boolean | null) {
    result = result.map((mncp: Municipality) => new Municipality(mncp));
    this.optionsMunicipalities = result;

    this.filteredOptionsMunicipalities$ = this.form.get('municipality')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsMunicipalities.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }

  getZones(): void {
    if (this.form.invalid) return;
    const { department, municipality } = this.form.value

    this.divpolLv1 = department.slice(0, 2)
    this.divpolLv2 = municipality.slice(0, 3)

    this.gettedZones = true;

    this.urbanZoneService.getZones(this.divpolLv1, this.divpolLv2)
      .subscribe({
        next: ((result: UrbanZone[]) => this.dataSource.urban.data = result)
      })

    this.ruralZoneService.getZones(this.divpolLv1, this.divpolLv2)
      .subscribe({
        next: ((result: RuralZone[]) => this.dataSource.rural.data = result)
      })

    this.geoeconomicZoneService.getZones(this.divpolLv1, this.divpolLv2)
      .subscribe({
        next: ((result: GeoEconomicZone[]) => this.dataSource.geoeconomic.data = result)
      })
  }


}
