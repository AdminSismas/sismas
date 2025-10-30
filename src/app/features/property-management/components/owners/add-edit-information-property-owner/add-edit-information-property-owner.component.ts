import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { InputComponent } from '@shared/ui/input/input.component';
@Component({
  selector: 'vex-add-edit-information-property-owner',
  standalone: true,
  templateUrl: './add-edit-information-property-owner.component.html',
  styleUrl: './add-edit-information-property-owner.component.scss',
  imports: [
    ReactiveFormsModule,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    InputComponent,
    MatIconModule,
    MatButtonModule,
  ]
})
export class AddEditInformationPropertyOwnerComponent {
  informationPropertyForm!: FormGroup;

  private fBuilder = inject(FormBuilder);
  constructor() {
    this.initForm();
  }

  /**
   * Init form
   */
  private initForm(): void {
    this.informationPropertyForm = this.fBuilder.group({});
  }
}
