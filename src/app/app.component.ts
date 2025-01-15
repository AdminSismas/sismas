import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleService } from './apps/services/tittle.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  constructor(private titleService: TitleService) {}


  ngOnInit(): void {
    this.titleService.setTitle();
  }
}
