import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const user = this.userService.getUser();

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