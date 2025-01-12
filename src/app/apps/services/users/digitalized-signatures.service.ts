import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as envi } from 'src/environments/environments';
import { UsersSignatures } from '../../interfaces/digitalized-signatures';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DigitalizedSignaturesService {

  private base_url = `${envi.url}:${envi.port}${envi.bpm_users}`;

  constructor(
    private http: HttpClient
  ) { }

  getUsersWithSignatures(page: number = 0, size: number = 10, sortBy: string = 'username'): Observable<UsersSignatures> {
    const url = `${this.base_url}${envi.withSignaturesUsers}`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<UsersSignatures>(url, { params });
  }

  getUsersWithoutSignatures(page: number = 0, size: number = 10, sortBy: string = 'username'): Observable<UsersSignatures> {
    const url = `${this.base_url}${envi.withoutSignaturesUsers}`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<UsersSignatures>(url, { params });
  }

  addSignature(userId: number, formData: FormData): Observable<any> {
    const url = `${this.base_url}/${userId}${envi.signatureUrl}`;

    return this.http.patch<any>(url, formData);
  }
}
