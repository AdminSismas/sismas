import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { catchError } from 'rxjs';
import { CancellationService } from '../auth/cancellation.service';
import Swal from 'sweetalert2';

const unProtectedRoutes = [
  'auth'
];

const isUnProtectedRoute = (url: string): boolean => {
  return unProtectedRoutes.some(route => url.includes(route));
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (isUnProtectedRoute(req.url)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const cancellationService = inject(CancellationService);

  const token = sessionStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!error.status || error.status > 500) throw error;

      if (error.status === 401) {
        cancellationService.cancelAll();
        authService.logout();
        throw 'Token expired';
      }

      if (error.status === 404) {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'El resultado no contiene datos',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        });

        throw error;
      }

      if (error.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error en el servidor',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#3085d6',
        });

        throw error;
      }

      try {
        error = JSON.parse(error.error);
      } catch {
        error = error.error;
      }
      const errorMessage = error ? error.message : 'Ha ocurrido un error';

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      });

      throw error;
    })
  );
};
