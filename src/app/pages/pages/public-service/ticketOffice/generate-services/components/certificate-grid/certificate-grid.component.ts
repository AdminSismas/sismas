import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Certificate } from '../../interfaces';
import { CertificateCardComponent } from '../certificate-card/certificate-card.component';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MODAL_MEDIUM } from '@shared/constants';
import { CertificateDialogAvaluoComponent } from '../certificate-dialog-avaluo/certificate-dialog-avaluo.component';
import { ComponentType } from '@angular/cdk/portal';
import { GENERAL_SERVICES_CERTIFICATES } from 'src/app/apps/constants/public-services/ticket-office/generate-services.constants';

@Component({
  selector: 'vex-certificate-grid',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    CertificateCardComponent
  ],
  templateUrl: './certificate-grid.component.html',
  styleUrl: './certificate-grid.component.scss',
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class CertificateGridComponent implements OnInit {
  showSearchInput = false;
  searchQuery = '';
  filteredCertificates: Certificate[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.filteredCertificates = [...this.certificates];
  }

  get certificates(): Certificate[] {
    return GENERAL_SERVICES_CERTIFICATES;
  }

  toggleSearchInput() {
    this.showSearchInput = !this.showSearchInput;
    if (!this.showSearchInput) {
      this.searchQuery = '';
      this.filteredCertificates = [...this.certificates];
    }
  }

  filterCertificates() {
    const query = this.searchQuery.toLowerCase();
    this.filteredCertificates = this.certificates.filter((certificate) => {
      return (Object.keys(certificate) as (keyof Certificate)[]).some((key) => {
        const value = certificate[key];
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openCertificate( id: number, component: ComponentType<any> ) {
    const certificate = this.certificates.find((ins) => ins.id === id);

    if (!certificate) {
      console.error(`Certificado con id ${id} no encontrado.`);
      return;
    }

    let config = {
      data: {
        certificate,
        openSearch: id === 4
      },
      ...MODAL_MEDIUM
    };

    if (component === CertificateDialogAvaluoComponent ) {
      config = { ...config, width: '1200px', height: '570px' };
    }

    // Abrir el diálogo solo si 'component' está definido
    if (component) {
      this.dialog.open(component, config);
    } else {
      console.error('No se ha definido un componente de diálogo válido.');
    }
  }

  // getCertificatesData() {
  // this.policyService.getPolicies().subscribe({
  //   next: (response) => {
  //     if (response.success && response.data) {
  //       this.policies = response.data;
  //       this.filteredPolicies = [...this.policies]; // Inicializa la lista filtrada
  //     }
  //   },
  //   error: (error) => {
  //     console.error(error);
  //   }
  // });
  // }
}
