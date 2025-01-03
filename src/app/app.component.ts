import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'geoGestion';

  ngOnInit(): void {
    if (window.name !== 'geogestion') {
      window.name = 'geogestion';
    }
  }
}
