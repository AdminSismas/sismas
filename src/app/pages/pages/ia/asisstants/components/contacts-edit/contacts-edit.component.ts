import { Component, Inject, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor } from '@angular/common';
import { ComponentsServicesService } from '../components.services.service';
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { ChangeDetectorRef } from '@angular/core';
import { debug } from 'console';

@Component({
  selector: 'vex-assistants-edit',
  templateUrl: './contacts-edit.component.html',
  styleUrls: ['./contacts-edit.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class AssistantsEditComponent implements OnInit {
  @Output() assistantUpdated = new EventEmitter<assistantData>();
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  // isEditMode: boolean = false;
  imgurl: string = '';
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
      console.log('Defaults UPDATE:', this.data);
      this.form.patchValue(this.data);
    } else {
      // Modo 'create' si no hay defaults o no tiene un id
      this.mode = 'create';
      console.log('Modo CREATE');
    }
    this.traerEmpresas()


    // if (this.data && this.data.id) {
    //   this.isEditMode = true;  // Modo de edición
    //   this.form.patchValue({
    //     idempresa: this.data.idempresa,
    //     nombre: this.data.nombre,
    //     descripcion: this.data.descripcion
    //   });
    //   this.imgurl = this.data.imgurl;
    // } else {
    //   this.isEditMode = false;  // Modo de inserción
    // }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor, completa todos los campos requeridos antes de continuar.',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }
    this.generateAsistants();

    // Si el formulario es válido, procede con la lógica correspondiente
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
        this.selectedFile = file; // Guarda el archivo seleccionado para el envío
        const reader = new FileReader();
        reader.onload = () => {
          this.imgurl = reader.result as string; // Mostrar la imagen seleccionada
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El archivo seleccionado no es una imagen.',
        });
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
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Asistente actualizado correctamente',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            this.assistantUpdated.emit({
              ...this.data,
              ...formData
            });
            this.dialogRef.close(formData);
            });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al actualizar el Asistente: ' + response,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          console.log('Error al actualizar el Asistente: ' + response);
        }
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar el Asistente. Por favor, inténtalo de nuevo más tarde.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    });
  }



  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }


  // updateAssistant() {
  //   // Creamos el objeto con los datos actuales del asistente
  //   const assistantData: assistantData = {
    //     ...this.form.getRawValue(),
    //     id: this.data.id,
    //     empresa: this.data.empresa,
    //     idempresa: this.data.idempresa,
    //     id_asistente: this.data.id_asistente,
    //     instrucciones: this.data.instrucciones,
  //     modelo_predeterminado: this.data.modelo_predeterminado,
  //     instruccion_saludo_despedida: this.data.instruccion_saludo_despedida,
  //     instruccion_personalidad: this.data.instruccion_personalidad,
  //     modelo_actual: this.data.modelo_actual,
  //     cambiar_modelo: this.data.cambiar_modelo,
  //     openai: this.data.openai,
  //     anthropic: this.data.anthropic,
  //     google: this.data.google,
  //     llama: this.data.llama,
  //     cic: this.data.cic,
  //     escuchar: this.data.escuchar,
  //     hablar: this.data.hablar,
  //     archivos: this.data.archivos,
  //     codigo: this.data.codigo,
  //     tavily: this.data.tavily,
  //     wikipedia: this.data.wikipedia,
  //     pdf: this.data.pdf,
  //     bi: this.data.bi,
  //     video: this.data.video,
  //     imgurl: this.data.imgurl,
  //     id_voz: this.data.id_voz,
  //     status: this.data.status,
  //     id_modelo_voz: this.data.id_modelo_voz,
  //     similarity_boost: this.data.similarity_boost,
  //     stability: this.data.stability,
  //     style: this.data.style,
  //     use_speaker_boost: this.data.use_speaker_boost,
  //     optimize_streaming_latency: this.data.optimize_streaming_latency,
  //     nombre_voz: this.data.nombre_voz,
  //     id_eleven: this.data.id_eleven,
  //     ejemplo_voz: this.data.ejemplo_voz,
  //     empresa_modelo: this.data.empresa_modelo
  //   };

  //   // Si hay una imagen cargada, creamos un FormData
  //   let formData: FormData | assistantData;

  //   if (this.selectedFile) {
    //     formData = new FormData();

  //     // Agregar los datos del asistente al FormData
  //     for (const key in assistantData) {
  //       if (assistantData.hasOwnProperty(key)) {
  //         formData.append(key, (assistantData as any)[key]); // Agregamos los datos al FormData
  //       }
  //     }

  //     // Agregar la imagen al FormData
  //     formData.append('file', this.selectedFile); // 'file' es el campo que usará el backend para recibir la imagen
  //   } else {
    //     // Si no hay imagen, simplemente usamos el objeto assistantData
    //     formData = assistantData;
    //   }

  //   // Verifica si es modo de edición o creación
  //   if (this.isEditMode) {
  //     // Actualizar asistente existente
  //     this.componentsServicesService.updateAssistant(this.data.id, formData).subscribe(
  //       (response) => {
  //         if (response.success && response.data) {
  //           this.assistantUpdated.emit(response.data);
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Éxito',
  //             text: 'Asistente actualizado correctamente',
  //             timer: 2500,
  //           });
  //           this.dialogRef.close(response);
  //         } else {
    //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: 'Error al actualizar el asistente',
  //             timer: 2500,
  //           });
  //         }
  //       },
  //       (error) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'Error al actualizar el asistente',
  //         });
  //       }
  //     );
  //   } else {
    //     // Insertar nuevo asistente
  //     this.componentsServicesService.createAssistant(formData).subscribe(
  //       (response) => {
  //         if (response.success && response.data) {
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Éxito',
  //             text: 'Asistente creado correctamente',
  //           });
  //           this.dialogRef.close(response);
  //         } else {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: 'Error al crear el asistente',
  //           });
  //         }
  //       },
  //       (error) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'Error al crear el asistente',
  //         });
  //       }
  //     );
  //   }
  // }


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


  // generateAsistants() {
  //       // Crear el objeto con todos los campos de la interfaz pero solo asignar valores a los que necesitas
  //       const generateAssistant: assistantData = {
  //         id: 0, // Asigna valores por defecto
  //         idempresa: 0,
  //         empresa: '',
  //         id_asistente: '',
  //         nombre: this.form.get('nombre')?.value,
  //         descripcion: '',
  //         instrucciones: '',
  //         instruccion_saludo_despedida: '',
  //         instruccion_personalidad: '',
  //         modelo_predeterminado: '',
  //         modelo_actual: this.form.get('modelo_actual')?.value || 1,
  //         cambiar_modelo: 0,
  //         openai: 0,
  //         anthropic: 0,
  //         google: 0,
  //         llama: 0,
  //         cic: 0,
  //         escuchar: 0,
  //         hablar: 0,
  //         archivos: this.form.get('archivos')?.value || 1,
  //         codigo: this.form.get('codigo')?.value || 1,
  //         tavily: 0,
  //         wikipedia: 0,
  //         pdf: 0,
  //         bi: 0,
  //         video: 0,
  //         imgurl: '',
  //         id_voz: 0,
  //         status: 0,
  //         id_modelo_voz: 0,
  //         similarity_boost: '',
  //         stability: '',
  //         style: '',
  //         use_speaker_boost: '',
  //         optimize_streaming_latency: '',
  //         nombre_voz: '',
  //         id_eleven: '',
  //         ejemplo_voz: '',
  //         empresa_modelo: ''
  //       };
  //       // Enviar el objeto completo
  //       this.componentsServicesService.generateAsistants(generateAssistant).subscribe({
  //         next: response => {
  //           console.log('Response:', response);

  //           if (response.success) {
  //             this.dialogRef.close(response.data);
  //             Swal.fire({
  //               icon: 'success',
  //               title: 'Éxito',
  //               text: 'Asistente creado correctamente',
  //               timer: 2000,
  //               timerProgressBar: true,
  //               showConfirmButton: false
  //             });
  //           } else {
    //             console.log('Error al crear el Asistente: ' + response.message);
    //             Swal.fire({
      //               icon: 'error',
  //               title: 'Error',
  //               text: 'Error al crear el Asistente',
  //               timer: 2500,
  //               timerProgressBar: true,
  //               showConfirmButton: false
  //             });
  //           }
  //         },
  //         error: err => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: 'Hubo un error al crear el Asistente. Por favor, inténtalo de nuevo más tarde.',
  //             timer: 2500,
  //             timerProgressBar: true,
  //             showConfirmButton: false
  //           });
  //         }
  //       });
  //     }
  //   }

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
        console.log('Response:', response);

        if (response.success) {
          this.dialogRef.close(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Asistente creado correctamente',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          console.log('Error al crear el Asistente: ' + response.message);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el Asistente',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el Asistente. Por favor, inténtalo de nuevo más tarde.',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });
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
        console.log('Response:', response);
        if (response.success) {
          this.dialogRef.close(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Asistente creado correctamente',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          console.log('Error al crear el Asistente: ' + response.message);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear el Asistente',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        }
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al crear el asistente. Por favor, inténtalo de nuevo más tarde.',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    });
  }


}

