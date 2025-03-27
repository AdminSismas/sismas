import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';


// LIBRERIAS NATIVAS
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

// RECURSOS PERSONALES
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import {
  DIVPOLLVL2_CODE,
  DIVPOLLVL_CODE,
  LIMPIAR_CAMPOS_MULTIPLES_CAMPOS,
  LIMPIAR_CAMPOS_SELECCION_MUNICIPAL,
  LIST_FORM_CADASTRAL_0,
  LIST_FORM_CADASTRAL_1,
  LIST_FORM_CADASTRAL_2,
  LIST_FORM_CADASTRAL_3,
  LIST_FORM_CADASTRAL_4,
  LIST_FORM_CADASTRAL_5,
  LIST_ZONES_RURAL,
  NAME_CODENAME,
  STRING_INFORMATION_NOT_FOUND
} from '../../../../../apps/constants/general/constants';
import { CONSTANT_NAME_ID } from '../../../../../apps/constants/general/constantLabels';
import { Sidewalk } from 'src/app/apps/interfaces/territorial-organization/sidewalk.model';
import { Neighborhood } from 'src/app/apps/interfaces/territorial-organization/neighborhood.model';
import { Commune } from 'src/app/apps/interfaces/territorial-organization/commune.model';
import { Sector } from 'src/app/apps/interfaces/territorial-organization/sector.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { NationalPredialNumber } from '../../../../../apps/interfaces/information-property/national-predial-number';
import { SearchData } from '../../../../../apps/interfaces/general/search-data.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CharacterValidateService } from '../../../../../apps/utils/character-validate.service';
import {
  TerritorialOrganizationService
} from 'src/app/apps/services/territorial-organization/territorial-organization.service';
import { Zone } from 'src/app/apps/interfaces/territorial-organization/zone.model';
import { divideNpn } from 'src/app/apps/utils/divide-national-predial-number';
import { Block } from 'src/app/apps/interfaces/territorial-organization/block.model';


@Component({
  selector: 'vex-filter-cadastral-search-da',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective
  ],
  templateUrl: './filter-cadastral-search-da.component.html',
  styleUrl: './filter-cadastral-search-da.component.scss'
})
export class FilterCadastralSearchDaComponent implements OnInit {
  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;

  protected readonly LIMPIAR_CAMPOS_SELECCION_MUNICIPAL = LIMPIAR_CAMPOS_SELECCION_MUNICIPAL;
  protected readonly LIMPIAR_CAMPOS_MULTIPLES_CAMPOS = LIMPIAR_CAMPOS_MULTIPLES_CAMPOS;


  optionsDeparments: Department[] = [];
  optionsMunicipalities: Municipality[] = [];
  optionsZones: Zone[] = [];
  optionsSectors: Sector[] = [];
  optionsCommunities: Commune[] = [];
  optionsNeighborhoods: Neighborhood[] = [];
  optionsBlocks: Block[] = [];
  optionsSidewalks: Sidewalk[] = [];

  form: FormGroup = this.fb.group({


    // National Property Number,
    dpto: [this.defaults?.dpto ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    mpio: [this.defaults?.mpio ?? '',[Validators.maxLength(3),Validators.pattern(/^\d+$/)]],
    zonas: [this.defaults?.zonas ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    sectorb: [this.defaults?.sectorb ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    comuna: [this.defaults?.comuna ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    barrio: [this.defaults?.barrio ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    manVer: [this.defaults?.manVer ?? '',[Validators.maxLength(4),Validators.pattern(/^\d+$/)]],
    terreno: [this.defaults?.terreno ?? '',[Validators.maxLength(4),Validators.pattern(/^\d+$/)]],
    condicion: [this.defaults?.condicion ?? '',[Validators.maxLength(1),Validators.pattern(/^\d+$/)]],
    edificio: [this.defaults?.edificio ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    piso: [this.defaults?.piso ?? '',[Validators.maxLength(2),Validators.pattern(/^\d+$/)]],
    unidadPredial: [this.defaults?.unidadPredial ?? '',[Validators.maxLength(4),Validators.pattern(/^\d+$/)]],


    // MUltiple Fields
    registration: this.defaults?.registration ?? '',
    domIndividualTypeNumber: this.defaults?.domIndividualTypeNumber ?? '',
    firstName: this.defaults?.firstName ?? '',
    otherLastName: this.defaults?.otherLastName ?? '',
    textAddress: this.defaults?.textAddress ?? '',
    number: this.defaults?.number ?? '',
    middleName: this.defaults?.middleName ?? '',
    lastName: this.defaults?.lastName ?? '',
    companyName: this.defaults?.companyName ?? '',

    // Municipal Selection
    department: this.defaults?.department ?? '',
    municipality: this.defaults?.municipality ?? '',
    zone: this.defaults?.zone ?? '',
    sector: this.defaults?.sector ?? '',
    community: this.defaults?.community ?? '',
    neighborhood: this.defaults?.neighborhood ?? '',
    sidewalk: this.defaults?.sidewalk ?? '',
    block: this.defaults?.block ?? '',

  });

  filteredOptionsDepartments$: Observable<Department[]> | undefined;
  filteredOptionsMunicipalities$: Observable<Municipality[]> | undefined;
  filteredOptionsZones$: Observable<Zone[]> | undefined;
  filteredOptionsSectors$: Observable<Sector[]> | undefined;
  filteredOptionsCommunities$: Observable<Commune[]> | undefined;
  filteredOptionsNeighborhoods$: Observable<Neighborhood[]> | undefined;
  filteredOptionsBlocks$: Observable<Block[]> | undefined;
  filteredOptionsSidewalk$: Observable<Sidewalk[]> | undefined;

  searchCtrl: UntypedFormControl = new UntypedFormControl();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: SearchData | undefined,
    private dialogRef: MatDialogRef<FilterCadastralSearchDaComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private territorialOrganizationService: TerritorialOrganizationService,
    private fieldFormatterService: CharacterValidateService
  ) {
  }

  ngOnInit() {
    this.loadDepartmentalInformation();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {});
  }

  searchRegistrationNumber() {
    const searchData = this.validateFilterSearchCadastral();
    if (searchData.registration?.length > 1) {
      this.dialogRef.close(searchData);
      return;
    }
    this.openSnackbar(
      'No es posible la búsqueda por círculo - matrícula, datos no válidos',
      'CERRAR', 'end'
    );
  }

  searchByDocumentAndTypeNumber() {
    const searchData = this.validateFilterSearchCadastral();
    if (searchData.number?.length > 1 && searchData.domIndividualTypeNumber?.length > 1) {
      this.dialogRef.close(searchData);
      return;
    }
    this.openSnackbar(
      'No es posible la búsqueda por doumento y tipo de documento, datos no válidos',
      'CERRAR', 'end'
    );
  }

  formatFieldValue() {

      this.dpto?.reset();
      this.mpio?.reset();
      this.zonas?.reset();
      this.sectorb?.reset();
      this.comuna?.reset();
      this.barrio?.reset();
      this.manVer?.reset();
      this.terreno?.reset();
      this.condicion?.reset();
      this.edificio?.reset();
      this.piso?.reset();
      this.unidadPredial?.reset();
  }



  public sendInformationTable() {
    const searchData = this.validateFilterSearchCadastral();
    const searchDataFiltered: SearchData = new SearchData(searchData);

    searchDataFiltered.dpto = this.fieldFormatterService.formatField(this.dpto?.value, 2);
    searchDataFiltered.mpio = this.fieldFormatterService.formatField(this.mpio?.value, 3);
    searchDataFiltered.zonas = this.fieldFormatterService.formatField(this.zonas?.value, 2);
    searchDataFiltered.sectorb = this.fieldFormatterService.formatField(this.sectorb?.value, 2);
    searchDataFiltered.comuna =  this.fieldFormatterService.formatField(this.comuna?.value, 2);
    searchDataFiltered.barrio = this.fieldFormatterService.formatField(this.barrio?.value, 2);
    searchDataFiltered.manVer = this.fieldFormatterService.formatField(this.manVer?.value, 4);
    searchDataFiltered.terreno = this.fieldFormatterService.formatField(this.terreno?.value, 4);
    searchDataFiltered.condicion =  this.fieldFormatterService.formatField(this.condicion?.value, 1);
    searchDataFiltered.edificio =  this.fieldFormatterService.formatField(this.edificio?.value, 2);
    searchDataFiltered.piso = this.fieldFormatterService.formatField(this.piso?.value, 2);
    searchDataFiltered.unidadPredial = this.fieldFormatterService.formatField(this.unidadPredial?.value, 4);

    if (searchDataFiltered) {
      this.dialogRef.close(searchDataFiltered);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por selección de Municipio, datos no válidos o incompletos',
      'CERRAR', 'end'
    );
  }

  searchByName() {
    const searchData = this.validateFilterSearchCadastral();
    this.dialogRef.close(searchData);
  }

  searchByAddress() {
    const searchData = this.validateFilterSearchCadastral();
    if (searchData.textAddress != null && searchData.textAddress.length > 1) {
      this.dialogRef.close(searchData);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por dirección, datos no válidos',
      'CERRAR', 'end'
    );
  }

  public clearFormFields(value:any){
    if(value?.tab?.textLabel === 'Seleccion Municipal'){
      this.formatFieldValue();
      this.clearMunicipalSelection();
    }

    if(value?.tab?.textLabel === 'Multiplex Campos'){
      this.clearMunicipalSelection();
      this.formatFieldValue();
    }

    if(value?.tab?.textLabel === 'Numero Predial Nacional'){
      this.clearMunicipalSelection();
      this.clearMultipleFields();
    }
  }

  public clearMunicipalSelection(){
    this.department?.reset();
    this.municipality?.reset();
    this.zone?.reset();
    this.sector?.reset();
    this.community?.reset();
    this.number?.reset();
    this.neighborhood?.reset();
    this.sidewalk?.reset();
    this.block?.reset();

  }

  public clearMultipleFields(){
    this.registration?.reset();
    this.domIndividualTypeNumber?.reset();
    this.firstName?.reset();
    this.otherLastName?.reset();
    this.textAddress?.reset();
    this.number?.reset();
    this.middleName?.reset();
    this.lastName?.reset();
    this.companyName?.reset();


  }



  validateFilterSearchCadastral(): any {
    const searchData = this.form.value;
    if (searchData == null) {
      throw new Error(
        'Customer ID does not exist, this customer cannot be updated'
      );
    }
    return searchData;
  }

  openSnackbar(msg: string, action: string, position: MatSnackBarHorizontalPosition) {
    this.snackBar.open(
      msg, action, { duration: 3000, horizontalPosition: position }
    );
  }


  searchMunicipalSelection() {
    const searchData = this.validateFilterSearchCadastral();
    const searchDataFiltered: SearchData = new SearchData(searchData);
    searchDataFiltered.department = this._filterInformationCode(searchData.department, this.optionsDeparments, NAME_CODENAME, DIVPOLLVL_CODE);
    searchDataFiltered.municipality = this._filterInformationCode(searchData.municipality, this.optionsMunicipalities, NAME_CODENAME, DIVPOLLVL2_CODE);
    searchDataFiltered.zone = this.captureCodeOfCodeNameAndID(searchData.zone, this.optionsZones);
    searchDataFiltered.sector = this.captureCodeOfCodeNameAndID(searchData.sector, this.optionsSectors);
    searchDataFiltered.community = this.captureCodeOfCodeNameAndID(searchData.community, this.optionsCommunities);
    searchDataFiltered.neighborhood = this.captureCodeOfCodeNameAndID(searchData.neighborhood, this.optionsNeighborhoods);
    searchDataFiltered.sidewalk = this.captureCodeOfCodeNameAndID(searchData.sidewalk, this.optionsSidewalks);
    searchDataFiltered.block = this.captureCodeOfCodeNameAndID(searchData.block, this.optionsBlocks);

    if (searchDataFiltered.sidewalk !== null && searchDataFiltered.sidewalk !== undefined && searchDataFiltered.sidewalk.length > 10 ||
      searchDataFiltered.block !== null && searchDataFiltered.block !== undefined && searchDataFiltered.block.length > 10) {
      this.dialogRef.close(searchDataFiltered);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por selección de Municipio, datos no válidos o incompletos',
      'CERRAR', 'end'
    );
  }


  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDepartments()
      .subscribe({
          next: (result: Department[]) => this.captureDepartmentInformation(result)
        }
      );
  }
  loadMunicipalitiesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(0);
    const dpto = this._filterInformationCode(
      codeName, this.optionsDeparments, NAME_CODENAME, DIVPOLLVL_CODE);
    if (dpto == null || dpto?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataMunicipalities(dpto)
      .subscribe({
          next: (result: Municipality[]) => this.captureMunicipalityInformation(result, skipPreloadedValues)
        }
      );
  }
  loadZonesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(1);
    const deptoMpio = this._filterInformationCode(
      codeName, this.optionsMunicipalities, NAME_CODENAME, DIVPOLLVL2_CODE);
    if (deptoMpio == null || deptoMpio?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataZones(deptoMpio)
      .subscribe({
          next: (result: Zone[]) => this.captureZoneInformation(result, skipPreloadedValues)
        }
      );
  }
  loadSectorsInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(2);
    const ccZonaPkey: string | null | undefined = this.captureCodeOfCodeNameAndID(codeName, this.optionsZones);
    this.territorialOrganizationService.getDataSectors(ccZonaPkey)
      .subscribe({
          next: (result: Sector[]) => this.captureSectorInformation(result, skipPreloadedValues)
        }
      );
  }
  loadCommunitiesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(3);
    const sectorPkey: string | null | undefined = this.captureCodeOfCodeNameAndID(codeName, this.optionsSectors);
    const nationalPredialNumber: NationalPredialNumber = divideNpn(sectorPkey);
    if (!nationalPredialNumber.zone) {
      return;
    }

    if (LIST_ZONES_RURAL.includes(nationalPredialNumber.zone)) {
      this.loadSidewalksInformation(codeName, skipPreloadedValues);
      return;
    }

    this.territorialOrganizationService.getDataCommunes(sectorPkey)
      .subscribe({
          next: (result: Commune[]) => this.captureCommunitiesInformation(result, skipPreloadedValues)
        }
      );
  }
  loadNeighborhoodsInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(4);
    const communityPkey: string | null | undefined = this.captureCodeOfCodeNameAndID(codeName, this.optionsCommunities);
    this.territorialOrganizationService.getDataNeighborhoods(communityPkey)
      .subscribe({
          next: (result: Neighborhood[]) => this.captureNeighborhoodsInformation(result, skipPreloadedValues)
        }
      );
  }
  loadSidewalksInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(5);
    const sectorPkey: string | null | undefined = this.captureCodeOfCodeNameAndID(codeName, this.optionsSectors);
    this.territorialOrganizationService.getDataSidewalks(sectorPkey)
      .subscribe({
          next: (result: Sidewalk[]) => this.captureSidewalksInformation(result, skipPreloadedValues)
        }
      );
  }
  loadBlocksInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(5);
    const neighborhoodPkey: string | null | undefined = this.captureCodeOfCodeNameAndID(codeName, this.optionsNeighborhoods);
    this.territorialOrganizationService.getDataBlocks(neighborhoodPkey)
      .subscribe({
          next: (result: Block[]) => this.captureBlocksInformation(result, skipPreloadedValues)
        }
      );
  }


  captureDepartmentInformation(result: Department[]) {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparments = result;

    if (this.defaults?.department) {
      const listOptions: Department[] = this.optionsDeparments.filter(
        (option: Department): boolean => option.divpolLvl1Code === this.defaults?.department);
      if (listOptions?.length > 0) {
        this.form.get('department')?.patchValue(listOptions[0].codeName);
        this.loadMunicipalitiesInformation(listOptions[0].codeName, false);
      }
    }

    this.filteredOptionsDepartments$ = this.form.get('department')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsDeparments.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureMunicipalityInformation(result: Municipality[], skipPreloadedValues: boolean | null) {
    result = result.map((mncp: Municipality) => new Municipality(mncp));
    this.optionsMunicipalities = result;

    if (this.defaults?.municipality && !skipPreloadedValues) {
      const listOptions: Municipality[] = this.optionsMunicipalities.filter(
        (option: Municipality): boolean => option.divpolLvl2Code === this.defaults?.municipality);
      if (listOptions?.length > 0) {
        this.form.get('municipality')?.patchValue(listOptions[0].codeName);
        this.loadZonesInformation(listOptions[0].codeName, false);
      }
    }

    this.filteredOptionsMunicipalities$ = this.form.get('municipality')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsMunicipalities.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureZoneInformation(result: Zone[], skipPreloadedValues: boolean | null) {
    result = result.map((dpto: Zone) => new Zone(dpto));
    this.optionsZones = result;

    if (this.defaults?.zone && !skipPreloadedValues) {
      const listOptions: Zone[] = this.optionsZones.filter(
        (option: Zone): boolean => option.id === this.defaults?.zone);
      if (listOptions?.length > 0) {
        this.form.get('zone')?.patchValue(listOptions[0].codeName);
        this.loadSectorsInformation(listOptions[0].codeName, false);
      }
    }

    this.filteredOptionsZones$ = this.form.get('zone')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsZones.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureSectorInformation(result: Sector[], skipPreloadedValues: boolean | null) {
    result = result.map((dpto: Sector) => new Sector(dpto));
    this.optionsSectors = result;

    if (this.defaults?.sector && !skipPreloadedValues) {
      const listOptions: Sector[] = this.optionsSectors.filter(
        (option: Sector): boolean => option.id === this.defaults?.sector);
      if (listOptions?.length > 0) {
        this.form.get('sector')?.patchValue(listOptions[0].codeName);
        this.loadCommunitiesInformation(listOptions[0].codeName, false);
      }
    }

    this.filteredOptionsSectors$ = this.form.get('sector')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsSectors.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureCommunitiesInformation(result: Commune[], skipPreloadedValues: boolean | null) {
    result = result.map((dpto: Commune) => new Commune(dpto));
    this.optionsCommunities = result;

    if (this.defaults?.community && !skipPreloadedValues) {
      const listOptions: Commune[] = this.optionsCommunities.filter(
        (option: Commune): boolean => option.id === this.defaults?.community);
      if (listOptions?.length > 0) {
        this.form.get('community')?.patchValue(listOptions[0].codeName);
        this.loadNeighborhoodsInformation(listOptions[0].codeName, false);
      }
    }

    this.filteredOptionsCommunities$ = this.form.get('community')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsCommunities.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureNeighborhoodsInformation(result: Neighborhood[], skipPreloadedValues: boolean | null) {
    result = result.map((dpto: Neighborhood) => new Neighborhood(dpto));
    this.optionsNeighborhoods = result;

    if (this.defaults?.neighborhood && !skipPreloadedValues) {
      const listOptions: Neighborhood[] = this.optionsNeighborhoods.filter(
        (option: Neighborhood): boolean => option.id === this.defaults?.neighborhood);
      if (listOptions?.length > 0) {
        this.form.get('neighborhood')?.patchValue(listOptions[0].codeName);
        this.loadBlocksInformation(listOptions[0].codeName, false);
      }
    }

    this.filteredOptionsNeighborhoods$ = this.form.get('neighborhood')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsNeighborhoods.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureSidewalksInformation(result: Sidewalk[], skipPreloadedValues: boolean | null) {
    result = result.map((sd: Sidewalk) => new Sidewalk(sd));
    this.optionsSidewalks = result;

    if (this.defaults?.sidewalk && !skipPreloadedValues) {
      const listOptions: Sidewalk[] = this.optionsSidewalks.filter(
        (option: Sidewalk): boolean => option.id === this.defaults?.sidewalk);
      if (listOptions?.length > 0) {
        this.form.get('sidewalk')?.patchValue(listOptions[0].codeName);
      }
    }

    this.filteredOptionsSidewalk$ = this.form.get('sidewalk')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsSidewalks.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }
  captureBlocksInformation(result: Block[], skipPreloadedValues: boolean | null) {
    result = result.map((sd: Block) => new Block(sd));
    this.optionsBlocks = result;

    if (this.defaults?.block && !skipPreloadedValues) {
      const listOptions: Block[] = this.optionsBlocks.filter(
        (option: Block): boolean => option.id === this.defaults?.block);
      if (listOptions?.length > 0) {
        this.form.get('block')?.patchValue(listOptions[0].codeName);
      }
    }

    this.filteredOptionsBlocks$ = this.form.get('block')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsBlocks.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }


  private _filterInformationCode(code: string, options: any[], keyValue: string, key: string): string | undefined | null {
    const listOptions: any[] = options
      .filter((option: any): boolean => option[keyValue] === code);
    return listOptions?.length > 0 && listOptions[0][key] ? listOptions[0][key] : null;
  }
  private captureCodeOfCodeNameAndID(codeName: string, options: any[]): string | null | undefined {
    return this._filterInformationCode(codeName, options, NAME_CODENAME, CONSTANT_NAME_ID);
  }
  private _clearFormSelection(code: number) {
    if (code === 0) {
      this._clearListForm(LIST_FORM_CADASTRAL_0);
      this._clearListObject(0);
    }
    if (code === 1) {
      this._clearListForm(LIST_FORM_CADASTRAL_1);
      this._clearListObject(1);
    }
    if (code === 2) {
      this._clearListForm(LIST_FORM_CADASTRAL_2);
      this._clearListObject(2);
    }
    if (code === 3) {
      this._clearListForm(LIST_FORM_CADASTRAL_3);
      this._clearListObject(3);
    }
    if (code === 4) {
      this._clearListForm(LIST_FORM_CADASTRAL_4);
      this._clearListObject(4);
    }
    if (code === 5) {
      this._clearListForm(LIST_FORM_CADASTRAL_5);
      this._clearListObject(5);
    }
  }
  private _clearListForm(list: string[]): void {
    list.forEach((value): void => this.form.get(value)?.patchValue(''));
  }
  private _clearListObject(code: number) {
    if (code === 0) this._clearListObject0();
    if (code === 1) this._clearListObject1();
    if (code === 2) this._clearListObject2();
    if (code === 3) this._clearListObject3();
    if (code === 4) this._clearListObject4();
    if (code === 5) this._clearListObject5();
  }

  private _clearListObject0() {
    if (this.optionsMunicipalities?.length > 0) this.captureMunicipalityInformation([], null);
    this._clearListObject1();
  }
  private _clearListObject1() {
    if (this.optionsZones?.length > 0) this.captureZoneInformation([], null);
    this._clearListObject2();
  }
  private _clearListObject2() {
    if (this.optionsSectors?.length > 0) this.captureSectorInformation([], null);
    this._clearListObject3();
  }
  private _clearListObject3() {
    if (this.optionsCommunities?.length > 0) this.captureCommunitiesInformation([], null);
    this._clearListObject4();
  }
  private _clearListObject4() {
    if (this.optionsNeighborhoods?.length > 0) this.captureNeighborhoodsInformation([], null);
    this._clearListObject5();
  }
  private _clearListObject5() {
    if (this.optionsSidewalks?.length > 0) this.captureSidewalksInformation([], null);
    if (this.optionsBlocks?.length > 0) this.captureBlocksInformation([], null);
  }

// formulario nuevo


get dpto(){
  return this.form.get('dpto');
}

get mpio(){
  return this.form.get('mpio');
}

get zonas(){
  return this.form.get('zonas');
}

get sectorb(){
  return this.form.get('sectorb');
}

get comuna(){
  return this.form.get('comuna');
}

get barrio(){
  return this.form.get('barrio');
}

get terreno(){
  return this.form.get('terreno');
}

get condicion(){
  return this.form.get('condicion');
}

get edificio(){
  return this.form.get('edificio');
}

get piso(){
  return this.form.get('piso');
}

get unidadPredial(){
  return this.form.get('unidadPredial');
}

//

  get registration(){
    return this.form.get('registration');
  }

  get domIndividualTypeNumber(){
    return this.form.get('domIndividualTypeNumber');
  }

  get firstName(){
    return this.form.get('firstName');
  }

  get otherLastName(){
    return this.form.get('otherLastName');
  }

  get textAddress(){
    return this.form.get('textAddress');
  }

  get number(){
    return this.form.get('number');
  }

  get middleName(){
    return this.form.get('middleName');
  }

  get lastName(){
    return this.form.get('lastName');
  }

  get companyName(){
    return this.form.get('companyName');
  }

  get department(){
    return this.form.get('department');
  }

  get municipality(){
    return this.form.get('municipality');
  }

  get zone(){
    return this.form.get('zone');
  }

  get manVer(){
    return this.form.get('manVer');
  }

  get sector(){
    return this.form.get('sector');
  }

  get community(){
    return this.form.get('community');
  }

  get neighborhood(){
    return this.form.get('neighborhood');
  }

  get sidewalk(){
    return this.form.get('sidewalk');
  }


  get block(){
    return this.form.get('block');
  }


}
