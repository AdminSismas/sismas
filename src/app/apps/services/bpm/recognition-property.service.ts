import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import {
  RecognitionProperty,
  RecognitionPropertyBasic,
  RecognitionPropertyMapper,
  TagsRecognition
} from '../../interfaces/bpm/recognitionProperty.interface';

@Injectable({
  providedIn: 'root'
})
export class RecognitionPropertyService {
  private readonly base_url = `${envi.url}:${envi.port}${envi.ccReconocimientoPredial}`;

  private http: HttpClient = inject(HttpClient);
  private requestsService: SendGeneralRequestsService = inject(SendGeneralRequestsService);

  createRecognitionProperty(
    executionId: string | number,
    formValues: {
      description: string,
      docAportados: string,
      docCatastrales: string,
      observaciones: string
    }
  ): Observable<RecognitionPropertyBasic> {
    const body = { executionId, ...formValues };

    return this.http.post<RecognitionProperty>(this.base_url, body)
      .pipe(
        map((response: RecognitionProperty) => RecognitionPropertyMapper.mapRecognitionProperty(response))
      );
  }

  getRecognitionPropertyTags(executionId: string | number): Observable<TagsRecognition> {
    return this.requestsService.sendRequestsFetchGet(
      `${this.base_url}${envi.getByExecution}/${executionId}`
    ).pipe(
      map((response: RecognitionProperty) => RecognitionPropertyMapper.mapRecognitionPropertyTags(response)),
      catchError(error => this.requestsService.errorNotFound(error))
    );
  }

  getRecognitionProperty(executionId: string | number): Observable<RecognitionProperty> {
    return this.requestsService.sendRequestsFetchGet(
      `${this.base_url}${envi.getByExecution}/${executionId}`
    ).pipe(
      catchError(error => this.requestsService.errorNotFound(error))
    );
  }

  sendTags(
    executionId: string | number,
    formValues: {
      tag01: string,
      tag02: string,
      tag03: string,
      tag04: string,
      tag05: string
    }
  ): Observable<RecognitionPropertyBasic> {
    const body = { executionId, ...formValues };

    return this.http.post<RecognitionPropertyBasic>(this.base_url, body);
  }


}
