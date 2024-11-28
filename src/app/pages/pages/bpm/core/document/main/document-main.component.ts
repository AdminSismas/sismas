import { Component, Input, OnInit } from '@angular/core';
import { Error500Component } from '../../../../errors/error-500/error-500.component';
import { MatDialogTitle } from '@angular/material/dialog';
import { DocumentsTableComponent } from '../validate/documents-table/documents-table.component';
import { DocumentsMainTableComponent } from './documents-table/documents-table.component';

@Component({
  selector: 'vex-document-main',
  standalone: true,
  imports: [
    Error500Component,
    MatDialogTitle,
    DocumentsMainTableComponent
  ],
  templateUrl: './document-main.component.html',
  styleUrl: './document-main.component.scss'
})
export class DocumentMainComponent implements OnInit {
  @Input({ required: true }) public executionId: string = '';
  @Input() public id: string = '';
  constructor() {
  }

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(100000)
        + 'AlfaMainComponent' + this.getRandomInt(10);
    } else {
      this.id = this.getRandomInt(10000)
        + 'AlfaMainComponent' + this.getRandomInt(10);
    }
  }


  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
