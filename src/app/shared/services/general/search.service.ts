import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  readonly valueChanges = signal('');
  readonly isOpen = signal(false);

  // Compatibilidad hacia atrás con BehaviorSubjects
  readonly valueChangesSubject = new BehaviorSubject<string>('');
  readonly valueChanges$ = this.valueChangesSubject.asObservable();

  readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.isOpenSubject.asObservable();

  readonly submitSubject = new Subject<string>();
  readonly submit$ = this.submitSubject.asObservable();
}
