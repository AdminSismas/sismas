import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-header-cadastral-information-property',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms,
  ],
  imports: [
    MatIconModule,
    NgIf
  ],
  templateUrl: './header-cadastral-information-property.component.html',
  styleUrl: './header-cadastral-information-property.component.scss'
})
export class HeaderCadastralInformationPropertyComponent implements OnInit{

  @Input() public idheaderCadastral: string = '';
  @Input() public cssClasses?: string;
  @Input() public label: string = '';
  @Input() public icon: string = '';

  constructor() { }

  ngOnInit(): void {
    if (this.idheaderCadastral?.length>0) {
      this.idheaderCadastral = this.idheaderCadastral + this.getRandomInt(10000);
    } else {
      this.idheaderCadastral = this.getRandomInt(10000) + this.label?.trim();
    }
  }


  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
