import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment as envi } from '@environments/environments';
import {
  RecognitionProperty,
  RecognitionPropertyBasic,
  RecognitionPropertyMapper,
  TagsRecognition
} from '@features/bpm-workflows/models/recognitionProperty.interface';

@Injectable({
  providedIn: 'root'
})
export class RecognitionPropertyService {
  private readonly base_url = `${envi.url}:${envi.port}${envi.ccReconocimientoPredial}`;

  private http: HttpClient = inject(HttpClient);

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
    return this.http.get<RecognitionProperty>(
      `${this.base_url}${envi.getByExecution}/${executionId}`
    ).pipe(
      map((response: RecognitionProperty) => RecognitionPropertyMapper.mapRecognitionPropertyTags(response)),
    );
  }

  getRecognitionProperty(executionId: string | number): Observable<RecognitionProperty> {
    return this.http.get<RecognitionProperty>(
      `${this.base_url}${envi.getByExecution}/${executionId}`
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
