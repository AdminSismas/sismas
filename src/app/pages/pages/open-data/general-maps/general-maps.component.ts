import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { InputComponent } from 'src/app/apps/components/input/input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { LIMPIAR_CAMPOS_MULTIPLES_CAMPOS, LIMPIAR_CAMPOS_SELECCION_MUNICIPAL, LIST_FORM_CADASTRAL_0, LIST_FORM_CADASTRAL_1, LIST_FORM_CADASTRAL_2, LIST_FORM_CADASTRAL_3, LIST_FORM_CADASTRAL_4, LIST_FORM_CADASTRAL_5, NAME_CODENAME, STRING_INFORMATION_NOT_FOUND } from 'src/app/apps/constants/constant';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { SearchData } from 'src/app/apps/interfaces/search-data.model';
import { FilterCadastralSearchComponent } from 'src/app/apps/components/table-cadastral-search/filter-cadastral-search/filter-cadastral-search.component';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { TerritorialOrganizationService } from 'src/app/apps/services/territorial-organization/territorial-organization.service';
import { Observable, Subject, map, startWith } from 'rxjs';
import { CONSTANT_NAME_ID } from 'src/app/apps/constants/constantLabels';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GeographicViewerComponent } from 'src/app/apps/components/geographic-viewer/geographic-viewer.component';
import { ContentInfoSchema } from 'src/app/apps/interfaces/content-info-schema';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { environment } from 'src/environments/environments';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'vex-general-maps',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    AsyncPipe,
    ComboxColletionComponent,
    InputComponent,
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
    VexPageLayoutContentDirective,
    CommonModule
],
  templateUrl: './general-maps.component.html',
  styleUrl: './general-maps.component.scss'
})
export class GeneralMapsComponent implements OnInit {

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
  protected readonly LIMPIAR_CAMPOS_SELECCION_MUNICIPAL = LIMPIAR_CAMPOS_SELECCION_MUNICIPAL;
  protected readonly LIMPIAR_CAMPOS_MULTIPLES_CAMPOS = LIMPIAR_CAMPOS_MULTIPLES_CAMPOS;


  optionsDeparments: Department[] = [];
  optionsMunicipalities: Municipality[] = [];

  public form: FormGroup = this.fb.group({
    department: ['', Validators.required],
    municipality: ['', Validators.required]
  });

  filteredOptionsDepartments$: Observable<Department[]> | undefined;
  filteredOptionsMunicipalities$: Observable<Municipality[]> | undefined;

  private destroy$ = new Subject<void>();

  searchCtrl: UntypedFormControl = new UntypedFormControl();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);


  public divpolLv1 = '';
  public divpolLv2 = '';

  mapUrl: string | null = null; 
  showMap = false;

  constructor(

 
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private territorialOrganizationService: TerritorialOrganizationService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.loadDepartmentalInformation();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => console.log(value));
  }

  

  // public clearFormFields(value:any){
  //   console.log('value',value?.tab?.textLabel )

  //   if(value?.tab?.textLabel === 'Seleccion Municipal'){
  //     this.clearMultipleFields()
  //   }

  //   if(value?.tab?.textLabel === 'Multiplex Campos'){
  //     this.clearMunicipalSelection()
  //   }
  // }

  public clearMunicipalSelection(){
    this.department?.reset();
    this.municipality?.reset();
 

  }





  openSnackbar(msg: string, action: string, position: MatSnackBarHorizontalPosition) {
    this.snackBar.open(
      msg, action, { duration: 3000, horizontalPosition: position }
    );
  }

  searchMunicipalSelection() {
    if (this.form.invalid) return;

    const { department, municipality } = this.form.value;
    const divpolLv1 = department.slice(0, 2);
    const divpolLv2 = municipality.slice(0, 3);

    this.showMap = true;

    // // Aquí generamos la URL completa para el mapa
    // const mapUrl = this.generateMapUrl(divpolLv1, divpolLv2);
    // this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl).toString();
  }


  generateMapUrl(departmentCode: string, municipalityCode: string): string {
    const baseUrl = '${envi.url_viewer}${envi.post_path_viewer}';
    return `${baseUrl}?department=${departmentCode}&municipality=${municipalityCode}`;
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

    const dpto = this._filterInformationCode(
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


  captureDepartmentInformation(result: Department[]): void {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparments = result;

    this.filteredOptionsDepartments$ = this.form.get('department')?.valueChanges.pipe(
      startWith(''),
      map((value): any[] => this.optionsDeparments.filter(
        (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
      ));
  }

captureMunicipalityInformation(result: Municipality[], skipPreloadedValues: boolean | null) {
  // Mapear los municipios y almacenarlos
  this.optionsMunicipalities = result.map((mncp: Municipality) => new Municipality(mncp));

  // Si ya hay un municipio seleccionado y no se deben saltar los valores pre-cargados
  const selectedMunicipality = this.form.get('municipality')?.value; // Usar .value para acceder al valor
  if (selectedMunicipality && !skipPreloadedValues) {
    const listOptions: Municipality[] = this.optionsMunicipalities.filter(
      (option: Municipality) => option.divpolLvl2Code === selectedMunicipality
    );
    if (listOptions?.length > 0) {
      this.form.get('municipality')?.patchValue(listOptions[0].codeName);
    }
  }

  // Filtrar las opciones de municipio para el autocompletado
  this.filteredOptionsMunicipalities$ = this.form.get('municipality')?.valueChanges.pipe(
    startWith(''),
    map((value: string) =>
      this.optionsMunicipalities.filter(
        (option: Municipality) => option.codeName?.toLowerCase().includes(value.toLowerCase() || '')
      )
    )
  );
}
 


private _filterInformationCode(code: string, options: any[], keyValue: string, key: string): string | undefined | null {
  const listOptions: any[] = options
    .filter((option: any): boolean => option[keyValue] === code);
  return listOptions?.length > 0 && listOptions[0][key] ? listOptions[0][key] : null;
}


  get department(){
    return this.form.get('department');
  }

  get municipality(){
    return this.form.get('municipality');
  }




}
