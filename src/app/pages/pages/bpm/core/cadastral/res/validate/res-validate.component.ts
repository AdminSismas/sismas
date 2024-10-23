import { Component, Input, OnInit } from '@angular/core';
import { Error500Component } from '../../../../../errors/error-500/error-500.component';
import { MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'vex-res-validate',
  standalone: true,
  imports: [
    Error500Component,
    MatDialogTitle
  ],
  templateUrl: './res-validate.component.html',
  styleUrl: './res-validate.component.scss'
})
export class ResValidateComponent implements OnInit {
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
