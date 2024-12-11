import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../interfaces/group.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class WorkgroupsService {

    private apiUrl = `${environment.url}:${environment.port}/bpmGroup`;
 

  constructor(private http: HttpClient) {}


  getAll(): Observable<any> {
    let params = {
        page: 0,
        size: 10,
        sortBy: 'name',
        };

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }


  create(group: Group): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, group);
  }


  update(group: Group): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${group.groupId}`, group);
  }

  delete(groupId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${groupId}`);
  }
}