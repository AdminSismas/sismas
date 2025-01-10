// Angular framework
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// Vex
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
// Material
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
// Custom
import { AuthService } from 'src/app/pages/pages/auth/login/services/auth.service';
import { ChangePasswordComponent } from 'src/app/apps/components/sidenav/menu/change-password/change-password.component';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'vex-sidenav-user-menu',
  templateUrl: './sidenav-user-menu.component.html',
  styleUrls: ['./sidenav-user-menu.component.scss'],
  imports: [
    RouterLink,
    // Vex
    // Material
    MatRippleModule,
    MatIconModule
    // Custom
  ],
  standalone: true
})
export class SidenavUserMenuComponent implements OnInit {
  constructor(
    private readonly popoverRef: VexPopoverRef,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);
    this.router.navigate([`${environment.auth_login}`]);
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '50%',
    });
  }

  logout() {
    this.authService.logout();
    this.close();
  }
}
