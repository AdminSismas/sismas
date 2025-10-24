import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environments';


@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(private title: Title) {}

  setTitle(): void {
    this.title.setTitle(environment.titulo);
  }
}
