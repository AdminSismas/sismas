import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal
} from '@angular/core';
import { ProcessParticipant } from '@shared/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRippleModule, ThemePalette } from '@angular/material/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import {
  MODAL_DYNAMIC_HEIGHT,
  MODAL_MEDIUM,
  NAME_NO_DISPONIBLE
} from '@shared/constants';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddCitationNoticeComponent } from '../add-citation-notice/add-citation-notice.component';
import Swal from 'sweetalert2';
import { CitationNoticeTypePipe } from './pipes/citation-notice-type.pipe';
import { CitationNoticeClassPipe } from './pipes/citation-notice-class.pipe';
import {
  CitationNoticeService,
  GuvStateType
} from '../../service/citation-notice.service';
import { DocumentViewerComponent } from 'src/app/apps/components/general-components/document-viewer/document-viewer.component';

@Component({
  selector: 'vex-citation-notice-card',
  standalone: true,
  imports: [
    CitationNoticeClassPipe,
    CitationNoticeTypePipe,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatTooltip,
    NgClass,
    TitleCasePipe
  ],
  templateUrl: './citation-notice-card.component.html',
  styleUrl: './citation-notice-card.component.scss'
})
export class CitationNoticeCardComponent implements OnInit {
  // Inject
  dialog = inject(MatDialog);
  citationNoticeService = inject(CitationNoticeService);

  @Output() refreshData = new EventEmitter<boolean>();
  @Output() openDetailProcessParticipant = new EventEmitter<
    ProcessParticipant['participationId']
  >();

  // Input signals
  executionId = input.required<string>();
  processParticipant = input.required<ProcessParticipant>();
  expirationDate = input.required<string | null>();

  // Signals
  imageSrc = signal('assets/img/icons/people/teacher.svg');

  // Computed
  isPrintDisabled = computed<boolean>(() => {
    if (
      !this.processParticipant()?.viaGubernativa?.domGuvState ||
      !this.processParticipant()?.viaGubernativa?.domGuvState
    )
      return true;

    return !Object.values(GuvStateType).includes(
      this.processParticipant()?.viaGubernativa!.domGuvState as GuvStateType
    );
  });

  badgeColor = computed<ThemePalette>(() => {
    if (!this.expirationDate()) return;

    const expirationDays = +this.expirationDate()!;

    if (expirationDays > 30) return 'primary';
    if (expirationDays <= 30 && expirationDays >= 15) return 'accent';
    return 'warn';
  });

  expirationDays = computed(() => {
    if (!this.expirationDate()) return null;

    const expirationDays = new Date().getTime() - new Date(this.expirationDate()!).getTime();
    const milisecondsInDay = 1000 * 3600 * 24;
    const days = Math.floor(expirationDays / milisecondsInDay);

    return days >= 100 ? '+99' : days;
  });

  ngOnInit() {
    if (
      this.processParticipant() &&
      this.processParticipant()?.participationId > 0
    ) {
      this.processParticipant()!.imageSrc = this.imageSrc();
    }
  }

  executeNotification() {
    if (this.processParticipant()?.viaGubernativa?.domGuvState !== 'Citado') {
      this.getAlertError('Participante notificado, accion no disponible');
      return;
    }
    this.processParticipant()!.executionId = this.executionId();
    this.processParticipant()!.typeCategory = 'notification';
    this.openAddCitationNoticeComponent(this.processParticipant()!);
  }

  executeCitation() {
    if (this.processParticipant()?.viaGubernativa?.domGuvState !== 'Citacion') {
      this.getAlertError('Participante citado, accion no disponible');
      return;
    }
    this.processParticipant()!.executionId = this.executionId();
    this.processParticipant()!.typeCategory = 'citation';
    this.openAddCitationNoticeComponent(this.processParticipant()!);
  }

  executeAdvertisement() {
    console.log('Avisando participante');
  }

  openAddCitationNoticeComponent(processParticipant: ProcessParticipant) {
    this.dialog
      .open(AddCitationNoticeComponent, {
        ...MODAL_DYNAMIC_HEIGHT,
        disableClose: true,
        data: processParticipant
      })
      .afterClosed()
      .subscribe((result: boolean | null | undefined) => {
        if (result) {
          this.processParticipant().typeCategory = null;
          this.refreshData.emit(true);
        }
      });
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

  onPrint() {
    if (this.isPrintDisabled()) return;

    const { participationId, viaGubernativa } = this.processParticipant();
    this.citationNoticeService
      .executePrint(
        participationId.toString(),
        viaGubernativa!.domGuvState as GuvStateType
      )
      .subscribe((response) => {
        this.dialog.open(DocumentViewerComponent, {
          ...MODAL_MEDIUM,
          data: {
            pdfBlob: response
          } as { pdfBlob: Blob }
        });
      });
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
