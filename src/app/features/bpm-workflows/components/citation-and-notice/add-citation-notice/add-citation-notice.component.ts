import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProcessParticipant } from '@features/bpm-workflows/models/process-participant';
import {
  CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED,
  CONSTANTE_TYPE_PROCESS_PARTICIPANT_NOTIFIED,
  MY_DATE_FORMATS,
  NAME_NO_DISPONIBLE
} from '@shared/constants/constants';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ComboboxCollectionFormComponent } from '@shared/utils/combobox-collection-form/combobox-collection-form.component';
import { ProceduresService } from '@shared/services/general/procedures.service';
import { ProceduresCollection } from '@features/tasks/models/procedures-progress.model';
import { TextAreaComponent } from '@shared/utils/text-area/text-area.component';
import { ParticipantsService } from '@features/bpm-workflows/services/core/participants-service.service';
import Swal from 'sweetalert2';
import { ProcessParticipantTableMenu } from '@features/bpm-workflows/models/citation-and-notice/info-participants.interface';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { InfoContact } from '@features/property-management/models/owner/info-contact';
import { PeopleService } from '@features/property-management/services/property/people.service';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { CreatePeopleComponent } from '@features/operation-support/components/people/create-people/create-people.component';

@Component({
  selector: 'vex-add-citation-notice',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent,
    TitleCasePipe,
    MatDialogTitle,
    ComboboxCollectionFormComponent,
    DatePipe,
    TextAreaComponent,
    MatSlideToggle,
    MatRadioModule
  ],
  templateUrl: './add-citation-notice.component.html',
  styleUrl: './add-citation-notice.component.scss',
  providers: [
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AddCitationNoticeComponent implements OnInit {
  labelCited = 'Datos de citacion';
  labelNotice = 'Datos de notificacion';

  /* ---- Injects ---- */
  private readonly dialog = inject(MatDialog);

  /* ---- Signals ---- */
  maxDate = signal<Date>(new Date()); // Fecha máxima permitida (hoy)
  minDate = signal<Date>(new Date(0)); // Fecha minima, fecha de la radicacion
  typeCategory = signal<ProcessParticipantTableMenu['id']>('citation');
  isHireCitation = signal<boolean>(false);

  /* ---- Zone states ----- */
  executionId!: string;
  participant?: ProcessParticipant;
  participationId!: number;
  individualId!: number;
  procedure: ProceduresCollection | null = null;
  contact!: InfoContact;

  formCitation: FormGroup = this.fb.group({
    guvId: [this.processParticipant?.viaGubernativa?.guvId || ''],
    domCitationMethod: [
      this.processParticipant?.viaGubernativa?.domCitationMethod || '',
      Validators.required
    ],
    citationDate: [
      this.processParticipant?.viaGubernativa?.citationDate || '',
      Validators.required
    ],
    citationNote: [
      this.processParticipant?.viaGubernativa?.citationNote || false,
      Validators.required
    ],
    isCitationHire: [false, Validators.required],
    hireContact: ['', []]
  });

  formNotification: FormGroup = this.fb.group({
    guvId: [this.processParticipant?.viaGubernativa?.guvId || ''],
    domNotificationMethod: [
      this.processParticipant?.viaGubernativa?.domNotificationMethod || '',
      Validators.required
    ],
    notificationDate: [
      this.processParticipant?.viaGubernativa?.notificationDate || '',
      Validators.required
    ],
    notificationNote: [
      this.processParticipant?.viaGubernativa?.notificationNote || '',
      Validators.required
    ],
    resignationTerms: [
      this.processParticipant?.viaGubernativa?.resignationTerms,
      Validators.required
    ]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public processParticipant: ProcessParticipant,
    private dialogRef: MatDialogRef<AddCitationNoticeComponent>,
    private fb: FormBuilder,
    private readonly procedureService: ProceduresService,
    private readonly participantsService: ParticipantsService,
    private peopleService: PeopleService
  ) {}

  ngOnInit() {
    if (
      this.processParticipant == null ||
      this.processParticipant.participationId == null
    ) {
      return;
    }
    this.participationId = this.processParticipant.participationId;
    this.individualId = this.processParticipant?.individual?.individualId;
    if (this.processParticipant?.typeCategory) {
      this.typeCategory.set(this.processParticipant.typeCategory);
    }
    if (this.processParticipant?.executionId) {
      this.executionId = this.processParticipant?.executionId;
      this.getContactParticipation();
    }
  }

  getContactParticipation() {
    this.peopleService.getContactByIndividualId(this.individualId).subscribe({
      next: (res: InfoContact) => {
        this.contactParticipation(res);
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          text: 'La información de contacto del participante no existe.',
          timer: 5000
        });
        return;
      }
    });
  }

  contactParticipation(res: InfoContact) {
    this.contact = res;

    if (!this.contact) {
      Swal.fire({
        icon: 'error',
        text: 'El participante no tiene información de contacto.',
        timer: 20000
      });
      return;
    }

    const warningMessages: Record<'phoneNumber' | 'address' | 'email', string> =
      {
        phoneNumber: 'número de teléfono',
        address: 'dirección',
        email: 'correo electrónico'
      };

    const { phoneNumber, address, email } = this.contact;

    const warningMessagesArray = [
      !phoneNumber ? warningMessages.phoneNumber : '',
      !address ? warningMessages.address : '',
      !email ? warningMessages.email : ''
    ].filter(Boolean);

    if (warningMessagesArray.length > 0) {
      Swal.fire({
        icon: 'warning',
        text:
          'El participante no tiene información de: ' +
          warningMessagesArray.join(', '),
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3085d6',
        timer: 20000
      });
    }

    this.obtainProcedure();
  }

  obtainProcedure(): void {
    this.procedureService.getProcedure(this.executionId).subscribe({
      next: (result: ProceduresCollection) => {
        this.procedure = result;
        if (this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED) {
          if (result.dueDate) {
            this.minDate.set(new Date(result.beginAt!));
          }
        } else if (
          this.processParticipant?.viaGubernativa?.citationDate &&
          this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_NOTIFIED
        ) {
          this.minDate.set(
            new Date(this.processParticipant?.viaGubernativa?.citationDate)
          );
        }
        if (
          this.processParticipant?.viaGubernativa &&
          this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED
        ) {
          this.formCitation.patchValue(this.processParticipant?.viaGubernativa);
        } else if (
          this.processParticipant?.viaGubernativa &&
          this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_NOTIFIED
        ) {
          this.formNotification.patchValue(
            this.processParticipant?.viaGubernativa
          );
        }
      }
    });
  }

  save() {
    if (this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED) {
      this.saveCitation();
    } else if (
      this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_NOTIFIED
    ) {
      this.saveNotified();
    }
  }

  saveCitation() {
    if (this.formCitation.invalid || !this.participationId) {
      if (this.controlCitationNote.invalid) {
        this.getAlertError('Error, Ingresar informacion en el campo nota');
      }
      return;
    }
    const form = this.formCitation.getRawValue();
    this.participantsService
      .updateGovernmentalChannelCitedParticipantByExecutionId(
        this.executionId,
        form,
        this.participationId
      )
      .subscribe({
        next: () => {
          const msg: string =
            this.processParticipant.fullName +
            ' ' +
            'Citado correctamente por via: ' +
            this.controlDomCitationMethod.value;
          this.getAlertSuccess(msg);
          this.dialogRef.close(true);
        },
        error: () =>
          this.getAlertError(
            'Error al citar el participante: ' +
              this.processParticipant.fullName
          )
      });
  }

  saveNotified() {
    if (
      this.controlResignationTerms.value === null ||
      this.controlResignationTerms.value === undefined
    ) {
      this.controlResignationTerms.setValue(false);
    }

    if (this.formNotification.invalid || !this.participationId) {
      if (this.controlNotificationNote.invalid) {
        this.getAlertError('Error, Ingresar informacion en el campo nota');
      }
      return;
    }
    const form = this.formNotification.getRawValue();
    this.participantsService
      .updateGovernmentalChannelNotifiedParticipantByExecutionId(
        this.executionId,
        form,
        this.participationId
      )
      .subscribe({
        next: () => {
          const msg: string =
            this.processParticipant.fullName +
            ' ' +
            'Citado correctamente por via: ' +
            this.controlDomCitationMethod.value;
          this.getAlertSuccess(msg);
          this.dialogRef.close(true);
        },
        error: () =>
          this.getAlertError(
            'Error al citar el participante: ' +
              this.processParticipant.fullName
          )
      });
  }

  get controlDomCitationMethod() {
    return this.formCitation.get('domCitationMethod') as FormControl;
  }

  get controlCitationDate() {
    return this.formCitation.get('citationDate') as FormControl;
  }

  get controlCitationNote() {
    return this.formCitation.get('citationNote') as FormControl;
  }

  get controlDomNotificationMethod() {
    return this.formNotification.get('domNotificationMethod') as FormControl;
  }

  get controlNotificationDate() {
    return this.formNotification.get('notificationDate') as FormControl;
  }

  get controlNotificationNote() {
    return this.formNotification.get('notificationNote') as FormControl;
  }

  get controlResignationTerms() {
    return this.formNotification.get('resignationTerms') as FormControl;
  }

  get activeTypeCategoryForm(): FormGroup {
    if (this.typeCategory() === CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED) {
      return this.formCitation;
    }
    return this.formNotification;
  }

  getAlertSuccess(text: string) {
    Swal.fire({
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    }).then();
  }

  getAlertError(text: string) {
    Swal.fire({
      title: '¡Error!',
      text: text,
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    }).then();
  }

  getAlertErrorConfirm(text: string) {
    Swal.fire({
      title: '¡Error!',
      text: text,
      icon: 'error',
      showConfirmButton: true
    }).then(() => this.dialogRef.close(true));
  }

  editContactInformation() {
    this.peopleService
      .getPersonByIndividualId(`${this.individualId}`)
      .subscribe((infoPerson) => {
        this.dialog.open(CreatePeopleComponent, {
          data: {
            mode: 'contact',
            infoPerson,
            contact: this.contact
          }
        });
      });
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED =
    CONSTANTE_TYPE_PROCESS_PARTICIPANT_CITED;
  protected readonly CONSTANTE_TYPE_PROCESS_PARTICIPANT_NOTIFIED =
    CONSTANTE_TYPE_PROCESS_PARTICIPANT_NOTIFIED;
}
