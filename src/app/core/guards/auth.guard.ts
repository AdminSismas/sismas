import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth';
import { UserService } from '@shared/services';
import { DecodeJwt } from '@shared/models';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userService = inject(UserService);

  if (authService.isAuthenticated()) {
    userService.setUser(authService.getDecodedToken() as DecodeJwt);
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
