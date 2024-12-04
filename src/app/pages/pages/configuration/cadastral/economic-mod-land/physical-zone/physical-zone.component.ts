import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { map, Observable, startWith } from 'rxjs';
import { NAME_CODENAME, STRING_INFORMATION_NOT_FOUND } from 'src/app/apps/constants/constant';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { TerritorialOrganizationService } from 'src/app/apps/services/territorial-organization/territorial-organization.service';
import { GEOECONOMICA_COLUMNS, RURAL_COLUMNS, URBAN_COLUMNS } from '../zone-constants';
import { UrbanZoneService } from 'src/app/apps/services/economic-mod-land/urban-zone.service';
import { GeoEconomicZone, RuralZone, UrbanZone, ZoneServices } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { RuralZoneService } from 'src/app/apps/services/economic-mod-land/rural-zone.service';
import { GeoeconomicZoneService } from 'src/app/apps/services/economic-mod-land/geoeconomic-zone.service';

@Component({
  selector: 'physical-zone',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    /* Material Modules */
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    /* Vex Components */
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    /* Custom Components */
    // DynamicFormsComponent,
  ],
  templateUrl: './physical-zone.component.html',
  styles: ``
})
export class PhysicalZoneComponent implements OnInit {

  public filteredOptionsDepartments$: Observable<Department[]> | undefined;
  public filteredOptionsMunicipalities$: Observable<Municipality[]> | undefined;
  public optionsDeparments: Department[] = [];
  public form: FormGroup = this.fb.group({
    department: ['', Validators.required],
    municipality: ['', Validators.required]
  })
  public STRING_INFORMATION_NOT_FOUND: string = STRING_INFORMATION_NOT_FOUND;
  public dataSource: MatTableDataSource<UrbanZone | RuralZone | GeoEconomicZone> = new MatTableDataSource<UrbanZone | RuralZone | GeoEconomicZone>();
  // public dataSource = dataSource;
  public columns: { name: string, title: string }[] = URBAN_COLUMNS;
  public displayedColumns: string[] = [];
  private activeService: ZoneServices = this.urbanZoneService;

  @ViewChild('searchDialog', { static: true }) searchDialog!: TemplateRef<any>;
  optionsMunicipalities: Municipality[] = [];

  @Input({ required: true }) public typeZone: string = 'urbanas';

  constructor(
    private territorialOrganizationService: TerritorialOrganizationService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private urbanZoneService: UrbanZoneService,
    private ruralZoneService: RuralZoneService,
    private geoeconomicZoneService: GeoeconomicZoneService
  ) { }

  ngOnInit(): void {
    this.loadDepartmentalInformation()

    this.selectService()
    this.displayedColumns = this.columns.map((column) => column.name);
  }

  selectService(): void {
    switch (this.typeZone) {
      case 'urbanas':
        this.activeService = this.urbanZoneService;
        this.columns = URBAN_COLUMNS;
        break;
      case 'rurales':
        this.activeService = this.ruralZoneService;
        this.columns = RURAL_COLUMNS;
        break;
      case 'geoeconómicas':
        this.activeService = this.geoeconomicZoneService;
        this.columns = GEOECONOMICA_COLUMNS;
        break;
    }
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

  searchZones() {
    this.dialog.open(this.searchDialog,
      {
        width: '30%',
        data: {}
      }
    )
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
    const { department, municipality } = this.form.value

    const divpolLv1 = department.slice(0, 2)
    const divpolLv2 = municipality.slice(0, 3)

    this.activeService.getZones(divpolLv1, divpolLv2)
      .subscribe({
        next: ((result: UrbanZone[] | RuralZone[] | GeoEconomicZone[]) => this.dataSource.data = result)
      })

  }
}
