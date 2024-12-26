import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { AuthService } from './pages/pages/auth/login/services/auth.service'

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'geoGestion'


}
