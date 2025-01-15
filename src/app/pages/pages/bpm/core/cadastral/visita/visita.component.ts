import { Component, Input, OnInit } from '@angular/core';
import { Error500Component } from '../../../../errors/error-500/error-500.component';
import { MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'vex-visita',
  standalone: true,
  imports: [
    Error500Component,
    MatDialogTitle
  ],
  templateUrl: './visita.component.html',
  styleUrl: './visita.component.scss'
})
export class VisitaComponent  implements OnInit {
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
