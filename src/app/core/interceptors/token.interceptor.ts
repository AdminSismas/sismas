import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.authService.token;
    const authReq = request.clone({
      headers: request.headers.set('Access-Control-Allow-Origin', '*')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + token),
    });
    return next.handle(authReq);
  }
}
