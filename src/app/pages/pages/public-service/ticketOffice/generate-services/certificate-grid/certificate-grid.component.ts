import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Certificate } from '../interfaces/certificate.interface';
import { CertificateCardComponent } from '../certificate-card/certificate-card.component';
import { CertificateDialogComponent } from '../certificate-dialog/certificate-dialog.component';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MODAL_MEDIUM } from 'src/app/apps/constants/constant';
import { CertificateDialogAvaluoComponent } from '../certificate-dialog-avaluo/certificate-dialog-avaluo.component';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'vex-certificate-grid',
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    NgFor,
    RouterLinkActive,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    NgIf,
    AsyncPipe,
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
export class CertificateGridComponent {
  showSearchInput: boolean = false;
  searchQuery: string = '';
  trackById = this.trackByIdCertificate;
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];

  constructor(
    private dialog: MatDialog,


  ) {}

  ngOnInit() {
    this.getCertificatesData();

  }

  trackByIdCertificate(index: number, certificate: Certificate): number {
    return certificate.id;
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
    this.filteredCertificates = this.certificates.filter(certificate => {
      return (Object.keys(certificate) as (keyof Certificate)[]).some(key => {
        const value = certificate[key];
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  }

  createCertificate() {

  }

  openCertificate(id: number, type: 'standard' | 'avaluo') {
    const certificate = this.certificates.find(ins => ins.id === id);
  
    if (!certificate) {
      console.error(`Certificado con id ${id} no encontrado.`);
      return;
    }
  
    // Inicializar con un componente por defecto
    let component: ComponentType<any> = CertificateDialogComponent; // Componente por defecto
  
    let config = {
      data: certificate,
      ...MODAL_MEDIUM
    };
  
    if (type === 'standard') {
      component = CertificateDialogComponent;
    } else if (type === 'avaluo') {
      component = CertificateDialogAvaluoComponent;
      config = { ...config, width: '1200px', height: '570px' };
    }
  
    // Abrir el diálogo solo si 'component' está definido
    if (component) {
      this.dialog.open(component, config);
    } else {
      console.error('No se ha definido un componente de diálogo válido.');
    }
  }
  
  getCertificatesData() {

    // Lógica para obtener las pólizas
    this.certificates = [


      {
        id: 1,
        name: 'Certificado de poseer o no poseer bienes',
        price: 15000,
        icon: 'mat:insert_drive_file',
        type: 'CERT_POSEER_BIEN_TAQUILLA'
      },

      {
        id: 2,
        name: 'Certificado de ficha de avalúo',
        price: 55000,
        icon:'mat:monetization_on',
        type: 'CERT_FICHA_AVALUO'

       },
       {
        id: 3,
        name: 'Certificado plano predial catastral',
        price: 39000,
        icon:'mat:map',
        type: 'CERT_PLANO_PREDIAL_CATASTRAL'

       },


    ];

    this.filteredCertificates = [...this.certificates];

  }





  // getCertificatesData() {
    // this.policyService.getPolicies().subscribe({
    //   next: (response) => {
    //     if (response.success && response.data) {
    //       this.policies = response.data;
    //       this.filteredPolicies = [...this.policies]; // Inicializa la lista filtrada
    //       console.log('Pólizas cargadas:', this.policies);
    //     }
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   }
    // });
  // }


}
