import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './pages/pages/auth/login/services/auth.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class  AppComponent {
  title = 'geoGestion';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

    if (this.authService.isAuthenticated()) {

      this.router.navigate([`${environment.myWork_cadastralSearch}`]);
    } else {
 
      this.router.navigate(['/auth/login']);
    }
  }
}
