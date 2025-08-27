import { environment } from 'src/environments/environments';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
  AfterViewChecked,
  TemplateRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chat } from '../chat.component';
import { map, switchMap, filter, catchError } from 'rxjs/operators';
import { VexConfigService } from '@vex/config/vex-config.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { FormControl, FormGroup } from '@angular/forms';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { ChatService } from '../chat.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { AuthServiceIA } from 'src/app/pages/pages/auth/authIA.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatServicesService } from './chat-services.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, of } from 'rxjs';
import { env } from "../../../../../../../environments/enviromentsIA";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MODAL_MEDIUM } from '../../../../../../apps/constants/general/constants';

@Component({
  selector: 'vex-chat-conversation',
  templateUrl: './chat-conversation.component.html',
  styleUrls: ['./chat-conversation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatMenuModule,
    VexScrollbarComponent,
    NgFor,
    MatDividerModule,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
  ]
})
export class ChatConversationComponent implements OnInit, AfterViewChecked {
  url_entorno: string = environment.url;
  chat?: Chat;
  messages: { id: number; from: string; text: string; isButton?: boolean; timestamp?: string }[] = [];
  newMessage = '';
  isTyping = false;
  isSearchVisible = false;
  isSoundOn = true;
  isRecording = false;
  isRobot = false;
  isInputDisabled = false;
  isLoading = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audio = new Audio();
  threadId = 'nada';
  biUrl: SafeResourceUrl = '';
  espqr = 'no';

  form = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  @ViewChild('settingsDialog') settingsDialog!: TemplateRef<any>;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private configService: VexConfigService,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private AuthServiceIA: AuthServiceIA,
    private chatServicesService: ChatServicesService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.footerVisibleChange(false);
    this.espqr = 'no';
    this.route.paramMap
      .pipe(
        map((paramMap) => paramMap.get('chatId')),
        switchMap((chatId) => {
          return this.chatService.getChat(chatId!).pipe(
            catchError(() => {
              return of(undefined);
            })
          );
        }),
        filter((chat): chat is Chat => !!chat),
      )
      .subscribe((chat) => {
        this.chat = chat;
        this.chat.unreadCount = 0;
        this.messages = [];
        this.cd.detectChanges();
        this.scrollToBottom();
      });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  footerVisibleChange(change: boolean): void {
    this.configService.updateConfig({
      footer: {
        visible: false
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ id: this.messages.length + 1, from: 'me', text: this.newMessage, timestamp: new Date().toLocaleTimeString() });
      this.isTyping = true;
      this.isInputDisabled = true;
      this.isLoading = true;
      this.cd.detectChanges();
      this.sendToBackend(this.newMessage);
      this.newMessage = '';
    }
  }

  // Método para manejar la pulsación de teclas en el campo de entrada
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevenir la nueva línea en el campo de texto
      this.sendMessage(); // Llamar a la función sendMessage
    }
  }

  sendToBackend(message: string) {
    if (!this.chat) {
      return;
    }

    const currentUser = this.AuthServiceIA.getCurrentUser();
    const idUser = currentUser ? currentUser.idUser : 300;
    const volumeUp = this.isSoundOn ? 'si' : 'no';
    const humanOn = !this.isRobot ? 'si' : 'no';

    const id_asistente = this.chat.id_asistente;  // Obtén el id del chat
    const asistenteId = this.chat.asistente_id;  // Obtén el asistente_id
    const instrucciones = this.chat.instrucciones;  // Obtén las instrucciones
    const empresa_modelo = this.chat.empresa_modelo;  // Obtén la empresa_modelo

    //Ruta de consulta al asistente
    const ruta_script = "/var/www/cobra/" + `${env.module.entorno}` + "/ia_general/ejecutable_ia_general.sh";
    // const ruta_script = "/var/www/cobra/" + `${env.module.entorno}` + "/geogestion/env/ejecutable_geogestion.sh";



    this.chatServicesService.sendMessageToBackend(message, idUser , volumeUp, humanOn, this.threadId, this.espqr, asistenteId, instrucciones, id_asistente, empresa_modelo, ruta_script, this.url_entorno).subscribe(
      (response: any) => {
        this.isTyping = false;
        this.isInputDisabled = false;
        this.isLoading = false;
        if (response.status === 'ok') {
          const formattedResponse = response.robot_response.replace(/\n/g, '<br>');
          const existingResponseIndex = this.messages.findIndex(msg => msg.text === formattedResponse && msg.from === 'other');
          if (existingResponseIndex === -1) {
            this.messages.push({ id: this.messages.length + 1, from: 'other', text: formattedResponse, timestamp: new Date().toLocaleTimeString() });
          }
          this.cd.detectChanges();
          if (response.ruta_audio) {
            this.playAudio(response.ruta_audio);
          }
          if (response.thread_id && response.thread_id !== 'nada') {
            this.threadId = response.thread_id;
          }
          if (response.pasar_pqr === 'si') {
            this.messages.push({ id: this.messages.length + 1, from: 'other', text: 'PQR', isButton: true, timestamp: new Date().toLocaleTimeString() });
          }
          // Manejo de BI: Sanitizar la URL antes de usarla
          if (response.mostrar_bi && response.mostrar_bi !== 'no') {
            this.biUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.mostrar_bi);  // Sanitize the BI URL
          }
        } else {
          this.messages.push({ id: this.messages.length + 1, from: 'other', text: 'Error: ' + response.message, timestamp: new Date().toLocaleTimeString() });
        }
        this.cd.detectChanges();
      },
      error => {
        this.isTyping = false;
        this.isInputDisabled = false;
        this.isLoading = false;
        this.messages.push({ id: this.messages.length + 1, from: 'other', text: 'Error al conectar con el servidor.', timestamp: new Date().toLocaleTimeString() });
        this.cd.detectChanges();
      }
    );
  }

  handlePqrClick() {
    this.espqr = 'si';
    this.messages.push({
      id: this.messages.length + 1,
      from: 'other',
      text: `Bienvenido al portal de información y PQR de Catastro Antioquia. Es un placer ayudarte hoy. Aquí puedes encontrar expedición de certificados, productos y servicios catastrales de forma fácil y segura. Estoy aquí para asistirte con cualquier duda o trámite que necesites realizar.

    Por favor, dime cuál de las siguientes peticiones o trámites deseas realizar:

    1. Cambio de Propietario
    2. Radicado de Trámite
    3. Hablar con un Funcionario
    4. Expedición de Certificados Catastrales`,
      timestamp: new Date().toLocaleTimeString()
    });
    this.cd.detectChanges();
  }

  sendAudioToBackend(audioBlob: Blob) {
    const currentUser = this.AuthServiceIA.getCurrentUser();
    const idUser = currentUser ? currentUser.idUser : 300;
    const volumeUp = this.isSoundOn ? 'si' : 'no';
    const humanOn = !this.isRobot ? 'si' : 'no';

    // falta idUser
    this.chatServicesService.sendAudioToBackend(audioBlob, idUser , volumeUp, humanOn, this.threadId).subscribe({
      next: (response) => {
        if (response.status === 'ok') {
          const transcription = response.transcription;
          this.messages.push({ id: this.messages.length + 1, from: 'me', text: transcription, timestamp: new Date().toLocaleTimeString() });
          this.isTyping = true;
          this.isInputDisabled = true;
          this.cd.detectChanges();
          this.sendToBackend(transcription);
        } else {
          this.isTyping = false;
          this.isInputDisabled = false;
          this.messages.push({ id: this.messages.length + 1, from: 'other', text: 'Error: ' + response.message, timestamp: new Date().toLocaleTimeString() });
          this.cd.detectChanges();
        }
      },
      error: () => {
        this.isTyping = false;
        this.isInputDisabled = false;
        this.messages.push({ id: this.messages.length + 1, from: 'other', text: 'Error al conectar con el servidor.', timestamp: new Date().toLocaleTimeString() });
        this.cd.detectChanges();
      }
  });
  }

  playAudio(audioFileName: string) {
    const audioUrl = `${env.url_base}${env.api}${env.module.asistenteAudio}${audioFileName}`;
    this.audio.src = audioUrl;
    this.audio.load();
    this.audio.play().catch(error => {
      console.error('Error al reproducir el audio:', error);
    });
  }

  scrollToBottom() {
    if (!this.scrollbar) {
      return;
    }

    this.scrollbar.scrollbarRef?.getScrollElement()?.scrollTo({
      behavior: 'smooth',
      top: this.scrollbar.scrollbarRef.getContentElement()?.clientHeight
    });
  }

  openDrawer() {
    this.chatService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  closeDrawer() {
    this.chatService.drawerOpen.next(false);
    this.cd.markForCheck();
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  toggleIcon() {
    this.isRobot = !this.isRobot;
  }

  startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.audioChunks = [];

        this.mediaRecorder.addEventListener('dataavailable', event => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          this.sendAudioToBackend(audioBlob);
        });

        this.isRecording = true;
      });
    } else {
      alert('Tu navegador no soporta grabación de audio.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  trackById(index: number, message: { id: number; from: string; text: string; isButton?: boolean; timestamp?: string }) {
    return message.id;
  }

  openSettings() {
    this.dialog.open(this.settingsDialog, {
      ...MODAL_MEDIUM,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
