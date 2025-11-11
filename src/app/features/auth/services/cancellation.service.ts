import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  private cancelAllSubject = new Subject<void>();

  // Observable al que pueden suscribirse otros componentes/servicios
  public onCancelAll$ = this.cancelAllSubject.asObservable();

  // Método para cancelar todos los observables
  public cancelAll(): void {
    this.cancelAllSubject.next();
  }
}
