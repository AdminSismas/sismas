import { Component, Input, OnInit } from '@angular/core';
import { MatDialogTitle } from '@angular/material/dialog';
import { DocumentsMainTableComponent } from './documents-table/documents-table.component';

@Component({
  selector: 'vex-document-main',
  standalone: true,
  imports: [
    MatDialogTitle,
    DocumentsMainTableComponent
  ],
  templateUrl: './document-main.component.html',
  styleUrl: './document-main.component.scss'
})
export class DocumentMainComponent implements OnInit {
  @Input({ required: true }) public executionId = '';
  @Input() public id = '';
  @Input({ required: true }) public resources: string[] = [];

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
