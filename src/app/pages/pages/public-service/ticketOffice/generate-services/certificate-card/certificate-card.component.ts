import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Certificate } from '../interfaces/certificate.interface';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { CurrencyFormatPipe } from 'src/app/apps/pipes/currencyFormat.pipe';

@Component({
  selector: 'vex-certificate-card',
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule, 
    MatButtonModule, 
    NgIf, 
    CommonModule,
    CurrencyFormatPipe
  ],
  templateUrl: './certificate-card.component.html',
  styleUrl: './certificate-card.component.scss'
})
export class CertificateCardComponent {
  @Input({ required: true }) certificate!: Certificate;
  @Output() openCertificate = new EventEmitter<Certificate['id']>();


  ngOnInit() {}


}
