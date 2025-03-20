import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { NAME_CODENAME, STRING_INFORMATION_NOT_FOUND } from 'src/app/apps/constants/general/constants';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import {
  TerritorialOrganizationService
} from 'src/app/apps/services/territorial-organization/territorial-organization.service';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  GeographicViewerEmbeddedComponent
} from '../../../../apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { FluidHeightDirective } from '../../../../apps/directives/fluid-height.directive';
import { Zone } from '../../../../apps/interfaces/territorial-organization/zone.model';
import { ComboboxComponent } from '../../../../apps/components/general-components/combobox/combobox.component';
import { _filterInformationCode, getRandomInt } from '../../../../apps/utils/general';
import { DIVPOLLVL2_CODE, DIVPOLLVL_CODE } from '../../../../apps/constants/general/constants';

@Component({
  selector: 'vex-general-maps',
  standalone: true,
  imports: [
    MatIconModule,
    VexBreadcrumbsComponent,
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
    CommonModule,
    GeographicViewerEmbeddedComponent,
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    FluidHeightDirective,
    ComboboxComponent
  ],
  templateUrl: './general-maps.component.html',
  styleUrl: './general-maps.component.scss'
})
export class GeneralMapsComponent implements OnInit, OnDestroy {

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
  idGeneralMap = 'GeneralMapContent';
  optionsDeparments: Department[] = [];
  optionsMunicipalities: Municipality[] = [];
  optionsZones: Zone[] = [];

  ccZonaId: string | null = null;
  titleArray: string[] = ['Datos abiertos', 'Mapas generales'];
  principalTitleMenu = 'Mapas generales';

  public form: FormGroup = this.fb.group({
    department: ['', Validators.required],
    municipality: ['', Validators.required],
    zone: ['']
  });

  private destroy$ = new Subject<void>();

  searchCtrl: UntypedFormControl = new UntypedFormControl();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private territorialOrganizationService: TerritorialOrganizationService,
  ) {
  }

  ngOnInit() {
    this.idGeneralMap = getRandomInt(10000) + 'GeneralMapViewer';
    this.loadDepartmentalInformation();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchccZoneBySelection() {
    if (this.form.invalid) {
      return;
    }
    const { municipality, zone } = this.form.value;
    this.ccZonaId = null;

    const objZone: Zone[] = this.optionsZones
      .filter(op => zone && op.codeName?.toLowerCase() === zone.toLowerCase());
    this.ccZonaId = objZone != null && objZone?.length > 0 ? objZone[0].id : null;
    if (this.ccZonaId != null && this.ccZonaId?.length > 0) {
      return;
    }

    const objMunicipality: Municipality[] = this.optionsMunicipalities
      .filter(op => municipality && op.codeName?.toLowerCase() === municipality.toLowerCase());
    this.ccZonaId = objMunicipality != null && objMunicipality?.length > 0 ? objMunicipality[0].divpolLvl2Code : null;
    if (this.ccZonaId != null && this.ccZonaId?.length > 0) {
      return;
    }
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDepartments()
      .subscribe((result: Department[]) => this.captureDepartmentInformation(result));
  }

  loadMunicipalitiesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    const dpto = _filterInformationCode(codeName, this.optionsDeparments, NAME_CODENAME, DIVPOLLVL_CODE);
    if (dpto == null || dpto?.length <= 0) {
      return;
    }

    this.territorialOrganizationService.getDataMunicipalities(dpto)
      .subscribe((result: Municipality[]) => this.captureMunicipalityInformation(result, skipPreloadedValues));
  }

  loadZonesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    const dpto = _filterInformationCode(
      codeName, this.optionsMunicipalities, NAME_CODENAME, DIVPOLLVL2_CODE
    );
    if (dpto == null || dpto?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataZones(dpto)
      .subscribe((result: Zone[]) => this.captureZoneInformation(result, skipPreloadedValues)
      );
  }

  captureDepartmentInformation(result: Department[]): void {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparments = result;
  }

  captureMunicipalityInformation(result: Municipality[], skipPreloadedValues: boolean | null) {
    // Mapear los municipios y almacenarlos
    this.optionsMunicipalities = result.map((mncp: Municipality) => new Municipality(mncp));
    // Si ya hay un municipio seleccionado y no se deben saltar los valores pre-cargados
    const selectedMunicipality = this.form.get('municipality')?.value; // Usar .value para acceder al valor
    if (selectedMunicipality && !skipPreloadedValues) {
      const listOptions: Municipality[] = this.optionsMunicipalities.filter((option: Municipality) => option.divpolLvl2Code === selectedMunicipality);
      if (listOptions?.length > 0) {
        this.form.get('municipality')?.patchValue(listOptions[0].codeName);
      }
    }
  }

  captureZoneInformation(result: Zone[], skipPreloadedValues: boolean | null) {
    this.optionsZones = result.map((zn: Zone) => new Zone(zn));
    const selectedZone = this.form.get('zone')?.value;
    if (selectedZone && !skipPreloadedValues) {
      const listOptions: Zone[] = this.optionsZones.filter((option: Zone): boolean => option.id === selectedZone);
      if (listOptions?.length > 0) {
        this.form.get('zone')?.patchValue(listOptions[0].codeName);
      }
    }
  }

}
