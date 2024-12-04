import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicFormsComponent } from 'src/app/apps/components/dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ZoneManagerComponent } from './zone-manager/zone-manager.component';

@Component({
  selector: 'vex-economic-mod-land',
  standalone: true,
  imports: [
    /* Material Modules */
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,

    /* Vex Components */
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,

    /* Custom Components */
    ZoneManagerComponent
  ],
  templateUrl: './economic-mod-land.component.html',
  styleUrl: './economic-mod-land.component.scss'
})
export class EconomicModLandComponent {

  public inputs: JSONInput[] = [

  ]

  public form: FormGroup = new FormGroup({})

  submitForm(): void {
    console.log(this.form.value)
  }
}
