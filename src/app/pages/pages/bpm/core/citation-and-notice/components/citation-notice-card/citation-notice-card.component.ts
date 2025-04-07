import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import {
  CONSTANTE_CITATION,
  CONSTANTE_CITED,
  CONSTANTE_NOTIFIED, LIST_NOTICE_NOTIFICATIONS,
  LIST_NOTIFICATIONS,
  MODAL_DYNAMIC_HEIGHT,
  NAME_NO_DISPONIBLE
} from 'src/app/apps/constants/general/constants';
import { getRandomInt } from '../../../../../../../apps/utils/general';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddCitationNoticeComponent } from '../add-citation-notice/add-citation-notice.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-citation-notice-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    NgClass,
    TitleCasePipe,
    MatTooltip
  ],
  templateUrl: './citation-notice-card.component.html',
  styleUrl: './citation-notice-card.component.scss'
})
export class CitationNoticeCardComponent implements OnInit {

  @Input({ required: true }) public id: string | undefined = '';
  @Input({ required: true }) executionId!: string;
  @Input({ required: true }) processParticipant!: ProcessParticipant;
  @Output() refreshData = new EventEmitter<boolean>();
  @Output() openDetailProcessParticipant = new EventEmitter<ProcessParticipant['participationId']>();

  imageSrc = signal('assets/img/icons/people/teacher.svg');

  constructor(
    private destroyRef: DestroyRef,
    private dialog: MatDialog) {
    destroyRef.onDestroy(() => {
    });
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + getRandomInt(10000) + this.processParticipant.participationId;
    } else {
      this.id = getRandomInt(10000).toString() + this.processParticipant.participationId;
    }

    if (this.processParticipant && this.processParticipant.participationId > 0) {
      this.processParticipant.imageSrc = this.imageSrc();
    }
  }

  executeNotification() {
    if(!this.validateDomGuvStateNotified){
      this.getAlertError('Participante notificado, accion no disponible');
      return;
    }
    this.processParticipant.executionId = this.executionId;
    this.processParticipant.typeCategory = 'notification';
    this.openAddCitationNoticeComponent(this.processParticipant);
  }

  executeCitation() {
    if(!this.validateDomGuvStateCitation){
      this.getAlertError('Participante citado, accion no disponible');
      return;
    }
    this.processParticipant.executionId = this.executionId;
    this.processParticipant.typeCategory = 'citation';
    this.openAddCitationNoticeComponent(this.processParticipant);
  }

  executeAdvertisement() {
  }

  openAddCitationNoticeComponent(processParticipant: ProcessParticipant){
    this.dialog.open(AddCitationNoticeComponent, {
      ...MODAL_DYNAMIC_HEIGHT,
      disableClose: true,
      data: processParticipant
    }).afterClosed().subscribe((result: boolean | null | undefined) => {
      if(result) {
        this.processParticipant.typeCategory = null;
        this.refreshData.emit(true);
      }
    });
  }

  get validateNotFoundGuvState() {
    return !this.processParticipant?.viaGubernativa || !this.processParticipant?.viaGubernativa?.domGuvState;
  }

  get validateDomGuvStateCitation() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_CITATION;
  }

  get validateDomGuvStateNotified() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_CITED;
  }

  get validateNotifiedCompleted() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_NOTIFIED;
  }

  get validateDomGuvStateNotice() {
    return this.processParticipant?.viaGubernativa?.domGuvState && LIST_NOTICE_NOTIFICATIONS.includes(this.processParticipant?.viaGubernativa?.domGuvState);
  }

  get classValidateDomGuvStateCitation() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_CITATION ? 'text-primary' : 'text-secondary';
  }

  get classValidateDomGuvStateNotified() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_CITED ? 'text-green' : 'text-secondary';
  }

  get classValidateDomGuvStateNotice() {
    return this.processParticipant?.viaGubernativa?.domGuvState && LIST_NOTICE_NOTIFICATIONS.includes(this.processParticipant?.viaGubernativa?.domGuvState) ? 'text-amber' : 'text-secondary';
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

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
