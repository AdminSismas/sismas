import { Component, Input, OnInit } from '@angular/core';
import { Error500Component } from '../../../../../errors/error-500/error-500.component';
import { MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environments';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'vex-res-main',
  standalone: true,
  imports: [
    Error500Component,
    MatDialogTitle,
    CommonModule
  ],
  templateUrl: './res-main.component.html',
  styleUrl: './res-main.component.scss'
})
export class ResMainComponent implements OnInit {
  @Input() public id = '';
  @Input() public executionId = '';
  basic_url = `${environment.url}:${environment.port}/${'bpmResolution'}/${'generate'}/`;
  pdfUrl: SafeUrl = '';
  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(100000)
        + 'AlfaMainComponent' + this.getRandomInt(10);
    } else {
      this.id = this.getRandomInt(10000)
        + 'AlfaMainComponent' + this.getRandomInt(10);
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
