/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchData } from '../../../interfaces/search-data.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition
} from '@angular/material/snack-bar';
import { ComboxColletionComponent } from '../../combox-colletion/combox-colletion.component';
import { InputComponent } from '../../input/input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TerritorialOrganizationService } from '../../../services/territorial-organization/territorial-organization.service';
import { Department } from '../../../interfaces/territorial-organization/department.model';
import { Municipality } from '../../../interfaces/territorial-organization/municipality.model';
import {
  LIST_FORM_CADASTRAL_0,
  LIST_FORM_CADASTRAL_1,
  LIST_FORM_CADASTRAL_2,
  LIST_FORM_CADASTRAL_3,
  LIST_FORM_CADASTRAL_4,
  LIST_FORM_CADASTRAL_5,
  LIST_ZONES_RURAL,
  NAME_CODENAME,
  STRING_INFORMATION_NOT_FOUND,
  LIMPIAR_CAMPOS_MULTIPLES_CAMPOS,
  LIMPIAR_CAMPOS_SELECCION_MUNICIPAL
} from '../../../constants/constant';
import { Zone } from '../../../interfaces/territorial-organization/zone.model';
import { Sector } from '../../../interfaces/territorial-organization/sector.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Neighborhood } from '../../../interfaces/territorial-organization/neighborhood.model';
import { Block } from '../../../interfaces/territorial-organization/block.model';
import { Sidewalk } from '../../../interfaces/territorial-organization/sidewalk.model';
import { Commune } from '../../../interfaces/territorial-organization/commune.model';
import { NationalPredialNumber } from '../../../interfaces/national-predial-number';
import { divideNpn } from '../../../utils/divide-national-predial-number';
import { CONSTANT_NAME_ID } from '../../../constants/constantLabels';
import { CharacterValidateService } from 'src/app/apps/services/character-validate.service';

@Component({
  selector: 'vex-filter-certificate-search-appraisals',
  templateUrl: './filter-certificate-search-appraisals.component.html',
  styleUrls: ['./filter-certificate-search-appraisals.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Vex
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    // Material
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
    // Custom
    ComboxColletionComponent,
    InputComponent,
  ]
})
export class FilterCertificateSearchAppraisalsComponent implements OnInit {
  protected readonly STRING_INFORMATION_NOT_FOUND =
    STRING_INFORMATION_NOT_FOUND;

  protected readonly LIMPIAR_CAMPOS_SELECCION_MUNICIPAL =
    LIMPIAR_CAMPOS_SELECCION_MUNICIPAL;
  protected readonly LIMPIAR_CAMPOS_MULTIPLES_CAMPOS =
    LIMPIAR_CAMPOS_MULTIPLES_CAMPOS;

  optionsDepartments: Department[] = [];
  optionsMunicipalities: Municipality[] = [];
  optionsZones: Zone[] = [];
  optionsSectors: Sector[] = [];
  optionsCommunities: Commune[] = [];
  optionsNeighborhoods: Neighborhood[] = [];
  optionsBlocks: Block[] = [];
  seeRuleField: boolean = true;

  optionsSidewalks: Sidewalk[] = [];
  defaultData: SearchData = this.defaults?.searchData;


  
  // Form BaunitIdE
  formBaunitIdE: FormGroup = this.fb.group({
    baunitIdE: ['']
  });

  // Form Npn Complete
  formNpnComplete: FormGroup = this.fb.group({
    codigoCompleto: ['']
  });

  // Form Npn Like
  formNpnLike: FormGroup = this.fb.group({
    dpto: [this.defaultData?.dpto ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    mpio: [this.defaultData?.mpio ?? '', [Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    zonas: [this.defaultData?.zonas ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    sector: [this.defaultData?.sectorb ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    comuna: [this.defaultData?.comuna ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    barrio: [this.defaultData?.barrio ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    manVer: [this.defaultData?.manVer ?? '', [Validators.maxLength(4), Validators.pattern(/^\d+$/)]],
    terreno: [this.defaultData?.terreno ?? '', [Validators.maxLength(4), Validators.pattern(/^\d+$/)]],
    condicion: [this.defaultData?.condicion ?? '', [Validators.maxLength(1), Validators.pattern(/^\d+$/)]],
    edificio: [this.defaultData?.edificio ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    piso: [this.defaultData?.piso ?? '', [Validators.maxLength(2), Validators.pattern(/^\d+$/)]],
    unidadPredial: [this.defaultData?.unidadPredial ?? '', [Validators.maxLength(4), Validators.pattern(/^\d+$/)]],
  });

  // Form Registration
  formRegistration: FormGroup = this.fb.group({
    registration: [this.defaultData?.registration ?? '', [Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
  });

  // Form Document Type
  formDocumentType: FormGroup = this.fb.group({
    number: [this.defaultData?.number ?? '', [Validators.maxLength(10), Validators.pattern(/^\d+$/)]],
    domIndividualTypeNumber: this.defaultData?.domIndividualTypeNumber ?? '',
  });

  // Form Name or Company Name
  formNames: FormGroup = this.fb.group({
    firstName: [this.defaultData?.firstName ?? '', Validators.required],
    middleName: [this.defaultData?.middleName ?? ''],
    lastName: [this.defaultData?.lastName ?? '', Validators.required],
    otherLastName: [this.defaultData?.otherLastName ?? ''],
    companyName: [this.defaultData?.companyName ?? ''],
  });
  
  // Form Address
  formAddress: FormGroup = this.fb.group({
    textAddress: this.defaultData?.textAddress ?? '',
  });

  // Form Municipal Selection
  formMunicipalSelection: FormGroup = this.fb.group({
    department: this.defaultData?.department ?? '',
    municipality: this.defaultData?.municipality ?? '',
    zone: this.defaultData?.zone ?? '',
    sector: this.defaultData?.sector ?? '',
    community: this.defaultData?.community ?? '',
    neighborhood: this.defaultData?.neighborhood ?? '',
    sidewalk: this.defaultData?.sidewalk ?? '',
    block: this.defaultData?.block ?? ''
  });

  searchCtrl: UntypedFormControl = new UntypedFormControl();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any | undefined,
    private dialogRef: MatDialogRef<FilterCertificateSearchAppraisalsComponent>,
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
      .subscribe((value) => console.log(value));
      this.proccessRulePage()
  }

  proccessRulePage() {
    if(this.defaults && this.defaults.rulePage) {
      if(this.defaults.rulePage === 'cadastralSearchDA') {
       this.formDocumentType.disable()
       this.formNames.disable();
       this.seeRuleField = false;
      }else{
        this.formDocumentType.enable()
       this.formNames.enable();
       this.seeRuleField = true;
       
      }

    }
  }

  searchRegistrationNumber() {
    const registration = this.registration?.value;
    if (registration?.length > 1) {
      this.dialogRef.close({ registration });
      return;
    }
    this.openSnackbar(
      'No es posible la búsqueda por círculo - matrícula, datos no válidos',
      'CERRAR',
      'end'
    );
  }

  searchByDocumentAndTypeNumber() {
    const searchData = { number: this.number?.value, domIndividualTypeNumber: this.domIndividualTypeNumber?.value };
    if (
      searchData.number?.length > 1 &&
      searchData.domIndividualTypeNumber?.length > 1
    ) {
      this.dialogRef.close(searchData);
      return;
    }
    this.openSnackbar(
      'No es posible la búsqueda por documento y tipo de documento, datos no válidos',
      'CERRAR',
      'end'
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
    if (this.codigoCompleto?.valid && this.codigoCompleto?.value?.trim()) {
      searchDataFiltered.codigoCompleto = this.codigoCompleto.value.trim();
    } else {
      searchDataFiltered.dpto = this.fieldFormatterService.formatField(
        this.dpto?.value,
        2
      );
      searchDataFiltered.mpio = this.fieldFormatterService.formatField(
        this.mpio?.value,
        3
      );
      searchDataFiltered.zonas = this.fieldFormatterService.formatField(
        this.zonas?.value,
        2
      );
      searchDataFiltered.sectorb = this.fieldFormatterService.formatField(
        this.sectorb?.value,
        2
      );
      searchDataFiltered.comuna = this.fieldFormatterService.formatField(
        this.comuna?.value,
        2
      );
      searchDataFiltered.barrio = this.fieldFormatterService.formatField(
        this.barrio?.value,
        2
      );
      searchDataFiltered.manVer = this.fieldFormatterService.formatField(
        this.manVer?.value,
        4
      );
      searchDataFiltered.terreno = this.fieldFormatterService.formatField(
        this.terreno?.value,
        4
      );
      searchDataFiltered.condicion = this.fieldFormatterService.formatField(
        this.condicion?.value,
        1
      );
      searchDataFiltered.edificio = this.fieldFormatterService.formatField(
        this.edificio?.value,
        2
      );
      searchDataFiltered.piso = this.fieldFormatterService.formatField(
        this.piso?.value,
        2
      );
      searchDataFiltered.unidadPredial = this.fieldFormatterService.formatField(
        this.unidadPredial?.value,
        4
      );
    }

    if (searchDataFiltered) {
      this.dialogRef.close(searchDataFiltered);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por selección de Municipio, datos no válidos o incompletos',
      'CERRAR',
      'end'
    );
    console.log(searchDataFiltered);
  }

  searchByName() {
    if (!this.formNames.invalid || this.formNames.get('companyName')?.value?.length > 0) {
      const searchData = {
        firstName: this.firstName?.value.toUpperCase(),
        middleName: this.middleName?.value.toUpperCase(),
        lastName: this.lastName?.value.toUpperCase(),
        otherLastName: this.otherLastName?.value.toUpperCase(),
        companyName: this.companyName?.value.toUpperCase()
      };

      this.dialogRef.close(searchData);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por nombre, datos no válidos o incompletos',
      'Aceptar',
      'end'
    );
  }

  searchByAddress() {
    const searchData = { textAddress: this.textAddress?.value };
    if (searchData.textAddress != null && searchData.textAddress.length > 1) {
      this.dialogRef.close(searchData);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por dirección, datos no válidos',
      'CERRAR',
      'end'
    );
  }

  public clearFormFields(value: any) {
    console.log('value', value?.tab?.textLabel);

    if (value?.tab?.textLabel === 'Selección Municipal') {
      this.clearMultipleFields();
      this.formatFieldValue();
    }

    if (value?.tab?.textLabel === 'Múltiplex Campos') {
      this.clearMunicipalSelection();
      this.formatFieldValue();
    }

    if (value?.tab?.textLabel === 'Número Predial Nacional') {
      this.clearMunicipalSelection();
      this.clearMultipleFields();
    }
  }

  public clearMunicipalSelection() {
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

  public clearMultipleFields() {
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
    const searchData = this.formMunicipalSelection.value;
    if (searchData == null) {
      throw new Error(
        'Customer ID does not exist, this customer cannot be updated'
      );
    }
    return searchData;
  }

  openSnackbar(
    msg: string,
    action: string,
    position: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(msg, action, {
      duration: 3000,
      horizontalPosition: position
    });
  }

  searchMunicipalSelection() {
    const searchData = this.validateFilterSearchCadastral();
    const searchDataFiltered: SearchData = new SearchData(searchData);
    searchDataFiltered.department = this._filterInformationCode(
      searchData.department,
      this.optionsDepartments,
      NAME_CODENAME,
      'divpolLvl1Code'
    );
    searchDataFiltered.municipality = this._filterInformationCode(
      searchData.municipality,
      this.optionsMunicipalities,
      NAME_CODENAME,
      'divpolLvl2Code'
    );
    searchDataFiltered.zone = this.captureCodeOfCodeNameAndID(
      searchData.zone,
      this.optionsZones
    );
    searchDataFiltered.sector = this.captureCodeOfCodeNameAndID(
      searchData.sector,
      this.optionsSectors
    );
    searchDataFiltered.community = this.captureCodeOfCodeNameAndID(
      searchData.community,
      this.optionsCommunities
    );
    searchDataFiltered.neighborhood = this.captureCodeOfCodeNameAndID(
      searchData.neighborhood,
      this.optionsNeighborhoods
    );
    searchDataFiltered.sidewalk = this.captureCodeOfCodeNameAndID(
      searchData.sidewalk,
      this.optionsSidewalks
    );
    searchDataFiltered.block = this.captureCodeOfCodeNameAndID(
      searchData.block,
      this.optionsBlocks
    );

    if (
      (searchDataFiltered.sidewalk !== null &&
        searchDataFiltered.sidewalk !== undefined &&
        searchDataFiltered.sidewalk.length > 10) ||
      (searchDataFiltered.block !== null &&
        searchDataFiltered.block !== undefined &&
        searchDataFiltered.block.length > 10)
    ) {
      this.dialogRef.close(searchDataFiltered);
      return;
    }

    this.openSnackbar(
      'No es posible la búsqueda por selección de Municipio, datos no válidos o incompletos',
      'CERRAR',
      'end'
    );
    console.log(searchDataFiltered);
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDepartments().subscribe({
      next: (result: Department[]) => this.captureDepartmentInformation(result)
    });
  }
  loadMunicipalitiesInformation(
    codeName: string,
    skipPreloadedValues: boolean | null
  ) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(0);
    const dpto = this._filterInformationCode(
      codeName,
      this.optionsDepartments,
      NAME_CODENAME,
      'divpolLvl1Code'
    );
    if (dpto == null || dpto?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataMunicipalities(dpto).subscribe({
      next: (result: Municipality[]) =>
        this.captureMunicipalityInformation(result, skipPreloadedValues)
    });
  }
  loadZonesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(1);
    const deptoMpio = this._filterInformationCode(
      codeName,
      this.optionsMunicipalities,
      NAME_CODENAME,
      'divpolLvl2Code'
    );
    if (deptoMpio == null || deptoMpio?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataZones(deptoMpio).subscribe({
      next: (result: Zone[]) =>
        this.captureZoneInformation(result, skipPreloadedValues)
    });
  }
  loadSectorsInformation(
    codeName: string,
    skipPreloadedValues: boolean | null
  ) {
    console.log(codeName === '00');
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(2);
    const ccZonaPkey: string | null | undefined = this._filterInformationCode(
      codeName,
      this.optionsZones,
      'codigoZona',
      'id'
    );
    this.territorialOrganizationService.getDataSectors(ccZonaPkey).subscribe({
      next: (result: Sector[]) =>
        this.captureSectorInformation(result, skipPreloadedValues)
    });
  }
  loadCommunitiesInformation(
    codeName: string,
    skipPreloadedValues: boolean | null
  ) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(3);
    const sectorPkey: string | null | undefined =
      this.captureCodeOfCodeNameAndID(codeName, this.optionsSectors);
    const nationalPredialNumber: NationalPredialNumber = divideNpn(sectorPkey);
    if (!nationalPredialNumber.zone) {
      return;
    }

    if (LIST_ZONES_RURAL.includes(nationalPredialNumber.zone)) {
      this.loadSidewalksInformation(codeName, skipPreloadedValues);
      return;
    }

    this.territorialOrganizationService.getDataCommunes(sectorPkey).subscribe({
      next: (result: Commune[]) =>
        this.captureCommunitiesInformation(result, skipPreloadedValues)
    });
  }
  loadNeighborhoodsInformation(
    codeName: string,
    skipPreloadedValues: boolean | null
  ) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(4);
    const communityPkey: string | null | undefined =
      this.captureCodeOfCodeNameAndID(codeName, this.optionsCommunities);
    this.territorialOrganizationService
      .getDataNeighborhoods(communityPkey)
      .subscribe({
        next: (result: Neighborhood[]) =>
          this.captureNeighborhoodsInformation(result, skipPreloadedValues)
      });
  }
  loadSidewalksInformation(
    codeName: string,
    skipPreloadedValues: boolean | null
  ) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(5);
    const sectorPkey: string | null | undefined =
      this.captureCodeOfCodeNameAndID(codeName, this.optionsSectors);
    this.territorialOrganizationService.getDataSidewalks(sectorPkey).subscribe({
      next: (result: Sidewalk[]) =>
        this.captureSidewalksInformation(result, skipPreloadedValues)
    });
  }
  loadBlocksInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    this._clearFormSelection(5);
    const neighborhoodPkey: string | null | undefined =
      this.captureCodeOfCodeNameAndID(codeName, this.optionsNeighborhoods);
    this.territorialOrganizationService
      .getDataBlocks(neighborhoodPkey)
      .subscribe({
        next: (result: Block[]) =>
          this.captureBlocksInformation(result, skipPreloadedValues)
      });
  }

  captureDepartmentInformation(result: Department[]) {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDepartments = result;
    this.optionsDepartments = result;

    if (this.defaultData?.department) {
      const listOptions: Department[] = this.optionsDepartments.filter(
        (option: Department): boolean =>
          option.divpolLvl1Code === this.defaultData?.department
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('department')?.patchValue(listOptions[0].codeName);
        this.loadMunicipalitiesInformation(listOptions[0].codeName, false);
      }
    }
  }
  captureMunicipalityInformation(
    result: Municipality[],
    skipPreloadedValues: boolean | null
  ) {
    result = result.map((mncp: Municipality) => new Municipality(mncp));
    this.optionsMunicipalities = result;

    if (this.defaultData?.municipality && !skipPreloadedValues) {
      const listOptions: Municipality[] = this.optionsMunicipalities.filter(
        (option: Municipality): boolean =>
          option.divpolLvl2Code === this.defaultData?.municipality
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('municipality')?.patchValue(listOptions[0].codeName);
        this.loadZonesInformation(listOptions[0].codeName, false);
      }
    }
  }
  captureZoneInformation(result: Zone[], skipPreloadedValues: boolean | null) {
    result = result.map((dpto: Zone) => new Zone(dpto));
    this.optionsZones = result;

    if (this.defaultData?.zone && !skipPreloadedValues) {
      const listOptions: Zone[] = this.optionsZones.filter(
        (option: Zone): boolean => option.id === this.defaultData?.zone
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('zone')?.patchValue(listOptions[0].codeName);
        this.loadSectorsInformation(listOptions[0].codeName, false);
      }
    }
  }
  captureSectorInformation(
    result: Sector[],
    skipPreloadedValues: boolean | null
  ) {
    result = result.map((dpto: Sector) => new Sector(dpto));
    this.optionsSectors = result;

    if (this.defaultData?.sector && !skipPreloadedValues) {
      const listOptions: Sector[] = this.optionsSectors.filter(
        (option: Sector): boolean => option.id === this.defaultData?.sector
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('sector')?.patchValue(listOptions[0].codeName);
        this.loadCommunitiesInformation(listOptions[0].codeName, false);
      }
    }
  }
  captureCommunitiesInformation(
    result: Commune[],
    skipPreloadedValues: boolean | null
  ) {
    result = result.map((dpto: Commune) => new Commune(dpto));
    this.optionsCommunities = result;

    if (this.defaultData?.community && !skipPreloadedValues) {
      const listOptions: Commune[] = this.optionsCommunities.filter(
        (option: Commune): boolean => option.id === this.defaultData?.community
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('community')?.patchValue(listOptions[0].codeName);
        this.loadNeighborhoodsInformation(listOptions[0].codeName, false);
      }
    }
  }
  captureNeighborhoodsInformation(
    result: Neighborhood[],
    skipPreloadedValues: boolean | null
  ) {
    result = result.map((dpto: Neighborhood) => new Neighborhood(dpto));
    this.optionsNeighborhoods = result;

    if (this.defaultData?.neighborhood && !skipPreloadedValues) {
      const listOptions: Neighborhood[] = this.optionsNeighborhoods.filter(
        (option: Neighborhood): boolean =>
          option.id === this.defaultData?.neighborhood
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('neighborhood')?.patchValue(listOptions[0].codeName);
        this.loadBlocksInformation(listOptions[0].codeName, false);
      }
    }
  }
  captureSidewalksInformation(
    result: Sidewalk[],
    skipPreloadedValues: boolean | null
  ) {
    result = result.map((sd: Sidewalk) => new Sidewalk(sd));
    this.optionsSidewalks = result;

    if (this.defaultData?.sidewalk && !skipPreloadedValues) {
      const listOptions: Sidewalk[] = this.optionsSidewalks.filter(
        (option: Sidewalk): boolean => option.id === this.defaultData?.sidewalk
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('sidewalk')?.patchValue(listOptions[0].codeName);
      }
    }
  }
  captureBlocksInformation(
    result: Block[],
    skipPreloadedValues: boolean | null
  ) {
    result = result.map((sd: Block) => new Block(sd));
    this.optionsBlocks = result;

    if (this.defaultData?.block && !skipPreloadedValues) {
      const listOptions: Block[] = this.optionsBlocks.filter(
        (option: Block): boolean => option.id === this.defaultData?.block
      );
      if (listOptions?.length > 0) {
        this.formMunicipalSelection.get('block')?.patchValue(listOptions[0].codeName);
      }
    }
  }

  searchByBaunitIdE() {
    const baunitIdE = this.formBaunitIdE.get('baunitIdE')?.value;
    if (!baunitIdE) {
      this.snackBar.open('Ingresar número de ficha', 'Aceptar', { duration: 5000 });
      return;
    }

    this.dialogRef.close({ baunitIdE });
  }

  private _filterInformationCode(
    code: string,
    options: any[],
    keyValue: string,
    key: string
  ): string | undefined | null {
    const listOptions: any[] = options.filter(
      (option: any): boolean => option[keyValue] === code
    );
    return listOptions?.length > 0 && listOptions[0][key]
      ? listOptions[0][key]
      : null;
  }
  private captureCodeOfCodeNameAndID(
    codeName: string,
    options: any[]
  ): string | null | undefined {
    return this._filterInformationCode(
      codeName,
      options,
      NAME_CODENAME,
      CONSTANT_NAME_ID
    );
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
    list.forEach((value): void => this.formMunicipalSelection.get(value)?.patchValue(''));
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
    if (this.optionsMunicipalities?.length > 0)
      this.captureMunicipalityInformation([], null);
    this._clearListObject1();
  }
  private _clearListObject1() {
    if (this.optionsZones?.length > 0) this.captureZoneInformation([], null);
    this._clearListObject2();
  }
  private _clearListObject2() {
    if (this.optionsSectors?.length > 0)
      this.captureSectorInformation([], null);
    this._clearListObject3();
  }
  private _clearListObject3() {
    if (this.optionsCommunities?.length > 0)
      this.captureCommunitiesInformation([], null);
    this._clearListObject4();
  }
  private _clearListObject4() {
    if (this.optionsNeighborhoods?.length > 0)
      this.captureNeighborhoodsInformation([], null);
    this._clearListObject5();
  }
  private _clearListObject5() {
    if (this.optionsSidewalks?.length > 0)
      this.captureSidewalksInformation([], null);
    if (this.optionsBlocks?.length > 0) this.captureBlocksInformation([], null);
  }

  // formulario nuevo

  get dpto() {
    return this.formNpnLike.get('dpto');
  }

  get mpio() {
    return this.formNpnLike.get('mpio');
  }

  get zonas() {
    return this.formNpnLike.get('zonas');
  }

  get sectorb() {
    return this.formNpnLike.get('sector');
  }

  get comuna() {
    return this.formNpnLike.get('comuna');
  }

  get barrio() {
    return this.formNpnLike.get('barrio');
  }

  get terreno() {
    return this.formNpnLike.get('terreno');
  }

  get condicion() {
    return this.formNpnLike.get('condicion');
  }

  get edificio() {
    return this.formNpnLike.get('edificio');
  }

  get piso() {
    return this.formNpnLike.get('piso');
  }

  get unidadPredial() {
    return this.formNpnLike.get('unidadPredial');
  }

  //

  get registration() {
    return this.formRegistration.get('registration');
  }

  get number() {
    return this.formDocumentType.get('number');
  }

  get domIndividualTypeNumber() {
    return this.formDocumentType.get('domIndividualTypeNumber');
  }

  get firstName() {
    return this.formNames.get('firstName');
  }

  get middleName() {
    return this.formNames.get('middleName');
  }

  get lastName() {
    return this.formNames.get('lastName');
  }

  get otherLastName() {
    return this.formNames.get('otherLastName');
  }

  get companyName() {
    return this.formNames.get('companyName');
  }

  get textAddress() {
    return this.formAddress.get('textAddress');
  }

  get department() {
    return this.formMunicipalSelection.get('department');
  }

  get municipality() {
    return this.formMunicipalSelection.get('municipality');
  }

  get zone() {
    return this.formMunicipalSelection.get('zone');
  }

  get manVer() {
    return this.formNpnLike.get('manVer');
  }

  get sector() {
    return this.formMunicipalSelection.get('sector');
  }

  get community() {
    return this.formMunicipalSelection.get('community');
  }

  get neighborhood() {
    return this.formMunicipalSelection.get('neighborhood');
  }

  get sidewalk() {
    return this.formMunicipalSelection.get('sidewalk');
  }

  get block() {
    return this.formMunicipalSelection.get('block');
  }

  get codigoCompleto() {
    return this.formNpnComplete.get('codigoCompleto');
  }
}
