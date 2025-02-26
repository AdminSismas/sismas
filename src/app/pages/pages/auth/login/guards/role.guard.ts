import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const user: DecodeJwt | null = this.userService.getUser();

    if (user) {
      const requiredRoles = next.data['roles'];
      const userRole = user.role;

      if (requiredRoles.includes(userRole)) {
        return true;
      } else {

        this.router.navigate(['/access-denied']);
        return false;
      }
    } else {

      this.router.navigate(['/login']);
      return false;
    }
  }
}
