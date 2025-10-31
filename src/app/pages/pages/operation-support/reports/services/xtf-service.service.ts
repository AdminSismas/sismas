import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment as envi } from '@environments/environments';
import { UserService } from '@shared/services';

export interface XtfFiles {
  name: string;
  user: string;
  type: '.XTF' | '.ZIP';
}

const baseUrl = `${envi.url}:${envi.port}${envi.bpmAttachment.value}`;

@Injectable({
  providedIn: 'root'
})
export class XtfServiceService {

  http = inject(HttpClient);

  userService = inject(UserService);

  getXtfFileList(): Observable<XtfFiles[]> {
    const url = `${baseUrl}${envi.bpmAttachment.xtf}`;
    return this.http.get<string[]>(url).pipe(
      map((result) => {
        return result.map((file) => {
          return {
            name: file,
            user: this.userService.getUser()!.sub,
            type: '.ZIP' as XtfFiles['type']
          };
        });
      })
    );
  }

  downloadXtfFile(fileName: string): Observable<Blob> {
    const url = `${baseUrl}${envi.bpmAttachment.xtf}/${fileName}`;
    return this.http.get(url, { responseType: 'blob'});
  }
}
