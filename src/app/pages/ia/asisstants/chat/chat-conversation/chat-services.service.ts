import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from "@environments/enviromentsIA";


@Injectable({
  providedIn: 'root'
})
export class ChatServicesService {

  constructor(private http: HttpClient) { }


  sendMessageToBackend(message: string, idUser: number,  volumeUp: string, humanOn: string, threadId: string, espqr: string, asistenteId: string, instrucciones: string, id_asistente: string, empresa_modelo: string, ruta_script:string, url:string): Observable<any> {
    const api_iaChat = `${env.url_base}${env.api}${env.module.ia_general_asis}`;    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `ind=29&asistente=${encodeURIComponent(asistenteId)}&pregunta=${encodeURIComponent(message)}&idcliente=${idUser}&audio_nom=no&volume_up=${volumeUp}&human_on=${humanOn}&thread_id=${threadId}&ruta=no&espqr=${espqr}&instrucciones=${encodeURIComponent(instrucciones)}&id_asistente=${id_asistente}&empresa_modelo=${empresa_modelo}&ruta_script=${ruta_script}&url=${url}`;
    return this.http.post(api_iaChat, body, { headers });
  }

  sendAudioToBackend(audioBlob: Blob, idUser: number, volumeUp: string, humanOn: string, threadId: string): Observable<any> {
    const api_iaChat = `${env.url_base}${env.api}${env.module.ia_general_asis}`;
    const formData = new FormData();
    formData.append('ind', '30');
    formData.append('pregunta', 'Audio message');
    formData.append('idcliente', idUser.toString());
    formData.append('audio_nom', 'no');
    formData.append('audio', audioBlob, 'audio_message.webm');
    formData.append('volume_up', volumeUp);
    formData.append('human_on', humanOn);
    formData.append('thread_id', threadId);
    formData.append('ruta', 'no');
   ;
    return this.http.post(api_iaChat, formData);
  }
}
