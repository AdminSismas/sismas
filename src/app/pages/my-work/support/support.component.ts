import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger80ms } from '@vex/animations/stagger.animation';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { ModuloName } from '../../../features/support/models/modulos.model';
import { supportData } from '../../../features/support/models/support.model';
import { VistaName } from '../../../features/support/models/vistas.model';
import { SupportService } from '../../../features/support/services/support.service';
import { ObservationsData } from '../../../features/support/models/observations.model';
import { StatusData } from '../../../features/support/models/status.model';
import { SupportLogs } from '../../../features/support/models/supportLogs.model';
import { SupportLogsService } from '../../../features/support/services/support-logs/support-logs.service';
import { SupportLogsComponent } from '../../../features/support/components/support_logs/support-logs.component';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Link } from '@vex/interfaces/link.interface';
import { MatTabsModule } from '@angular/material/tabs';
import { Modulo, Subvista, Vista } from '../../../features/support/models/module.model';
import { MODULES } from '../../../features/support/constants/modules.constant';
import { UserService } from '@shared/services/auth/user.service';
import { DecodeJwt } from '@features/configuration/interfaces/users/user-details.model';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { SupportFormValues } from '../../../features/support/interfaces/form-values.interfaces';

@Component({
  selector: 'vex-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
  animations: [stagger80ms, fadeInUp400ms, scaleIn400ms, fadeInRight400ms],
  standalone: true,
  imports: [
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
    RouterModule,
    NgxDropzoneModule
  ]
})
export class SupportComponent implements OnInit {
  // @Output() refreshLogs: EventEmitter<supportData> = new EventEmitter<supportData>();
  @Output() refreshLogs: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(SupportLogsComponent) supportLogsComponent!: SupportLogsComponent;
  // @Output() userUpdated = new EventEmitter<UserAuthData>();
  // currentUser: UserAuthData | null = null;
  // subject$: BehaviorSubject<UserAuthData[]> = new BehaviorSubject<UserAuthData[]>([]);
  verticalAccountFormGroup!: FormGroup;
  file: File | null = null;
  moduleName: ModuloName[] = []; // Define the property to hold modules names
  modulo: Modulo[] = [];
  vista: Vista[] = [];
  subvista: Subvista[] = [];
  user: DecodeJwt | null = null;
  userID: number | null = null;
  uploadedFiles: File[] = [];

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
    // {
    //   label: 'Respuesta de soportes',
    //   route: './answer-support'
    // },
  ];
  constructor(
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    // private authService: AuthService,
    private supportService: SupportService,
    private supportLogsService: SupportLogsService,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {
    this.verticalAccountFormGroup = this.fb.group({
      observacion: ['', Validators.required],
      titulo: ['', Validators.required],
      asunto: ['', Validators.required],
      id_modulo: ['', Validators.required],
      id_vista: ['', Validators.required],
      id_subvista: [''],
      file: [''],
      // nombre: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.user = this.userService.getUser();
    this.userID = this.userService.getUserData();

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
    //     this.cd.detectChanges();
    //   },
    //   error: err => {
    //     console.error("Error fetching support logs:", err);
    //   }
    // });
  }
  loadModulos() {
    this.modulo = MODULES.map((modulo) => new Modulo(modulo));
  }

  loadVistas(id_modulo: number) {
    this.supportService.getVistas(id_modulo).subscribe((response) => {
        if (response.success) {
            this.viewName = response.data || [];
             this.cd.detectChanges();
        }
    });
  }

  onModuleSelect(moduleId: number) {
    this.verticalAccountFormGroup.get('id_vista')?.reset();
    this.verticalAccountFormGroup.get('id_subvista')?.reset();
    this.vista = this.modulo.find(m => m.id === moduleId)?.vistas || [];
    this.subvista = [];
  }

  onVistaSelect(vistaId: number) {
    this.verticalAccountFormGroup.get('id_subvista')?.reset();
    const selectedVista = this.vista.find(v => v.id === vistaId);
    this.subvista = selectedVista?.subvistas || [];
  }

  refreshData() {
    this.supportLogsService.getSupportLogs().subscribe(response => {
      if (response.success && response.data) {
        this.supportLogsList = response.data as SupportLogs[];
        this.subjectSupportLogsList$.next(this.supportLogsList);
        this.cd.markForCheck();
        this.cd.detectChanges();
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
    if (this.verticalAccountFormGroup.valid) {
      const formData: SupportFormValues = this.verticalAccountFormGroup.value;
      formData.id_cliente = this.userID!;
      this.supportService.insertTicket(formData).subscribe(response => {
        if (response.success) {
          Swal.fire({
            title: '¡Solicitud enviada!',
            text: 'Tu solicitud ha sido enviada correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              //                                                               this.refreshData();
              this.resetForm();
              this.supportLogsComponent.fetchTickets();

            }
          });
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'Ha ocurrido un error al enviar tu solicitud',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });



    }

  }


  resetForm() {
    this.verticalAccountFormGroup.reset();
    Object.keys(this.verticalAccountFormGroup.controls).forEach((controlName) => {
      const control = this.verticalAccountFormGroup.get(controlName);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.setErrors(null);
      }
    });
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    const file = event.addedFiles.filter((nuevoArchivo: File) => {

      return !this.uploadedFiles.some((archivoExistente: File) =>
        archivoExistente.name === nuevoArchivo.name && archivoExistente.size === nuevoArchivo.size
      );
    });

    if (file.length < event.addedFiles.length) {

      console.warn('Algunos archivos ya han sido seleccionados anteriormente.');
      this.snackbar.open('Algunos archivos ya están seleccionados.', 'OK', { duration: 10000 });
    }
    this.uploadedFiles.push(...file);
    this.verticalAccountFormGroup.patchValue({
      file: this.uploadedFiles
    });
    this.verticalAccountFormGroup.get('file')?.updateValueAndValidity();
  }

  onRemove(event: File) {
    const index = this.uploadedFiles.indexOf(event);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }



}
