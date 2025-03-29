import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Chat } from './chat.component';
import { map } from 'rxjs/operators';
import { env } from '../../../../../../environments/enviromentsIA';

interface ChatApiResponse {
  success: number;
  data: Chat[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly api_sql = `${env.url_base}${env.api}${env.api_end}`;
  private chatsSubject = new ReplaySubject<Chat[]>(1);
  chats$ = this.chatsSubject.asObservable();
  drawerOpen = new ReplaySubject<boolean>(1);
  drawerOpen$ = this.drawerOpen.asObservable();

  constructor(private http: HttpClient) {
    this.fetchChats();
  }

  fetchChats(assistantId?: string): void {
    const url = `${this.api_sql}?chats=true&assistantId=${assistantId}`;
    this.http.post<ChatApiResponse>(url, {}).subscribe(
      response => {
        if (response.success === 1) {
          this.chatsSubject.next(response.data); // Actualizar los chats
        } else {
          console.error('Error fetching chats:', response.message || 'Unknown error');
          this.chatsSubject.next([]); // Limpiar los chats cuando no se encuentran resultados
        }
      },
      error => {
        console.error('HTTP error:', error);
        this.chatsSubject.next([]); // Limpiar los chats en caso de error HTTP
      }
    );
  }

  getChat(chatId: string): Observable<Chat | undefined> {
    return this.chats$.pipe(
      map(chats => {
        const chat = chats.find(chat => chat.id.toString() === chatId);
        return chat;
      })
    );
  }
}
