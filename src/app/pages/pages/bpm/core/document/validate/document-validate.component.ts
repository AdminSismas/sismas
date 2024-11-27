import { Component, Input, OnInit } from '@angular/core';
import { Error500Component } from '../../../../errors/error-500/error-500.component';
import { MatDialogTitle } from '@angular/material/dialog';
import { DocumentsTableComponent } from './documents-table/documents-table.component';
import { DocumentTableComponent } from 'src/app/apps/components/bpm/document-table/document-table.component';

@Component({
  selector: 'vex-document-validate',
  standalone: true,
  imports: [
    Error500Component,
    MatDialogTitle,
    DocumentsTableComponent
  
    
  ],
  templateUrl: './document-validate.component.html',
  styleUrl: './document-validate.component.scss'
})
export class DocumentValidateComponent implements OnInit {
  @Input({ required: true }) public executionId: string = '';
  @Input() public id: string = '';
  constructor() {
  }

  ngOnInit() {

    console.log(this.executionId);
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
