import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DynamicFormsComponent } from 'src/app/apps/components/dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { Department } from 'src/app/apps/interfaces/territorial-organization/department.model';
import { Municipality } from 'src/app/apps/interfaces/territorial-organization/municipality.model';
import { TerritorialOrganizationService } from 'src/app/apps/services/territorial-organization/territorial-organization.service';

@Component({
  selector: 'physical-zone',
  standalone: true,
  imports: [
    /* Material Modules */
    /* Vex Components */
    /* Custom Components */
    DynamicFormsComponent
  ],
  templateUrl: './physical-zone.component.html',
  styles: ``
})
export class PhysicalZoneComponent  implements OnInit {

  public filteredOptionsDepartments$: Observable<Department[]> | undefined;
  public filteredOptionsMunicipalities$: Observable<Municipality[]> | undefined;

  public optionsDeparments?: Department[];

  public inputs: JSONInput[] = [
    {
      name: 'divpolLv1',
      validators: [],
      type: 'text',
      label: 'Departamento',
      placeholder: 'Seleccione un departamento',
      element: 'autocomplete',
      autocompleteOptions: []
    }
  ]

  constructor (
    private territorialOrganizationService: TerritorialOrganizationService
  ) {}

  ngOnInit(): void {
    this.loadDepartmentalInformation()
  }

  loadDepartmentalInformation() {
    this.territorialOrganizationService.getDataDeparments()
      .subscribe({
          next: (result: Department[]) => this.optionsDeparments = result
        }
      );
  }

}
