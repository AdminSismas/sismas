import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { environment as envi } from 'src/environments/environments';
import { UsersSignatures } from '@shared/interfaces';
import { Observable } from 'rxjs';
import { UserDetails } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DigitalizedSignaturesService {

  private base_url = `${envi.url}:${envi.port}${envi.bpmUser.value}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  getUsersWithSignatures(page = 0, size = 10, sortBy = 'username'): Observable<UsersSignatures> {
    const url = `${this.base_url}${envi.withSignaturesUsers}`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<UsersSignatures>(url, { params });
  }

  getUsersWithoutSignatures(page = 0, size = 10, sortBy = 'username'): Observable<UsersSignatures> {
    const url = `${this.base_url}${envi.withoutSignaturesUsers}`;

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<UsersSignatures>(url, { params });
  }

  addSignature(userId: number, formData: FormData): Observable<UserDetails[]> {
    const url = `${this.base_url}/${userId}${envi.signatureUrl}`;

    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.patch<UserDetails[]>(url, formData, { headers });
  }

  deleteSignature(userId: number): Observable<UserDetails[]> {
    const url = `${this.base_url}/${userId}${envi.signatureUrl}`;
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    const formData = new FormData();
    formData.append('file', new Blob() ,'NULL');

    return this.http.patch<UserDetails[]>(url, formData, { headers });
  }
}
