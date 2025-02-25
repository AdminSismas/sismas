import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-in-construction',
  templateUrl: './in-construction.component.html',
  styleUrls: ['./in-construction.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class InConstructionComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
