import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '@core/auth';
import { DecodeJwt } from '@shared/models';

export const RoleGuard: CanActivateFn = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user: DecodeJwt | null = userService.getUser();

    if (user) {
      const requiredRoles = route.data[route.data['parameter']];
      const userRole = user.role;

      if (requiredRoles.includes(userRole)) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    } else {
      router.navigate(['/login']);
      return false;
    }
};
