import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {
  isLoading = signal<boolean>(false);
  textLoading = signal<string>('Cargando ...');

  chargeTextLoading(text: string) {
    this.textLoading.set(text);
  }

  activateLoading(value = false) {
    if(value) {
      this.show();
      return;
    }
    this.hide();
  }

  activate(timer = 3000) {
    this.isLoading.set(true);
    setTimeout(() => this.hide(), timer);
  }

  deActivate(timer = 3000) {
    this.isLoading.set(true);
    setTimeout(() => this.hide(), timer);
  }

  show() {
    this.isLoading.set(true);
  }

  hide() {
    this.isLoading.set(false);
  }
}
