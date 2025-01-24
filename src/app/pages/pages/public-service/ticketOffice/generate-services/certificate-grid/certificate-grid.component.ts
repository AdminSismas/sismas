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

  openCertificate(id: number) {
    const certificate = this.certificates.find(ins => ins.id === id);

    if (certificate) {
       this.dialog.open(CertificateDialogComponent, {
        data: certificate,
        width: '1200px',
        height: '370px'
      });

    } else {
      console.error(`Certificado con id ${id} no encontrada.`);
    }
  }


  getCertificatesData() {

    // Lógica para obtener las pólizas
    this.certificates = [


      {
        id: 1,
        name: 'Certificado de poseer o no poseer bienes',
        price: 15000,
        icon: 'mat:insert_drive_file'
      },

      // {
      //   id: 2,
      //   name: 'Plano predial catastral',
      //   price: 32.899,
      //   icon:'mat:map'

      //  },


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
