import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { VexConfigService } from '@vex/config/vex-config.service';
import { faPaperPlane, faPaperclip, faSearch, faPhone, faEllipsisV, faUserCircle, faUsers, faPlus, faBan, faChevronLeft, faChevronRight, faVolumeUp, faVolumeMute, faMicrophone, faStop, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
// import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-agent-chat',
  templateUrl: './agent-chat.component.html',
  styleUrls: ['./agent-chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, HttpClientModule]
})
export class AgentChatComponent implements OnInit, AfterViewChecked {
  messages: { from: string, text: string }[] = [];
  newMessage: string = '';
  isTyping: boolean = false;
  isSearchVisible: boolean = false;  // Estado para la visibilidad de la sección de búsqueda
  isSoundOn: boolean = true;  // Estado del sonido
  isRecording: boolean = false;  // Estado de la grabación de audio
  isRobot: boolean = true;  // Estado del icono (robot/humano)
  isInputDisabled: boolean = false;  // Estado del campo de texto
  mediaRecorder: MediaRecorder | null = null;  // Objeto de grabación de medios
  audioChunks: Blob[] = [];  // Almacena los fragmentos de audio grabados
  audio = new Audio();  // Objeto de audio para reproducir

  constructor(
    private http: HttpClient,
    library: FaIconLibrary,
    private configService: VexConfigService,
    // private authService: AuthService // Inyecta el servicio de autenticación
  ) {
    library.addIcons(faPaperPlane, faPaperclip, faSearch, faPhone, faEllipsisV, faUserCircle, faUsers, faPlus, faBan, faChevronLeft, faChevronRight, faVolumeUp, faVolumeMute, faMicrophone, faStop, faRobot, faUser);
  }

  ngOnInit() {
    this.footerVisibleChange(false);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ from: 'me', text: this.newMessage });
      this.isTyping = true;
      this.isInputDisabled = true; // Deshabilitar el campo de texto
      this.sendToBackend(this.newMessage);
      this.newMessage = '';
    }
  }

  sendToBackend(message: string) {
    const url = 'http://localhost/Pruebas%20Modals/agenteAPI.php'; // Cambia a la URL correcta si es necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // const currentUser = this.authService.getCurrentUser();
    // const idUser = currentUser ? currentUser.idUser : 300; // Obtiene el idUser del usuario autenticado, usa 300 si no está autenticado
    const volumeUp = this.isSoundOn ? 'si' : 'no';
    const humanOn = !this.isRobot ? 'si' : 'no';
    // falta &idcliente=${idUser} enla linea 68
    const body = `ind=29&pregunta=${encodeURIComponent(message)}&audio_nom=no&volume_up=${volumeUp}&human_on=${humanOn}`;

    this.http.post(url, body, { headers }).subscribe((response: any) => {
      this.isTyping = false;
      this.isInputDisabled = false; // Habilitar el campo de texto
      if (response.status === 'ok') {
        this.messages.push({ from: 'other', text: response.robot_response });
        if (response.ruta_audio) {
          this.playAudio(response.ruta_audio);
        }
      } else {
        this.messages.push({ from: 'other', text: 'Error: ' + response.message });
      }
    }, error => {
      this.isTyping = false;
      this.isInputDisabled = false; // Habilitar el campo de texto
      this.messages.push({ from: 'other', text: 'Error al conectar con el servidor.' });
    });
  }

  sendAudioToBackend(audioBlob: Blob) {
    const url = 'http://localhost/Pruebas%20Modals/agenteAPI.php'; // Cambia a la URL correcta si es necesario
    const formData = new FormData();

    // const currentUser = this.authService.getCurrentUser();
    // const idUser = currentUser ? currentUser.idUser : 300; // Obtiene el idUser del usuario autenticado, usa 300 si no está autenticado
    const volumeUp = this.isSoundOn ? 'si' : 'no';
    const humanOn = !this.isRobot ? 'si' : 'no';

    formData.append('ind', '30');
    formData.append('pregunta', 'Audio message');
    // formData.append('idcliente', idUser.toString());
    formData.append('audio_nom', 'no');
    formData.append('audio', audioBlob, 'audio_message.webm');
    formData.append('volume_up', volumeUp);
    formData.append('human_on', humanOn);

    this.http.post(url, formData).subscribe((response: any) => {
      if (response.status === 'ok') {
        const transcription = response.transcription;
        this.messages.push({ from: 'me', text: transcription });
        this.isTyping = true; // Mostrar la animación de "escribiendo" después de pintar la pregunta
        this.isInputDisabled = true; // Deshabilitar el campo de texto
        this.sendToBackend(transcription); // Enviar el texto convertido para obtener la respuesta del robot
      } else {
        this.isTyping = false;
        this.isInputDisabled = false; // Habilitar el campo de texto
        this.messages.push({ from: 'other', text: 'Error: ' + response.message });
      }
    }, error => {
      this.isTyping = false;
      this.isInputDisabled = false; // Habilitar el campo de texto
      this.messages.push({ from: 'other', text: 'Error al conectar con el servidor.' });
    });
  }

  playAudio(audioFileName: string) {
    const audioUrl = `http://localhost/Pruebas%20Modals/${audioFileName}`;
    this.audio.src = audioUrl;
    this.audio.load();
    this.audio.play().catch(error => {
      console.error('Error al reproducir el audio:', error);
    });
  }

  scrollToBottom() {
    const chatContainer = document.getElementById('chat');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  footerVisibleChange(change: boolean): void {
    this.configService.updateConfig({
      footer: {
        visible: false
      }
    });
  }

  simulateTyping() {
    this.isTyping = true;
    setTimeout(() => {
      this.isTyping = false;
      this.simulateResponse();
    }, 1000); // Simulate typing for 1 second
  }

  simulateResponse() {
    this.messages.push({ from: 'other', text: 'This is a simulated response' });
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
}
