import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProcessParticipant } from '../../../../../../../apps/interfaces/bpm/process-participant';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, NgIf } from '@angular/common';
import { NAME_NO_DISPONIBLE, SPACE } from 'src/app/apps/constants/general/constant';
import { getRandomInt } from '../../../../../../../apps/utils/general';

@Component({
  selector: 'vex-citation-notice-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    NgIf,
    NgClass
  ],
  templateUrl: './citation-notice-card.component.html',
  styleUrl: './citation-notice-card.component.scss'
})
export class CitationNoticeCardComponent implements OnInit {

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;

  @Input({ required: true }) public id: string | undefined = '';
  @Input({ required: true }) processParticipant!: ProcessParticipant;

  @Output() toggleStar = new EventEmitter<ProcessParticipant['participationId']>();
  @Output() openDetailProcessParticipant = new EventEmitter<ProcessParticipant['participationId']>();

  constructor(private destroyRef: DestroyRef) {
    destroyRef.onDestroy(() => {
      console.log('Card participan destruction');
    });
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + getRandomInt(10000);
    } else {
      this.id = getRandomInt(10000).toString();
    }

    if (this.processParticipant && this.processParticipant.participationId > 0) {
      this.processParticipant.imageSrc = 'assets/img/icons/people/teacher.svg';
    }
  }

  emitToggleStar(event: MouseEvent, participationId: ProcessParticipant['participationId']) {
    event.stopPropagation();
    this.toggleStar.emit(participationId);
  }

  get validateDomGuvStateNotified() {
    return this.processParticipant?.viaGubernativa?.domGuvState === 'Notificado';
  }

  get validateDomGuvStateCitation() {
    return this.processParticipant?.viaGubernativa?.domGuvState === 'Citacion';
  }

  get validateDomGuvStateNotice() {
    return this.processParticipant?.viaGubernativa?.domGuvState === 'Aviso';
  }

}
