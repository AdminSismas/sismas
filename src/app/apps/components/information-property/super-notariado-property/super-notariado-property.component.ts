import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SnrService } from 'src/app/apps/services/snr/snr.service';

@Component({
  selector: 'super-notariado-property',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatExpansionModule,
    MatGridListModule,
    // Custom
    HeaderCadastralInformationPropertyComponent
  ],
  templateUrl: './super-notariado-property.component.html',
  styles: ``
})
export class SuperNotariadoPropertyComponent {

  @Input({ required: true }) public id = '';
  @Input({ required: true }) public propertyRegistryOffice: string | null | undefined = '';
  @Input({ required: true }) public propertyRegistryNumber: string | null | undefined = '';

  public expandedComponent = false;

  constructor(
    private snrService: SnrService,
  ) { }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchBasicInformationPropertyFolio();
    }
  }

  searchBasicInformationPropertyFolio(): void {
    if (!this.propertyRegistryNumber || !this.propertyRegistryOffice) {
      return;
    }
    this.snrService.getPersonByOripAndFmi(this.propertyRegistryNumber, this.propertyRegistryOffice).subscribe({
      next: (response) => {
        console.log('Super Notariado:', response);
      },
      error: (error) => {
        console.error('Error al obtener la información de fuente:', error);
      }
    });
  }
}
