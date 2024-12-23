import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/pages/auth/login/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated()) {
    console.log('Ruta guardia', route);
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
