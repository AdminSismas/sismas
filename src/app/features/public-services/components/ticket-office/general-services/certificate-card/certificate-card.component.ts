import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Certificate } from '../../../../interfaces/ticket-office/general-services';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';

@Component({
  selector: 'vex-certificate-card',
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    NgClass,
    CurrencyFormatPipe
  ],
  templateUrl: './certificate-card.component.html',
  styleUrl: './certificate-card.component.scss'
})
export class CertificateCardComponent {
  @Input({ required: true }) certificate!: Certificate;
  @Output() openCertificate = new EventEmitter<Certificate['id']>();


}
