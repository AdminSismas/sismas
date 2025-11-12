import { Component, OnInit, input } from '@angular/core';
import { MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { environment } from '@environments/environments';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-res-main',
  standalone: true,
  imports: [MatDialogTitle, CommonModule],
  templateUrl: './res-main.component.html',
  styleUrl: './res-main.component.scss'
})
export class ResMainComponent implements OnInit {
  public readonly executionId = input('');
  public readonly resources = input.required<string[]>();
  public readonly mode = input<number>();

  basic_url = `${environment.url}:${environment.port}/${'bpmResolution'}/${'generate'}/`;
  pdfUrl: SafeUrl = '';
  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadPdf();
  }

  loadPdf() {
      const urlComplete = `${this.basic_url}${this.executionId()}`;
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get(urlComplete, { headers, responseType: 'blob' }).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        },
        error: async (blobError) => {
          const error = await blobError.text();
          const jsonError = JSON.parse(error);
          Swal.fire({
            icon: 'error',
            text: jsonError.message,
            timer: 30000,
            showConfirmButton: false
          });
          this.pdfUrl = 'error';
        }
      });
    }


}
