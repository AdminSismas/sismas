import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../../../pages/pages/auth/login/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SendGeneralRequestsService {

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  loadParamsMethodGet() {
    const token = this.authService.token;
    return {
      //method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  }

  loadParamsMethodGetTex() {
    const token = this.authService.token;
    return {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/text',
        'Authorization': `Bearer ${token}`
      }
    };
  }

  loadMethodGetBody(obj: any) {
    const token = this.authService.token;
    const myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin', '*');
    myHeaders.append('Content-Type', 'application/json');

    return {
      method: 'GET',
      body: JSON.stringify(obj),
      headers: myHeaders,
      redirect: 'follow'
    };
  }

  loadMethodDeleteBody(obj: any) {
    const token = this.authService.token;
    const myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin', '*');
    return {
      method: 'DELETE',
      body: obj,
      headers: myHeaders,
      redirect: 'follow'
    };
  }

  loadParamsMethodPostFormData(obj: any) {
    const token = this.authService.token;
    const myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin', '*');
    return {
      method: 'POST',
      body: obj,
      headers: myHeaders,
      redirect: 'follow'
    };
  }

  loadParamsMethodPost(obj: any) {
    let params = null;
    const token = this.authService.token;
    if (obj == null) {
      params = {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
    } else {
      params = {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
    }
    return params;
  }

  loadParamsMethodPostAll(obj: any) {
    const token = this.authService.token;
    return {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
  }

  sendRequestsFetchGet(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  sendRequestsGetText(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' });
  }

  async sendRequestsFetchGetAsync(url: string) {
    return this.http.get<any>(url);
  }

  sendRequestsGetOption(url: string, options: any): Observable<any> {
    return this.http.get<any>(url, options)
      .pipe(
        catchError((e) => {
          if (e.status == 401) {
            this.router.navigate([`${environment.auth_login}`]).then(r => {
            });
          }
          return throwError(() => e);
        })
      );
  }

  sendRequestsFetch(url: string, params: any): Promise<any> {
    return fetch(url, params)
      .then(result => result.json())
      .catch(error => (error));
  }

  sendRequestsFetchText(url: string, params: any): Promise<any> {
    return fetch(url, params)
      .then(result => result.text())
      .catch(error => (error));
  }

  sendPost(url: any): Observable<any> {
    return this.http.post(url, null);
  }

  sendPostText(url: any): Observable<string> {
    return this.http.post(url, null, {
      headers: new HttpHeaders({
        'Accept': 'text/html, application/xhtml+xml, */*',
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: 'text' as 'text'
    });
  }

  sendRequestsFetchPost(url: string): Observable<any> {
    return this.http.post<any>(url, '');
  }

  sendDeleteFetch(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  sendDeleteParams(url: string, params:any): Observable<any> {
    return this.http.delete<any>(url, params);
  }

  sendRequestsFetchGetBody(url: any, body: any): Observable<any> {
    return this.http.get<any>(url, body);
  }

  sendRequestsFetchPostBody(url: any, body: any): Observable<any> {
    return this.http.post<any>(url, body);
  }

  sendRequestsFetchPostBodyParams(url: any, body: any, params:any): Observable<any> {
    return this.http.post<any>(url, body, params);
  }

  sendRequestsUpdatePutBody(url: any, body: any): Observable<any> {
    return this.http.put<any>(url, body);
  }

  sendRequestsUpdatePutBodyParams(url: any, body: any, params:any): Observable<any> {
    return this.http.put<any>(url, body, params);
  }

  errorNotFound(error: HttpErrorResponse | any) {
    if (error.status == HttpStatusCode.NotFound || error.statusCode == HttpStatusCode.NotFound) {
      return new Observable<any>((subscriber) => subscriber.complete());
    }
    return throwError(() => error);
  }

  errorBadRequest(error: HttpErrorResponse | any) {
    let errMsg: string | null = null;
    if (error != null && error['statusCode'] != null) {
      errMsg = error.data != null && error.data?.error ? error.data?.error : error.message;
    } else if(error instanceof HttpErrorResponse) {
      errMsg = error?.message ? error?.message : error.toString();
    } else if(error != null && error?.message != null) {
      errMsg = error?.message;
    }
    if(errMsg) {
      return throwError(() => errMsg);
    }
    return throwError(() => error);
  }
}
