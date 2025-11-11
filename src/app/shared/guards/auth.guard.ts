import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@shared/services/auth/user.service';
import { DecodeJwt } from '@features/configuration/interfaces/users/user-details.model';

export const authGuard: CanActivateFn = () => {
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
