// Angular framework
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// Vex
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
// Material
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
// Custom
import { AuthService } from '@core/auth/auth.service';
import { ChangePasswordComponent } from 'src/app/layouts/components/sidenav/change-password/change-password.component';
import { environment } from '@environments/environments';
import { NavigationLoaderService } from 'src/app/core/navigation/navigation-loader.service';

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
export class SidenavUserMenuComponent {
  constructor(
    private readonly popoverRef: VexPopoverRef,
    private router: Router,
    private authService: AuthService,
    private navigationLoaderService: NavigationLoaderService,
    private dialog: MatDialog
  ) {}

  close(): void {
    /** Wait for animation to complete and then close */
    setTimeout(() => this.popoverRef.close(), 250);
    this.router.navigate([`${environment.auth.value}${environment.auth.login}`]);
  }

  openChangePasswordDialog(): void {
    this.popoverRef.close();
    this.dialog.open(ChangePasswordComponent, {
      width: '40%',
    });
  }

  logout() {
    this.navigationLoaderService.stopCountLoop();
    this.authService.logout();
    this.close();
  }
}
