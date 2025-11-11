import { Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { MatRippleModule } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ProcessParticipantTableMenu,
  TypeProcessParticipant
} from '@features/bpm-workflows/models/citation-and-notice/info-participants.interface';
import { LIST_CITATION_AND_NOTICE_TABLE_MENU } from '@shared/constants/constants';

@Component({
  selector: 'vex-citation-notice-table-menu',
  templateUrl: './citation-and-notice-table-menu.component.html',
  styleUrls: ['./citation-and-notice-table-menu.component.scss'],
  animations: [fadeInRight400ms, stagger40ms],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatRippleModule, NgClass]
})
export class CitationAndNoticeTableMenuComponent {
  @Input() items: ProcessParticipantTableMenu[] =
    LIST_CITATION_AND_NOTICE_TABLE_MENU;

  @Output() filterChange = new EventEmitter<TypeProcessParticipant>();
  @Output() openAddNew = new EventEmitter<void>();
  @Output() openMassiveProcessParticipant = new EventEmitter<
    ProcessParticipantTableMenu['id']
  >();

  activeCategory: ProcessParticipantTableMenu['id'] = 'all';

  setFilter(category: ProcessParticipantTableMenu['id']) {
    this.activeCategory = category;
    if (category === 'all') {
      return this.filterChange.emit('ALL');
    }
    if (category === 'participants') {
      return this.filterChange.emit('PARTICIPANTS');
    }
    if (category === 'citation') {
      return this.filterChange.emit('CITADO');
    }
    if (category === 'notification') {
      return this.filterChange.emit('NOTIFICADO');
    }
    if (category === 'notice') {
      return this.filterChange.emit('AVISO');
    }
  }

  isActive(category: ProcessParticipantTableMenu['id']) {
    return this.activeCategory === category;
  }
}
