// Angular framework
import { ChangeDetectorRef } from '@angular/core';
import { Component, Inject, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// Vex
// Material
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
// Custom
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { ComponentsServicesService } from '../components.services.service';
import { ContactsParamsService } from './contacts-params.service';

@Component({
  selector: 'vex-contacts-params',
  standalone: true,
  templateUrl: './contacts-params.component.html',
  styleUrls: ['./contacts-params.component.scss'],
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
  ]
})
export class ContactsParamsComponent implements OnInit, AfterViewInit {
  @Output() assistantUpdated = new EventEmitter<assistantData>();
  form: FormGroup;
  assistants: assistantData[] = [];
  modelos: { id: number, modelo: string, descripcion: string, empresa: string }[] = [];
  modelosOriginales: any[] = [];  // Lista con todos los modelos originales
  modelosFiltrados: any[] = [];   // Lista que se usará para mostrar los modelos filtrados


  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>; // Elemento de audio
  isPlaying = false;
  currentAudioUrl = ''; // URL actual del audio
  voces: { id: number, nombre_voz: string, ejemplo_voz: string }[] = [];

  // Variables para el segundo formulario
  fuente = '';
  asistente = '';
  proposito = '';
  archivo: File | null = null;

  mostrarTuerca = false;

  showCreateParamsButton = false;
  parametrosCreados = false;
  showCreateVoiceButton = false;
  voiceCreados = false;

  temperatureValue = 0.7; // Valor inicial
  topPValue = 1;

  @ViewChild('modelValidationWarning') private modelValidationWarning!: SwalComponent;
  @ViewChild('successUpdate') private successUpdate!: SwalComponent;
  @ViewChild('successInstructions') private successInstructions!: SwalComponent;
  @ViewChild('successVoice') private successVoice!: SwalComponent;
  @ViewChild('documentSuccess') private documentSuccess!: SwalComponent;
  @ViewChild('documentError') private documentError!: SwalComponent;
  @ViewChild('formWarning') private formWarning!: SwalComponent;


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: assistantData,
    private dialogRef: MatDialogRef<ContactsParamsComponent>,
    private componentsServicesService: ComponentsServicesService,
    private contactsParamsService: ContactsParamsService,
    // private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      instrucciones: [data.instrucciones],
      instruccion_personalidad: [data.instruccion_personalidad],
      instruccion_saludo_despedida: [data.instruccion_saludo_despedida],
      modelo_predeterminado: [data.modelo_predeterminado, [Validators.required, Validators.maxLength(100)]],
      modelo_actual: [data.modelo_actual, [Validators.required, Validators.maxLength(100)]],
      cambiar_modelo: [data.cambiar_modelo, Validators.required],
      openai: [data.openai, Validators.required],
      anthropic: [data.anthropic, Validators.required],
      google: [data.google, Validators.required],
      llama: [data.llama, Validators.required],
      cic: [data.cic, Validators.required],
      escuchar: [data.escuchar, Validators.required],
      hablar: [data.hablar, Validators.required],
      archivos: [data.archivos, Validators.required],
      codigo: [data.codigo, [Validators.required, Validators.maxLength(50)]],
      tavily: [data.tavily, Validators.required],
      wikipedia: [data.wikipedia, Validators.required],
      pdf: [data.pdf, Validators.required],
      bi: [data.bi, Validators.required],
      video: [data.video, Validators.required],
      nombre_voz: [data.nombre_voz, Validators.required],
      id_eleven: [data.id_eleven, Validators.required],
      id_modelo_voz: [data.id_modelo_voz, Validators.required],
      similarity_boost: [data.similarity_boost, Validators.required],
      stability: [data.stability, Validators.required],
      style: [data.style, Validators.required],
      use_speaker_boost: [data.use_speaker_boost, Validators.required],
      optimize_streaming_latency: [data.optimize_streaming_latency, Validators.required],
    });
  }


  ngOnInit(): void {
    this.loadAssistants(); // Carga los asistentes al inicializar el componente
    this.loadModelos(); // Carga los modelos al inicializar el componente
    this.loadVoces();  // Cargar las voces disponibles al inicializar el componente

    // Obtén los datos del usuario autenticado
    // this.userAuthData = this.authService.getCurrentUser();;

    // Llama a la función `onVozChange` para la voz predeterminada
    if (this.form.get('id_modelo_voz')?.value) {
      this.onVozChange(this.form.get('id_modelo_voz')?.value);
    }

  // Escucha los cambios en los campos y actualiza el listado de modelos disponibles
  this.form.get('openai')?.valueChanges.subscribe(() => this.filtrarModelos());
  this.form.get('google')?.valueChanges.subscribe(() => this.filtrarModelos());
  this.form.get('anthropic')?.valueChanges.subscribe(() => this.filtrarModelos());
  this.form.get('llama')?.valueChanges.subscribe(() => this.filtrarModelos());

  this.form.valueChanges.subscribe(() => {
    this.checkEmptyFieldsInstruction();
  });
  this.checkInitialDataInstruction();

  this.form.valueChanges.subscribe(() => {
    this.checkEmptyfieldsVoice();
  });
  this.checkInitialDataVoice();
}

  ngAfterViewInit(): void {
    // Cuando termine el audio, reiniciamos el estado
    this.audioPlayer.nativeElement.onended = () => {
      this.isPlaying = false;
    };
  }

  onVozChange(vozId: number): void {
    const vozSeleccionada = this.voces.find(voz => voz.id === vozId);
    if (vozSeleccionada) {
      this.currentAudioUrl = vozSeleccionada.ejemplo_voz;
      this.audioPlayer.nativeElement.src = this.currentAudioUrl; // Asigna la URL al reproductor de audio
      this.audioPlayer.nativeElement.load(); // Carga el nuevo archivo
      this.isPlaying = false; // Reinicia el estado de reproducción
    }
  }

  toggleAudio(event: Event) {
    event.preventDefault();  // Prevenir la acción por defecto del botón
    event.stopPropagation();  // Detener la propagación del evento para que no se active el envío del formulario

    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();  // Pausar el audio
    } else {
      this.audioPlayer.nativeElement.play();   // Reproducir el audio
    }

    this.isPlaying = !this.isPlaying;  // Alternar el estado
  }

  loadVoces(): void {
    this.contactsParamsService.getVoces().subscribe({
      next: (response) => {
        if (response.success) {
          this.voces = response.data;

          // Verifica si id_modelo_voz existe y selecciona la voz adecuada
          if (this.data.id_modelo_voz) {
            this.onVozChange(this.data.id_modelo_voz);
          }
        } else {
          console.error('Error al cargar las voces:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar las voces:', error);
      }
    });
  }


  loadAssistants(): void {
    this.componentsServicesService.loadAssistants().subscribe({
      next: (response) => {
        if (response.success) {
          this.assistants = response.data; // Asigna la lista de asistentes
        } else {
          console.error('Error al cargar los asistentes:', response.message);
        }
      },
      error: (error) => {
        console.error('Error al cargar los asistentes:', error);
      }
    });
  }

 // Método para cargar los modelos desde el backend
  loadModelos(): void {
  this.contactsParamsService.getModelos().subscribe({
    next: (response) => {
      if (response.success) {
        this.modelosOriginales = response.data; // Asigna los datos a modelosOriginales
        this.modelosFiltrados = [...this.modelosOriginales]; // Copia los modelos originales a modelosFiltrados inicialmente

        // Verificar si el modelo_actual existe en los modelos cargados
        if (this.data.modelo_actual) {
          const modeloSeleccionado = this.modelosOriginales.find(modelo => modelo.id === this.data.modelo_actual);

          // Si se encuentra el modelo, establecerlo en el formulario
          if (modeloSeleccionado) {
            this.form.patchValue({
              modelo_actual: modeloSeleccionado.id
            });

            // Llama a la función onModeloChange para verificar si el modelo es de OpenAI
            this.onModeloChange(modeloSeleccionado.id);
          }
          this.filtrarModelos();
        }
      } else {
        console.error('Error al cargar los modelos:', response.message);
      }
    },
    error: (error) => {
      console.error('Error al cargar los modelos:', error);
    }
  });
  }


  onModeloChange(id: number): void {
    const modeloSeleccionado = this.modelosFiltrados.find(modelo => modelo.id === id);

    if (modeloSeleccionado) {
      // Comparación directa con la empresa 'OpenAI'
      if (modeloSeleccionado.empresa === 'OpenAI') {
        this.mostrarTuerca = true;
      } else {
        this.mostrarTuerca = false;
      }
    }
  }


  filtrarModelos(): void {
  const openaiSeleccionado = this.form.get('openai')?.value === 1;
  const googleSeleccionado = this.form.get('google')?.value === 1;
  const anthropicSeleccionado = this.form.get('anthropic')?.value === 1;
  const llamaSeleccionado = this.form.get('llama')?.value === 1;


  // Si ninguna opción está seleccionada, mostrar todos los modelos
  if (!openaiSeleccionado && !googleSeleccionado && !anthropicSeleccionado && !llamaSeleccionado) {
    this.modelosFiltrados = [];
  } else {
    this.modelosFiltrados = this.modelosOriginales.filter(modelo => {
      if (openaiSeleccionado && modelo.empresa === 'OpenAI') {
        return true;
      }
      if (googleSeleccionado && modelo.empresa === 'Gemini-IA') {
        return true;
      }
      if (anthropicSeleccionado && modelo.empresa === 'Anthropic-IA') {
        return true;
      }
      if (llamaSeleccionado && modelo.empresa === 'Groq-IA') {
        return true;
      }
      return false;
    });
  }
  const modeloActual = this.form.get('modelo_actual')?.value;
  if (modeloActual && !this.modelosFiltrados.some(modelo => modelo.id === modeloActual)) {
    this.form.patchValue({ modelo_actual: modeloActual });
  }

  this.cdr.detectChanges();
}

validateModelSelection(): boolean {
  const formValues = this.form.value;
  return formValues.openai === 1 ||
        formValues.anthropic === 1 ||
        formValues.google === 1 ||
        formValues.llama === 1;
}


//Función actualizar datos del apartado Características
updateFeature() {
  if (!this.validateModelSelection()) {
    this.modelValidationWarning.fire();
    return;
  }
  if (this.form.valid) {
    const updatedParams = {
      cambiar_modelo: this.form.get('cambiar_modelo')?.value,
      openai: this.form.get('openai')?.value,
      anthropic: this.form.get('anthropic')?.value,
      google: this.form.get('google')?.value,
      llama: this.form.get('llama')?.value,
      cic: this.form.get('cic')?.value,
      escuchar: this.form.get('escuchar')?.value,
      hablar: this.form.get('hablar')?.value
    };

    this.componentsServicesService.updateParam(this.data.id, updatedParams, 'feature').subscribe(response => {
      if (response.success) {
        this.successUpdate.fire().then(() => {
          this.assistantUpdated.emit({
            ...this.data,
            ...updatedParams
          });
          this.dialogRef.close(updatedParams);
        });
      } else {
        console.error('Error al actualizar los parámetros:', response.message);
      }
    });
  } else {
    this.showFormErrors(); // Mostrar los errores del formulario
  }
}

//Función actualizar datos del apartado Parámetros
updateParams() {
  if (this.form.valid) {
    const updatedParams = {
      modelo_predeterminado: this.form.get('modelo_predeterminado')?.value,
      modelo_actual: this.form.get('modelo_actual')?.value,
      instrucciones: this.form.get('instrucciones')?.value,
      instruccion_personalidad: this.form.get('instruccion_personalidad')?.value,
      instruccion_saludo_despedida: this.form.get('instruccion_saludo_despedida')?.value,
      archivos: this.form.get('archivos')?.value,
      codigo: this.form.get('codigo')?.value
    };

    this.componentsServicesService.updateParam(this.data.id, updatedParams, 'params').subscribe(response => {
      if (response.success) {
        this.successUpdate.fire().then(() => {
          this.assistantUpdated.emit({
            ...this.data,
            ...updatedParams
          });
          this.dialogRef.close(updatedParams);
        });
      } else {
        console.error('Error al actualizar los parámetros:', response.message);
      }
    });
  } else {
    this.showFormErrors(); // Mostrar los errores del formulario
  }
}

//Función actualizar datos del apartado Voz
updateVoice() {
  if (this.form.valid) {
    const updatedParams = {
      id_modelo_voz: this.form.get('id_modelo_voz')?.value,
      similarity_boost: this.form.get('similarity_boost')?.value,
      stability: this.form.get('stability')?.value,
      style: this.form.get('style')?.value,
      use_speaker_boost: this.form.get('use_speaker_boost')?.value,
      optimize_streaming_latency: this.form.get('optimize_streaming_latency')?.value
    };

    this.componentsServicesService.updateParam(this.data.id, updatedParams, 'voice').subscribe(response => {
      if (response.success) {
        this.successUpdate.fire().then(() => {
          this.assistantUpdated.emit({
            ...this.data,
            ...updatedParams
          });
          this.dialogRef.close(updatedParams);
        });
      } else {
        console.error('Error al actualizar los parámetros:', response.message);
      }
    });
  } else {
    this.showFormErrors(); // Mostrar los errores del formulario
  }
}

// Función para verificar si los campos de instrucciones están vacíos
checkEmptyFieldsInstruction(): void {
  const instrucciones = this.form.get('instrucciones')?.value;
  const instruccionPersonalidad = this.form.get('instruccion_personalidad')?.value;
  const instruccionSaludoDespedida = this.form.get('instruccion_saludo_despedida')?.value;

  // Mostrar el botón "Crear Parámetros" si los campos están vacíos, ocultar el de "Actualizar"
  if (!this.parametrosCreados) {
    this.showCreateParamsButton = !instrucciones && !instruccionPersonalidad && !instruccionSaludoDespedida;
}
}

// Función para verificar si los campos ya tienen datos
checkInitialDataInstruction(): void {
  const instrucciones = this.form.get('instrucciones')?.value;
  const instruccionPersonalidad = this.form.get('instruccion_personalidad')?.value;
  const instruccionSaludoDespedida = this.form.get('instruccion_saludo_despedida')?.value;

  // Si alguno de los campos ya tiene datos, se considera que los parámetros ya existen
  if (instrucciones || instruccionPersonalidad || instruccionSaludoDespedida) {
    this.parametrosCreados = true;
    this.showCreateParamsButton = false;
  } else {
    this.parametrosCreados = false;
    this.showCreateParamsButton = true;
  }
}

checkEmptyfieldsVoice(): void {
  const idModeloVoz = this.form.get('id_modelo_voz')?.value;
  const similarityBoost = this.form.get('similarity_boost')?.value;
  const stability = this.form.get('stability')?.value;
  const style = this.form.get('style')?.value;
  const useSpeakerBoost = this.form.get('use_speaker_boost')?.value;
  const optimizeStreamingLatency = this.form.get('optimize_streaming_latency')?.value;

  // Mostrar el botón "Crear Voz" si los campos están vacíos, ocultar el de "Actualizar"
  if (!this.voiceCreados) {
    this.showCreateVoiceButton = !idModeloVoz && !similarityBoost && !stability && !style && !useSpeakerBoost && !optimizeStreamingLatency;
  }
}

checkInitialDataVoice(): void {
  const idModeloVoz = this.form.get('id_modelo_voz')?.value;
  const similarityBoost = this.form.get('similarity_boost')?.value;
  const stability = this.form.get('stability')?.value;
  const style = this.form.get('style')?.value;
  const useSpeakerBoost = this.form.get('use_speaker_boost')?.value;
  const optimizeStreamingLatency = this.form.get('optimize_streaming_latency')?.value;

  // Si alguno de los campos ya tiene datos, se considera que los parámetros ya existen
  if (idModeloVoz || similarityBoost || stability || style || useSpeakerBoost || optimizeStreamingLatency) {
    this.voiceCreados = true;
    this.showCreateVoiceButton = false;
  } else {
    this.voiceCreados = false;
    this.showCreateVoiceButton = true;
  }
}

// Función para crear las instrucciones
createInstructions() {
  const instructionData = {
    id: this.data.id,
    instrucciones: this.form.get('instrucciones')?.value,
    instruccion_saludo_despedida: this.form.get('instruccion_saludo_despedida')?.value,
    instruccion_personalidad: this.form.get('instruccion_personalidad')?.value,
    modelo_predeterminado: '',
    modelo_actual: 0,
    cambiar_modelo: 0,
    openai: 0,
    id_asistente: '',
    anthropic: 0,
    google: 0,
    llama: 0,
    cic: 0,
    escuchar: 0,
    hablar: 0,
    archivos: 0,
    codigo: 0,
    tavily: 0,
    wikipedia: 0,
    pdf: 0,
    bi: 0,
    video: 0,
    imgurl: '',
    id_voz: 0,
    status: 0,
    id_modelo_voz: 0,
    similarity_boost: '',
    stability: '',
    style: '',
    use_speaker_boost: '',
    optimize_streaming_latency: '',
    nombre_voz: '',
    id_eleven: '',
    ejemplo_voz: '',
    idempresa: 0,
    empresa: '',
    nombre: '',
    descripcion: '',
    empresa_modelo: ''
  };

  this.componentsServicesService.createIntructions(instructionData).subscribe(response => {
    if (response.success) {
      this.successInstructions.fire();
      this.parametrosCreados = true;
      this.showCreateParamsButton = false;
    } else {
      console.error('Error al crear las instrucciones:', response.message);
    }
  }, error => {
    this.showFormErrors();
  });
}

// Función para crear las voces
createVoice() {
  const VoiceData = {
    id_voz: 0,
    id: this.data.id,
    id_modelo_voz: this.form.get('id_modelo_voz')?.value,
    similarity_boost: this.form.get('similarity_boost')?.value,
    stability: this.form.get('stability')?.value,
    style: this.form.get('style')?.value,
    use_speaker_boost: this.form.get('use_speaker_boost')?.value,
    optimize_streaming_latency: this.form.get('optimize_streaming_latency')?.value,
    nombre_voz: '',
    instrucciones: '',
    instruccion_saludo_despedida: '',
    instruccion_personalidad: '',
    modelo_predeterminado: '',
    modelo_actual: 0,
    cambiar_modelo: 0,
    openai: 0,
    id_asistente: '',
    anthropic: 0,
    google: 0,
    llama: 0,
    cic: 0,
    escuchar: 0,
    hablar: 0,
    archivos: 0,
    codigo: 0,
    tavily: 0,
    wikipedia: 0,
    pdf: 0,
    bi: 0,
    video: 0,
    imgurl: '',
    status: 0,
    id_eleven: '',
    ejemplo_voz: '',
    idempresa: 0,
    empresa: '',
    nombre: '',
    descripcion: '',
    empresa_modelo: ''
  };

  this.componentsServicesService.createVoice(VoiceData).subscribe(response => {
    if (response.success) {
      this.successVoice.fire();
      this.voiceCreados = true;
      this.showCreateVoiceButton = false;
    } else {
      console.error('Error al crear la Voz:', response.message);
    }
  }, error => {
    this.showFormErrors();
  });
}

  // Método para mostrar los errores del formulario
  showFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
    });
  }

  // Método para manejar el envío del segundo formulario (Archivos)
  onSubmitFileForm() {
    if (this.fuente && this.asistente && this.proposito && this.archivo) {
      const formData = new FormData();
      formData.append('ind', '29'); // Indicación de la operación
      formData.append('fuente', this.fuente);
      formData.append('asistente', this.asistente);
      formData.append('proposito', this.proposito);
      formData.append('archivo', this.archivo);

      // Añadir datos del usuario autenticado
      // formData.append('idUser', this.userAuthData.idUser.toString());
      // formData.append('idPerfil', this.userAuthData.idPerfil?.toString() || '');

      this.contactsParamsService.sendFileData(formData).subscribe({
        next: (response) => {
          this.documentSuccess.fire();
        },
        error: (error) => {
          console.error('Error al cargar el documento:', error);
          this.documentError.fire();
        }
      });
    } else {
      this.formWarning.fire();
    }
  }

  // Método para capturar el archivo seleccionado
  onFileSelected(event: any) {
    this.archivo = event.target.files[0] || null;
  }

  collapsePanel(...panels: MatExpansionPanel[]) {
    panels.forEach(panel => panel.close());
  }

  close(): void {
    this.dialogRef.close();
  }

}
