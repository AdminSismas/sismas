import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ProTaskE } from '@features/tasks/models';

@Injectable({
  providedIn: 'root'
})
export class SendInfoGeneralService {
  readonly infoProTaskE = signal<ProTaskE>({});
  readonly infoFatherURL = signal<string>('');

  // Compatibilidad hacia atrás con observables
  readonly infoProTaskE$: Observable<ProTaskE> = toObservable(this.infoProTaskE);
  readonly infoFatherURL$: Observable<string> = toObservable(this.infoFatherURL);

  setInfoProTaskE(protaskE: ProTaskE): void {
    this.infoProTaskE.set(protaskE);
  }

  setFatherURL(url: string): void {
    this.infoFatherURL.set(url);
  }
}
