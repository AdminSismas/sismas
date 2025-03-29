// Angular framework
import { ChangeDetectorRef } from '@angular/core';
import { Component, Inject, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// Vex
// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
// Custom
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { ComponentsServicesService } from '../components.services.service';

@Component({
  selector: 'vex-assistants-edit',
  templateUrl: './contacts-edit.component.html',
  styleUrls: ['./contacts-edit.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    // Material
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
  ]
})
export class AssistantsEditComponent implements OnInit {
  @Output() assistantUpdated = new EventEmitter<assistantData>();
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('validationWarning') private validationWarning!: SwalComponent;
  @ViewChild('fileTypeError') private fileTypeError!: SwalComponent;
  @ViewChild('successCreate') private successCreate!: SwalComponent;
  @ViewChild('successUpdate') private successUpdate!: SwalComponent;
  @ViewChild('errorCreate') private errorCreate!: SwalComponent;
  @ViewChild('errorUpdate') private errorUpdate!: SwalComponent;
  @ViewChild('generalError') private generalError!: SwalComponent;

  // isEditMode: boolean = false;
  imgurl = '';
  selectedFile: File | null = null;  // Para almacenar el archivo seleccionado

  form : FormGroup;
  empresas: any[] = [];
  mode: 'create' | 'update' = 'create';


  // form = this.fb.group({
  //   idempresa: this.fb.control('', { nonNullable: true }),
  //   nombre: this.fb.control('', { nonNullable: true }),
  //   descripcion: this.fb.control('', { nonNullable: true })
  // });


  constructor(
    // @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(MAT_DIALOG_DATA) public data: assistantData,
    private dialogRef: MatDialogRef<AssistantsEditComponent>,
    private fb: FormBuilder,
    private componentsServicesService: ComponentsServicesService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      id: [this.mode === 'update' && this.data?.id ? this.data.id : null],
      idempresa: [this.data?.idempresa || '', Validators.required],
      nombre: [this.data?.nombre || '', Validators.required],
      descripcion: [this.data?.descripcion || '', Validators.required],
      imgurl: [this.data?.imgurl || ''],
    });
  }

  ngOnInit() {
    if (this.data && this.data.id) {
      // Modo 'update' si defaults tiene un id
      this.mode = 'update';
      this.form.patchValue(this.data);
    } else {
      // Modo 'create' si no hay defaults o no tiene un id
      this.mode = 'create';
    }
    this.traerEmpresas();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationWarning.fire();
      return;
    }
    this.generateAsistants();

    if (this.mode === 'create') {
      this.createAssistant();
    } else if (this.mode === 'update') {
      this.updateAssistant();
    }
  }

  // Método para disparar el input de imagen
  triggerImageInput() {
    if (this.imageInput) {
      this.imageInput.nativeElement.click();
    }
  }

  // Manejo de la selección de la imagen
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imgurl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.fileTypeError.fire();
      }
    }
  }

  updateAssistant() {
    const assistantData: assistantData  = {
      ...this.form.getRawValue(),
      id: this.data.id,
      empresa: this.data.empresa,
      idempresa: this.data.idempresa,
      id_asistente: this.data.id_asistente,
      instrucciones: this.data.instrucciones,
      modelo_predeterminado: this.data.modelo_predeterminado,
      instruccion_saludo_despedida: this.data.instruccion_saludo_despedida,
      instruccion_personalidad: this.data.instruccion_personalidad,
      modelo_actual: this.data.modelo_actual,
      cambiar_modelo: this.data.cambiar_modelo,
      openai: this.data.openai,
      anthropic: this.data.anthropic,
      google: this.data.google,
      llama: this.data.llama,
      cic: this.data.cic,
      escuchar: this.data.escuchar,
      hablar: this.data.hablar,
      archivos: this.data.archivos,
      codigo: this.data.codigo,
      tavily: this.data.tavily,
      wikipedia: this.data.wikipedia,
      pdf: this.data.pdf,
      bi: this.data.bi,
      video: this.data.video,
      imgurl: this.data.imgurl,
      id_voz: this.data.id_voz,
      status: this.data.status,
      id_modelo_voz: this.data.id_modelo_voz,
      similarity_boost: this.data.similarity_boost,
      stability: this.data.stability,
      style: this.data.style,
      use_speaker_boost: this.data.use_speaker_boost,
      optimize_streaming_latency: this.data.optimize_streaming_latency,
      nombre_voz: this.data.nombre_voz,
      id_eleven: this.data.id_eleven,
      ejemplo_voz: this.data.ejemplo_voz,
      empresa_modelo: this.data.empresa_modelo
    };

    // Crear FormData si hay una imagen seleccionada
    let formData: FormData | assistantData ;
    if (this.selectedFile) {
      formData = new FormData();
      for (const key in assistantData) {
        if (assistantData.hasOwnProperty(key)) {
          formData.append(key, (assistantData as any)[key]);
        }
      }
      formData.append('file', this.selectedFile);
    } else {
      formData = assistantData;
    }

    // Lógica de actualización
    if (!this.data.id) {
      throw new Error('NO existe el Asistente a actualizar. Por favor, inténtalo de nuevo más tarde.');
    }

    this.componentsServicesService.updateAssistant(this.data.id, formData).subscribe({
      next: response => {
        if (response) {
          this.successUpdate.fire().then(() => {
            this.assistantUpdated.emit({
              ...this.data,
              ...formData
            });
            this.dialogRef.close(formData);
          });
        } else {
          this.errorUpdate.fire();
        }
      },
      error: err => {
        this.generalError.fire();
      }
    });
  }


  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }


  traerEmpresas(){
    this.componentsServicesService.consultarEmpresas().subscribe({
      next: response => {
        this.empresas = response.data;  // Asigna las empresas obtenidas a la variable
      },
      error: err => {
        console.error('Error al consultar las empresas:', err);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  generateAsistants() {
    // Crear el objeto con todos los campos de la interfaz pero solo asignar valores a los que necesitas
    const generateAssistant: assistantData = {
      id: 0, // Asigna valores por defecto
      idempresa: this.form.get('idempresa')?.value || 1,
      empresa: '',
      id_asistente: '',
      nombre: this.form.get('nombre')?.value,
      descripcion: '',
      instrucciones: '',
      instruccion_saludo_despedida: '',
      instruccion_personalidad: '',
      modelo_predeterminado: '',
      modelo_actual: this.form.get('modelo_actual')?.value || 1,
      cambiar_modelo: 0,
      openai: 0,
      anthropic: 0,
      google: 0,
      llama: 0,
      cic: 0,
      escuchar: 0,
      hablar: 0,
      archivos: this.form.get('archivos')?.value || 1,
      codigo: this.form.get('codigo')?.value || 1,
      tavily: 0,
      wikipedia: 0,
      pdf: 0,
      bi: 0,
      video: 0,
      imgurl: this.form.get('imgurl')?.value || '',
      id_voz: 0,
      status: 1,
      id_modelo_voz: 0,
      similarity_boost: '',
      stability: '',
      style: '',
      use_speaker_boost: '',
      optimize_streaming_latency: '',
      nombre_voz: '',
      id_eleven: '',
      ejemplo_voz: '',
      empresa_modelo: ''
    };
    // Enviar el objeto completo
    this.componentsServicesService.generateAsistants(generateAssistant).subscribe({
      next: response => {
        if (response.success) {
          this.dialogRef.close(response.data);
          this.successCreate.fire();
        } else {
          this.errorCreate.fire();
        }
      },
      error: err => {
        this.generalError.fire();
      }
    });
  }


  createAssistant() {
    const assistantData = new FormData();
    assistantData.append('idempresa', this.form.get('idempresa')?.value);
    assistantData.append('nombre', this.form.get('nombre')?.value);
    assistantData.append('descripcion', this.form.get('descripcion')?.value);

    // Agregar el archivo si se seleccionó uno
    if (this.selectedFile) {
      assistantData.append('file', this.selectedFile);
    }

    this.componentsServicesService.createAssistant(assistantData).subscribe({
      next: response => {
        if (response.success) {
          this.dialogRef.close(response.data);
          this.successCreate.fire();
        } else {
          this.errorCreate.fire();
        }
      },
      error: err => {
        this.generalError.fire();
      }
    });
  }
}

