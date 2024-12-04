import { AsyncPipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { FilterCadastralSearchComponent } from 'src/app/apps/components/table-cadastral-search/filter-cadastral-search/filter-cadastral-search.component';
import { NAME_CODENAME, STRING_INFORMATION_NOT_FOUND } from 'src/app/apps/constants/constant';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { TerritorialOrganizationService } from 'src/app/apps/services/territorial-organization/territorial-organization.service';

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
  // public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public dataSource = [
    {
      "zonaHomoFisicaUrId": 2,
      "zonaHomoFisicaUrCode": "102",
      "domTopografiaZonaTipo": "Plano",
      "domInfluenciaVialUrbanaTipo": "Pavimentadas",
      "domServiciosPublicosTipo": "Servicios_Basicos_Completos",
      "domUsoSueloUrbanoTipo": "Residencial",
      "normaUsoSuelo": "POR DEFINIR",
      "domTipificacionConstruccionTipo": "Residencial_5_Medio_Alto",
      "vigencia": 2023,
      "divpolLv1": "18",
      "divpolLv2": "001"
    },
    {
      "zonaHomoFisicaUrId": 4,
      "zonaHomoFisicaUrCode": "101",
      "domTopografiaZonaTipo": "Inclinado",
      "domInfluenciaVialUrbanaTipo": "Pavimentadas",
      "domServiciosPublicosTipo": "Servicios_Basicos_Completos",
      "domUsoSueloUrbanoTipo": "Residencial",
      "normaUsoSuelo": "POR DEFINIR TEST UPDATE",
      "domTipificacionConstruccionTipo": "Residencial_5_Medio_Alto",
      "vigencia": 2023,
      "divpolLv1": "18",
      "divpolLv2": "001"
    },
    {
      "zonaHomoFisicaUrId": 3,
      "zonaHomoFisicaUrCode": "103",
      "domTopografiaZonaTipo": "Plano",
      "domInfluenciaVialUrbanaTipo": "Pavimentadas",
      "domServiciosPublicosTipo": "Servicios_Basicos_Completos",
      "domUsoSueloUrbanoTipo": "Residencial",
      "normaUsoSuelo": "POR DEFINIR",
      "domTipificacionConstruccionTipo": "Residencial_5_Medio_Alto",
      "vigencia": 2023,
      "divpolLv1": "18",
      "divpolLv2": "001"
    }
  ]
  public columns: { name: string, title: string }[] = [
    {
      name: 'zonaHomoFisicaUrCode',
      title: 'Código'
    },
    {
      name: 'domUsoSueloUrbanoTipo',
      title: 'Uso de suelo'
    },
    {
      name: 'vigencia',
      title: 'Vigencia'
    }
  ]
  public displayedColumns: string[] = this.columns.map((column) => column.name);


  @ViewChild('searchDialog', { static: true }) searchDialog!: TemplateRef<any>;
  optionsMunicipalities: Municipality[] = [];


  constructor(
    private territorialOrganizationService: TerritorialOrganizationService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadDepartmentalInformation()
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

  searchZone() {
    console.log('Searching ...')
    console.log(this.form.value)
  }
}
