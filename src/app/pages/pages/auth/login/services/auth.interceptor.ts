import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs';

const unProtectedRoutes = [
  'auth'
]

const isUnProtectedRoute = (url: string): boolean => {
  return unProtectedRoutes.some(route => url.includes(route));
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (isUnProtectedRoute(req.url)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = sessionStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        throw 'Token expired';
      }
      throw error;
    })
  );
};
