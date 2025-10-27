import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ComboboxComponent } from '../../../../apps/components/general-components/combobox/combobox.component';
import { FluidHeightDirective } from '../../../../apps/directives/fluid-height.directive';
import { GeographicViewerEmbeddedComponent } from '../../../../apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';
import { MatButton } from '@angular/material/button';
import { MatDialogActions } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { Department } from '@shared/interfaces';
import { Municipality } from '@shared/interfaces';
import { Subject } from 'rxjs';
import {
  TerritorialOrganizationService
} from '@shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIVPOLLVL_CODE, NAME_CODENAME } from '../../../../apps/constants/general/constants';
import { _filterInformationCode, getRandomInt } from 'src/app/apps/utils/general';

@Component({
  selector: 'vex-map',
  standalone: true,
  imports: [
    ComboboxComponent,
    FluidHeightDirective,
    GeographicViewerEmbeddedComponent,
    MatButton,
    MatDialogActions,
    ReactiveFormsModule,
    VexBreadcrumbsComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, OnDestroy {
  titleArray: string[] = ['Mapa'];
  principalTitleMenu = 'Mapa temáticos';
  idGeneralMap = 'ThematicGeneralMapContent';
  optionsDeparments: Department[] = [];
  optionsMunicipalities: Municipality[] = [];
  valueCodeMunicipality: string | null = null;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  form: FormGroup = this.fb.group({
    department: ['', Validators.required],
    municipality: ['', Validators.required]
  });

  private destroy$ = new Subject<void>();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private territorialOrganizationService: TerritorialOrganizationService
  ) {
  }

  ngOnInit() {
    this.idGeneralMap = getRandomInt(10000) + 'mapThematicMaps' + getRandomInt(82);
    this.loadDepartmentalInformation();
    this.searchCtrl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchMunicipalityBySelection() {
    if (this.form.invalid) {
      return;
    }
    const { municipality } = this.form.value;
    const objMunicipality: Municipality[] = this.optionsMunicipalities.filter(op => municipality && op.codeName?.toLowerCase() === municipality.toLowerCase());
    this.valueCodeMunicipality = objMunicipality != null && objMunicipality?.length > 0 ? objMunicipality[0].divpolLvl2Code : null;
    if (this.valueCodeMunicipality != null && this.valueCodeMunicipality?.length > 0) {
      return;
    }
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDepartments().subscribe(
      (result: Department[]) => this.captureDepartmentInformation(result)
    );
  }

  loadMunicipalitiesInformation(codeName: string, skipPreloadedValues: boolean | null) {
    if (codeName?.length <= 0) {
      return;
    }
    const dpto = _filterInformationCode(codeName, this.optionsDeparments, NAME_CODENAME, DIVPOLLVL_CODE);
    if (dpto == null || dpto?.length <= 0) {
      return;
    }
    this.territorialOrganizationService.getDataMunicipalities(dpto).subscribe(
      (result: Municipality[]) => this.captureMunicipalityInformation(result, skipPreloadedValues)
    );
  }

  captureDepartmentInformation(result: Department[]): void {
    result = result.map((dpto: Department) => new Department(dpto));
    this.optionsDeparments = result;
  }

  captureMunicipalityInformation(result: Municipality[], skipPreloadedValues: boolean | null) {
    this.optionsMunicipalities = result.map((mncp: Municipality) => new Municipality(mncp));
    const selectedMunicipality = this.form.get('municipality')?.value;
    if (selectedMunicipality && !skipPreloadedValues) {
      const listOptions: Municipality[] = this.optionsMunicipalities.filter((option: Municipality) => option.divpolLvl2Code === selectedMunicipality);
      if (listOptions?.length > 0) {
        this.form.get('municipality')?.patchValue(listOptions[0].codeName);
      }
    }
  }
}
