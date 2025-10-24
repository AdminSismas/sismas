import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { environment } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DocumentAssociatedService {

  basic_url = `${environment.url}:${environment.port}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }



}
