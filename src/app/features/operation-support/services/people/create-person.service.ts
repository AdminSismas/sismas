import { inject, Injectable } from '@angular/core';
import {
  CREATE_PERSON_FORM,
  CREATE_CONTACT_FORM,
  SEARCH_PERSON_FORM
} from '@features/operation-support/constants/people';
import { InfoPerson } from '@features/property-management/models/info-person';
import { HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment as envi } from '@environments/environments';
import { HttpClient } from '@angular/common/http';
import { InfoContact } from '@features/property-management/models/info-contact';

@Injectable({
  providedIn: 'root'
})
export class CreatePersonService {
  // Injects
  private http = inject(HttpClient);

  // Properties
  private _infoPersonObject: InfoPerson = {} as InfoPerson;
  private url_basic = `${envi.url}:${envi.port}`;

  initInfoPersonObject() {
    const createPersonForm = CREATE_PERSON_FORM.reduce((acc, field) => {
      return { ...acc, [field.name]: null };
    }, {} as InfoPerson);

    const searchPersonForm = SEARCH_PERSON_FORM.reduce((acc, field) => {
      return { ...acc, [field.name]: null };
    }, {} as InfoPerson);

    const createContactForm = CREATE_CONTACT_FORM.reduce((acc, field) => {
      return { ...acc, [field.name]: null };
    }, {} as InfoPerson);

    this._infoPersonObject = {
      ...searchPersonForm,
      ...createPersonForm,
      ...createContactForm
    } as InfoPerson;
  }

  get infoPersonData(): InfoPerson {
    return this._infoPersonObject;
  }

  setInfoPersonData(infoPersonData: Partial<InfoPerson>) {
    this._infoPersonObject = {
      ...this._infoPersonObject,
      ...infoPersonData
    };
  }

  clearInfoPersonData() {
    this._infoPersonObject = {} as InfoPerson;
  }

  getSequencialCode(): Observable<string> {
    const url = `${this.url_basic}${envi.individual.value}${envi.sequentialCode}`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=UTF-8;'
    });

    return this.http.get(url, { responseType: 'text', headers }).pipe(
      tap((result) => {
        this.setInfoPersonData({ number: result });
      })
    );
  }

  updateContact(
    individualId: number,
  ): Observable<InfoContact> {
    const url = `${this.url_basic}${envi.contact}/${individualId}`;
    const body = new InfoContact(this._infoPersonObject);

    return this.http.put<InfoContact>(url, body);
  }

  createContact() {
    const url = `${this.url_basic}${envi.contact}`;
    const body = new InfoContact(this._infoPersonObject);

    return this.http.post<InfoContact>(url, body);
  }
}
