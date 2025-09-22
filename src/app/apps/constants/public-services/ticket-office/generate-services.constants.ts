
import { CertificateDialogAvaluoComponent } from 'src/app/pages/pages/public-service/ticketOffice/generate-services/components/certificate-dialog-avaluo/certificate-dialog-avaluo.component';
import { CertificateDialogComponent } from 'src/app/pages/pages/public-service/ticketOffice/generate-services/components/certificate-dialog/certificate-dialog.component';
import { Certificate } from 'src/app/pages/pages/public-service/ticketOffice/generate-services/interfaces';

export const GENERAL_SERVICES_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    name: 'Certificado de poseer o no poseer bienes',
    price: 15000,
    icon: 'mat:insert_drive_file',
    type: 'CERT_POSEER_BIEN_TAQUILLA',
    component: CertificateDialogComponent
  },

  {
    id: 2,
    name: 'Certificado de ficha de avalúo',
    price: 55000,
    icon: 'mat:monetization_on',
    type: 'CERT_FICHA_AVALUO',
    component: CertificateDialogAvaluoComponent
  },
  {
    id: 3,
    name: 'Certificado plano predial catastral',
    price: 39000,
    icon: 'mat:map',
    type: 'CERT_PLANO_PREDIAL_CATASTRAL',
    component: CertificateDialogAvaluoComponent
  },
  {
    id: 4,
    name: 'Certificado catastral para instituciones públicas',
    price: 0,
    icon: 'mat:gavel',
    type: 'CERT_INST_PUBL',
    component: CertificateDialogAvaluoComponent
  }
];
