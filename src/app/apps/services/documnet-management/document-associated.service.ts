import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DocumentAssociatedService {

  basic_url: string = `${environment.url}:${environment.port}`;

  constructor(private http: HttpClient) { }



}
