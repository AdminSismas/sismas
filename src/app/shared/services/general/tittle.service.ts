import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly title = inject(Title);

  setTitle(): void {
    this.title.setTitle(environment.titulo);
  }
}
