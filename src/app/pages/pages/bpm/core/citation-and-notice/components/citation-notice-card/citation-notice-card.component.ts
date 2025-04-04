import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import {
  CONSTANTE_ADVERTISEMENT,
  CONSTANTE_CITATION,
  CONSTANTE_NOTIFIED, LIST_NOTIFICATIONS,
  NAME_NO_DISPONIBLE,
  SPACE
} from 'src/app/apps/constants/general/constants';
import { getRandomInt } from '../../../../../../../apps/utils/general';
import { MatTooltip } from '@angular/material/tooltip';

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
  @Input({ required: true }) processParticipant!: ProcessParticipant;
  @Output() openDetailProcessParticipant = new EventEmitter<ProcessParticipant['participationId']>();

  imageSrc = signal('assets/img/icons/people/teacher.svg');

  constructor(private destroyRef: DestroyRef) {
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

  executeNotification(event: MouseEvent, participationId: ProcessParticipant['participationId']) {
    event.stopPropagation();
  }

  executeCitation(event: MouseEvent, participationId: ProcessParticipant['participationId']) {
    event.stopPropagation();
  }

  executeAdvertisement(event: MouseEvent, participationId: ProcessParticipant['participationId']) {
    event.stopPropagation();
  }

  get validateNotFoundGuvState() {
    return (!this.processParticipant?.viaGubernativa || !this.processParticipant?.viaGubernativa?.domGuvState) ||
      !LIST_NOTIFICATIONS.includes(this.processParticipant?.viaGubernativa?.domGuvState);
  }

  get validateDomGuvStateCitation() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_CITATION;
  }

  get validateDomGuvStateNotified() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_NOTIFIED;
  }

  get validateDomGuvStateNotice() {
    return this.processParticipant?.viaGubernativa?.domGuvState === CONSTANTE_ADVERTISEMENT;
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
