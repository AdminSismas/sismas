import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger80ms } from '@vex/animations/stagger.animation';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ModuloName } from './model/modulos.model';
import { supportData } from './model/support.model';
import { VistaName } from './model/vistas.model';
import { SupportService } from './service/support.service';
import { ObservationsData } from './support_logs/model/observations.model';
import { StatusData } from './support_logs/model/status.model';
import { SupportLogs } from './support_logs/model/supportLogs.model';
import { SupportLogsService } from './support_logs/service/support-logs.service';
import { SupportLogsComponent } from './support_logs/support-logs.component';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Link } from '@vex/interfaces/link.interface';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'vex-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
  standalone: true,
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgIf,
    MatCheckboxModule,
    MatSnackBarModule,
    SupportLogsComponent,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    MatTabsModule,
    RouterModule
  ]
})
export class SupportComponent implements OnInit {
  @Output() refreshLogs: EventEmitter<supportData> = new EventEmitter<supportData>();
  // @Output() userUpdated = new EventEmitter<UserAuthData>();
  // currentUser: UserAuthData | null = null;
  // subject$: BehaviorSubject<UserAuthData[]> = new BehaviorSubject<UserAuthData[]>([]);
  verticalAccountFormGroup!: FormGroup;
  moduleName: ModuloName[] = []; // Define the property to hold modules names
  viewName: VistaName[] = []; // Define the property to hold views names
  statusName: StatusData[] = []; // Define the property to hold status names
  observations: ObservationsData[] = []; // Define the property to hold observations
  supportLogsList: SupportLogs[] = []; // Define the property to hold all support
  supportData: supportData[] = []; // Define the property to hold all support data
  subjectSupportData$: BehaviorSubject<supportData[]> = new BehaviorSubject<supportData[]>([]);
  subjectSupportLogsList$: BehaviorSubject<SupportLogs[]> = new BehaviorSubject<SupportLogs[]>([]);
  activeLinkIndex = 0;

  links: Link[] = [
    {
      label: 'Solicitud de soportes',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Respuesta de soportes',
      route: './answer-support'
    },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    // private authService: AuthService,
    private supportService: SupportService,
    private supportLogsService: SupportLogsService
  ) {
    this.verticalAccountFormGroup = this.fb.group({
      observacion: ['', Validators.required],
      id_modulo: ['', Validators.required],
      id_vista: ['', Validators.required],
      nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {

 
    this.loadModulos(); //return data
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  loadSupportLogs() {
    // // if (!this.currentUser) {
    // //   console.error("Cannot load logs: User not logged in");
    // //   return;
    // // }
    // this.supportService.getSupportLogs().pipe(
    //   map(response => {
    //     if (response.data) {
    //       // Filter logs based on the logged-in user
    //       return response.data.filter(log => log.id_empleado === this.currentUser?.idEmp);
    //     }
    //     return [];
    //   })
    // ).subscribe({
    //   next: filteredLogs => {
    //     this.subjectSupportLogsList$.next(filteredLogs);
    //     console.log("Filtered Logs:", filteredLogs);
    //     this.cd.detectChanges();
    //   },
    //   error: err => {
    //     console.error("Error fetching support logs:", err);
    //   }
    // });
  }
  loadModulos() {
    this.supportService.getModulos().subscribe((response) => {
        if (response.success) {
            this.moduleName = response.data || [];
            this.cd.detectChanges();
        }
    });
  }

  loadVistas(id_modulo: number) {
    this.supportService.getVistas(id_modulo).subscribe((response) => {
        console.log("response_getvistas_supportcomponent", response)
        if (response.success) {
            this.viewName = response.data || [];
             this.cd.detectChanges();
        }
    });
  }

  onModuleSelect(moduleId: number) {
    this.loadVistas(moduleId);
  }

  refreshData() {
    this.supportLogsService.getSupportLogs().subscribe(response => {
      if (response.success && response.data) {
        this.supportLogsList = response.data as SupportLogs[];
        this.subjectSupportLogsList$.next(this.supportLogsList);
        this.cd.markForCheck();
        this.cd.detectChanges(); // Force refresh
      }
    });

    this.supportLogsService.getObservationsSupport().subscribe(response => {
      if (response.success && response.data) {
        this.observations = response.data as ObservationsData[];
        this.cd.markForCheck();
      }
    });

    this.supportLogsService.getStatuses().subscribe(response => {
      if (response.success && response.data) {
        this.statusName = response.data as StatusData[];
        this.cd.markForCheck();
      }
    });
  }

  onSubmit() {
    // if (this.verticalAccountFormGroup.valid) {
    //   const formData = this.verticalAccountFormGroup.value;
    //   console.log('FormData:', formData);

    //   // Add id_empleado to formData
    //   if (this.currentUser && this.currentUser.idEmp) {
    //     formData.id_empleado = this.currentUser.idEmp;
    //   } else {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'No se pudo obtener el ID del empleado.',
    //     });
    //     return;
    //   }

    //   // Mostrar SweetAlert de carga
    //   Swal.fire({
    //     title: 'Enviando solicitud...',
    //     text: 'Por favor espera mientras procesamos tu solicitud.',
    //     icon: 'info',
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //       Swal.showLoading();
    //     }
    //   });

    //   // Crear solicitud de soporte
    //   this.supportService.createSupportRequest(formData).subscribe(
    //     response => {
    //       if (response.success) {
    //         const { vista_name = '', modulo_name = '', nombre = '', observacion = '' } = {
    //           ...response.data,
    //           ...formData,
    //         };
    //         console.log('Solicitud de soporte creada DATA RESPONSE:', response.data);
    //         console.log('Solicitud de soporte creada FORMDATA:', formData);
            
    //         // Resetear formulario con valores iniciales y limpiar validaciones
    //         this.resetForm();

    //         this.refreshData(); // Refrescar los datos

    //         // Enviar correo
    //         this.supportService.sendEmail(vista_name, modulo_name, nombre, observacion).subscribe(
    //           emailResponse => {
    //             Swal.close();
    //             if (emailResponse.success) {
    //               Swal.fire({
    //                 icon: 'success',
    //                 title: '¡Éxito!',
    //                 text: 'Solicitud de soporte y correo enviados con éxito.',
    //                 timer: 3000,
    //                 showConfirmButton: false,
    //                 timerProgressBar: true
    //               });
    //             } else {
    //               Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'Error al enviar el correo.',
    //               });
    //             }
    //           },
    //           error => {
    //             Swal.close();
    //             Swal.fire({
    //               icon: 'error',
    //               title: 'Error',
    //               text: `Error al enviar el correo: ${error.message}`,
    //             });
    //           }
    //         );
    //       } else {
    //         Swal.close();
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error',
    //           text: 'Error al crear la solicitud de soporte.',
    //         });
    //       }
    //     },
    //     error => {
    //       Swal.close();
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Error',
    //         text: `Error al enviar la solicitud de soporte: ${error.message}`,
    //       });
    //     }
    //   );
    // } else {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: 'Formulario incompleto',
    //     text: 'Por favor completa todos los campos correctamente.',
    //   });
    // }
  }

  // Método para resetear el formulario
  resetForm() {
    // Resetear con valores iniciales
    this.verticalAccountFormGroup.reset({
      observacion: '',
      id_modulo: '',
      id_vista: '',
      nombre: ''
    });

    // Limpiar estados de validación
    Object.keys(this.verticalAccountFormGroup.controls).forEach(key => {
      const control = this.verticalAccountFormGroup.get(key);
      if (control) {
        control.setErrors(null); // Eliminar errores
        control.markAsPristine(); // Marcar como limpio
        control.markAsUntouched(); // Marcar como no tocado
      }
    });
    this.verticalAccountFormGroup.updateValueAndValidity(); // Actualizar estado general del formulario
  }
}
