import { Component, Input, OnInit } from '@angular/core';
import { MatDialogTitle } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environments';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'vex-res-validate',
  standalone: true,
  imports: [MatDialogTitle, CommonModule],
  templateUrl: './res-validate.component.html',
  styleUrl: './res-validate.component.scss'
})
export class ResValidateComponent implements OnInit {
  @Input() public id = '';
  @Input() public executionId = '';
  @Input({ required: true }) public resources: string[] = [];

  basic_url = `${environment.url}:${environment.port}/${'bpmResolution'}/${'preview'}/`;
  pdfUrl: SafeUrl = '';
  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id =
        this.id +
        this.getRandomInt(100000) +
        'AlfaMainComponent' +
        this.getRandomInt(10);
    } else {
      this.id =
        this.getRandomInt(10000) + 'AlfaMainComponent' + this.getRandomInt(10);
    }

    // this.pdfUrl = this.urlPdfViewer();
    this.loadPdf();
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  urlPdfViewer(): SafeUrl {
    const urlComplete = `${this.basic_url}${this.executionId}`;
    console.log('urlComplete: ', urlComplete);
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlComplete);
  }
  loadPdf() {
    const urlComplete = `${this.basic_url}${this.executionId}`;
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(urlComplete, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      },
      error: (err) => {
        console.error('Error al cargar el documento PDF:', err);
      }
    });
  }
}
