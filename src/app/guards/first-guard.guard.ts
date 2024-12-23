import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/pages/auth/login/services/auth.service';
import { inject } from '@angular/core';

export const firstGuardGuard: CanActivateFn = (route, state) => {
  console.log('Ruta guardia', route);
  console.log('Estado guardia', state);

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
  }

  return true;
};
