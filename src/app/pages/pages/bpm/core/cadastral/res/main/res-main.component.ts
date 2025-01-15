import { Component, Input, OnInit } from '@angular/core';
import { MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environments';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'vex-res-main',
  standalone: true,
  imports: [MatDialogTitle, CommonModule],
  templateUrl: './res-main.component.html',
  styleUrl: './res-main.component.scss'
})
export class ResMainComponent implements OnInit {
  @Input() public id = '';
  @Input() public executionId = '';
  @Input({ required: true }) public resources: string[] = [];

  basic_url = `${environment.url}:${environment.port}/${'bpmResolution'}/${'generate'}/`;
  pdfUrl: SafeUrl = '';
  constructor(private sanitizer: DomSanitizer) {}

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
    this.pdfUrl = this.urlPdfViewer();
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  urlPdfViewer(): SafeUrl {
    const urlComplete = `${this.basic_url}${this.executionId}`;
    console.log('urlComplete: ', urlComplete);
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlComplete);
  }
}
