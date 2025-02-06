import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SnrService } from 'src/app/apps/services/snr/snr.service';
import { InfoFolio } from 'src/app/apps/interfaces/information-property/snr-folio-info';
import { InformationSourcePropertyComponent } from '../information-source-property/information-source-property.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'super-notariado-property',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    // Custom
    HeaderCadastralInformationPropertyComponent,
    InformationSourcePropertyComponent
  ],
  templateUrl: './super-notariado-property.component.html',
  styleUrl: './super-notariado-property.component.scss'
})
export class SuperNotariadoPropertyComponent {

  @Input({ required: true }) public id = '';
  @Input({ required: true }) public propertyRegistryOffice: string | null | undefined = '';
  @Input({ required: true }) public propertyRegistryNumber: string | null | undefined = '';
  @Input({ required: true }) public baunitId: string | null | undefined = '';
  @Input({ required: true }) public schema: string = '';
  @Input({ required: true }) public executionId: string | null | undefined = '';

  public expandedComponent = false;
  public infoFolio?: InfoFolio;
  public listFolioDetails: { label: string; value: string }[] = [];

  @ViewChild(InformationSourcePropertyComponent) private informationSourcePropertyComponent!: InformationSourcePropertyComponent;

  constructor(
    private snrService: SnrService,
  ) { }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchBasicInformationPropertyFolio();
      this.informationSourcePropertyComponent.searchBasicInformationPropertyFolio(this.propertyRegistryOffice as string, this.propertyRegistryNumber as string);
    }
  }

  searchBasicInformationPropertyFolio(): void {
    if (!this.propertyRegistryNumber || !this.propertyRegistryOffice) {
      return;
    }
    this.snrService.getFolioByOripAndFmi(this.propertyRegistryOffice, this.propertyRegistryNumber).subscribe({
      next: (response) => {
        this.infoFolio = new InfoFolio(response);
        this.getFolioDetailsList();
      },
      error: (error) => {
        throw error;
      }
    });
  }

  getFolioDetailsList(): void {
    const list: { label: string; value: string }[] = [];

    Object.keys(this.infoFolio as InfoFolio).forEach((key) => {
      const value = this.infoFolio![key as keyof InfoFolio];
      list.push({ label: this.formatLabels(key), value: value });
    })

    this.listFolioDetails = list;
  }

  formatLabels(labels: string): string {
    switch (labels) {
      case 'matriculaMatriz':
        return 'Matricula matriz';
      case 'matriculaSegregados':
        return 'Matricula segregados';
      case 'zona':
        return 'Zona';
      case 'direccion':
        return 'Dirección';
      case 'fechaApertura':
        return 'Fecha de apertura';
      case 'estado':
        return 'Estado';
      default:
        return '';
    }
  }
}
