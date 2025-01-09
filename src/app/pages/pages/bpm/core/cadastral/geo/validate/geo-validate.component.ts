import { Component, Input, OnInit } from '@angular/core';
import { Error500Component } from '../../../../../errors/error-500/error-500.component';
import { MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'vex-geo-validate',
  standalone: true,
  imports: [
    Error500Component,
    MatDialogTitle
  ],
  templateUrl: './geo-validate.component.html',
  styleUrl: './geo-validate.component.scss'
})
export class GeoValidateComponent implements OnInit {
  @Input() public id = '';
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
