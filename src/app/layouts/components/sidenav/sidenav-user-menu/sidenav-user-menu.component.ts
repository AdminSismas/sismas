import { Component, OnInit } from '@angular/core';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { MatRippleModule } from '@angular/material/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../../environments/environments';
import { AuthService } from 'src/app/pages/pages/auth/login/services/auth.service';

@Component({
  selector: 'vex-sidenav-user-menu',
  templateUrl: './sidenav-user-menu.component.html',
  styleUrls: ['./sidenav-user-menu.component.scss'],
  imports: [MatRippleModule, RouterLink, MatIconModule],
  standalone: true
})
export class SidenavUserMenuComponent implements OnInit {
  constructor(
    private readonly popoverRef: VexPopoverRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);
    this.router.navigate([`${environment.auth_login}`]);
  }


  logout() {
    this.authService.logout();
    this.close();
  }

}
