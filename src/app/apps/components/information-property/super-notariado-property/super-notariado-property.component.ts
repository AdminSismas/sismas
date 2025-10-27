import {
  Component,
  forwardRef,
  Input,
  ViewChild,
  input,
  output
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from 'src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SnrService } from 'src/app/apps/services/snr/snr.service';
import { InfoFolio } from 'src/app/apps/interfaces/information-property/snr-folio-info';
import { InformationSourcePropertyComponent } from '../information-source-property/information-source-property.component';
import { MatDividerModule } from '@angular/material/divider';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
  styleUrl: './super-notariado-property.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SuperNotariadoPropertyComponent),
      multi: true
    }
  ]
})
export class SuperNotariadoPropertyComponent {
  @Input({ required: true }) public propertyRegistryOffice:
    | string
    | null
    | undefined = '';
  @Input({ required: true }) public propertyRegistryNumber:
    | string
    | null
    | undefined = '';
  @Input({ required: true }) public baunitId: string | null | undefined = '';
  @Input({ required: true }) public schema = '';
  @Input({ required: true }) public executionId: string | null | undefined = '';

  // Input signal
  expandedComponent = input.required<boolean>();

  // Output signal
  emitExpandedComponent = output<number>();

  public infoFolio?: InfoFolio;
  public listFolioDetails: { label: string; value: string }[] = [];

  @ViewChild(InformationSourcePropertyComponent)
  private informationSourcePropertyComponent!: InformationSourcePropertyComponent;

  constructor(private snrService: SnrService) {}

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(4);
    this.searchBasicInformationPropertyFolio();
    this.informationSourcePropertyComponent.searchBasicInformationPropertyFolio(
      this.propertyRegistryOffice as string,
      this.propertyRegistryNumber as string
    );
  }

  searchBasicInformationPropertyFolio(): void {
    if (!this.propertyRegistryNumber || !this.propertyRegistryOffice) {
      return;
    }
    this.snrService
      .getFolioByOripAndFmi(
        this.propertyRegistryOffice,
        this.propertyRegistryNumber
      )
      .subscribe({
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
    });

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
