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
import { GEOECONOMICA_COLUMNS, getZoneParams, RURAL_COLUMNS, URBAN_COLUMNS } from '../zone-constants';
import { UrbanZoneService } from 'src/app/apps/services/economic-mod-land/urban-zone.service';
import { GeoEconomicZone, RuralZone, UrbanZone, Zone, ZoneServices } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { RuralZoneService } from 'src/app/apps/services/economic-mod-land/rural-zone.service';
import { GeoeconomicZoneService } from 'src/app/apps/services/economic-mod-land/geoeconomic-zone.service';
import { CreateZoneComponent } from '../create-zone/create-zone.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'zone-manager',
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
  templateUrl: './zone-manager.component.html',
  styles: ``
})
export class ZoneManagerComponent implements OnInit {

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
  public divpolLv1: string = '';
  public divpolLv2: string = '';
  public gettedZones: boolean = false;

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
    private geoeconomicZoneService: GeoeconomicZoneService,
    private snackBar: MatSnackBar
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
    if (this.form.invalid) return;

    this.dialog.closeAll();

    const { department, municipality } = this.form.value

    this.divpolLv1 = department.slice(0, 2)
    this.divpolLv2 = municipality.slice(0, 3)

    this.gettedZones = true;

    this.activeService.getZones(this.divpolLv1, this.divpolLv2)
      .subscribe({
        next: ((result: UrbanZone[] | RuralZone[] | GeoEconomicZone[]) => this.dataSource.data = result)
      })

  }

  openDialogCreateZone(): void {
    this.dialog.open(CreateZoneComponent, {
      width: '60%',
      data: {
        params: {
          title: this.stringCreateZone(this.typeZone),
          divpolLv1: this.divpolLv1,
          divpolLv2: this.divpolLv2
        },
        inputs: getZoneParams(this.typeZone)
      }
    }).afterClosed()
      .subscribe({
        next: (result: any) => {
          const params: Zone = {
            divpolLv1: this.divpolLv1,
            divpolLv2: this.divpolLv2,
            cadastreChangeLog: { changeLogId: result.changeLogId },
            ...result
          }
          this.createZone(params)
          this.getZones()
        }
        ,
        error: (error: any) => {
          this.snackBar.open(`Error al crear la zona ${this.stringCreateZone(this.typeZone)}`, 'Cerrar', {
            duration: 4000
          })
          throw error
        }
      })
  }

  createZone(params: Zone): void {
    this.activeService.createZone(params)
      .subscribe({
        next: (result: Zone) => {
          this.snackBar.open(`Se ha creado la zona ${this.stringCreateZone(this.typeZone)}`, 'Cerrar', {
            duration: 4000
          })
          console.log(result)
        },
        error: (error: any) => {
          this.snackBar.open(`Error al crear la zona ${this.stringCreateZone(this.typeZone)}`, 'Cerrar', {
            duration: 4000
          })
          throw error
        }
      })
  }

  stringCreateZone(typeZone: string): string {
    switch (typeZone) {
      case 'geoeconómicas':
        return 'geoeconómica'
      case 'rurales':
        return 'física rural'
      default:
        return 'física urbana'
    }
  }
}
