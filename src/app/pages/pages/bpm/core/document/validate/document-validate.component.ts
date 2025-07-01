import { Component, Input, OnInit } from '@angular/core';
import { MatDialogTitle } from '@angular/material/dialog';
import { DocumentsTableComponent } from './documents-table/documents-table.component';

@Component({
  selector: 'vex-document-validate',
  standalone: true,
  imports: [MatDialogTitle, DocumentsTableComponent],
  templateUrl: './document-validate.component.html',
  styleUrl: './document-validate.component.scss'
})
export class DocumentValidateComponent implements OnInit {
  @Input({ required: true }) public executionId = '';
  @Input() public id = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input() public mode = '';

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
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
