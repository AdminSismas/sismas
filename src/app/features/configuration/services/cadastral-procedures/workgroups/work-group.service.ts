import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../../../interfaces/cadastral-procedures/workgroup/group.interface';
import { environment } from '@environments/environments';
import { InformationPegeable } from '@shared/models/pageable';
import { User } from '@features/configuration/interfaces/users/user';

@Injectable({
  providedIn: 'root'
})
export class WorkgroupsService {
  private apiUrl = `${environment.url}:${environment.port}${environment.bpmGroup.value}`;

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number): Observable<InformationPegeable> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', 'name');

    return this.http.get<InformationPegeable>(`${this.apiUrl}`, { params });
  }

  create(group: Group): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, group);
  }

  update(group: Group): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${group.groupId}`, group);
  }

  delete(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${groupId}`);
  }

  getGroupMembers(
    groupId: number
  ): Observable<{ id: number; user: User; lastTurn: boolean }[]> {
    const url = `${this.apiUrl}${environment.bpmGroup.membership}/${groupId}`;

    return this.http.get<{ id: number; user: User; lastTurn: boolean }[]>(url);
  }

  removeGroupMember(groupId: number, userId: number): Observable<void> {
    const url = `${this.apiUrl}${environment.bpmGroup.membership}/${groupId}/user/${userId}`;

    return this.http.delete<void>(url);
  }

  addGroupMember(groupId: number, userId: number): Observable<void> {
    const url = `${this.apiUrl}${environment.bpmGroup.membership}/${groupId}/user/${userId}`;

    return this.http.post<void>(url, {});
  }
}
