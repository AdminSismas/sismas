import { Component, Input, OnInit } from '@angular/core';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';

@Component({
  selector: 'vex-syn-main',
  standalone: true,
  imports: [
    // Vex
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    // Material
    // Custom
  ],
  templateUrl: './syn-main.component.html',
  styleUrl: './syn-main.component.scss'
})
export class SynMainComponent implements OnInit {
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
