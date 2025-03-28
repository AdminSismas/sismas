import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ProcessParticipantTableMenu,
  TypeProcessParticipant
} from '../../../../../../apps/interfaces/bpm/citation-and-notice/info-participants.interface';
import { LIST_CITATION_AND_NOTICE_TABLE_MENU } from '../../../../../../apps/constants/general/constants';
import { getRandomInt } from '../../../../../../apps/utils/general';


@Component({
  selector: 'vex-citation-notice-table-menu',
  templateUrl: './citation-and-notice-table-menu.component.html',
  styleUrls: ['./citation-and-notice-table-menu.component.scss'],
  animations: [fadeInRight400ms, stagger40ms],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgIf,
    MatRippleModule,
    NgClass
  ]
})
export class CitationAndNoticeTableMenuComponent implements OnInit {

  @Input({ required: true }) id: string = '';
  @Input() items: ProcessParticipantTableMenu[] = LIST_CITATION_AND_NOTICE_TABLE_MENU;

  @Output() filterChange = new EventEmitter<TypeProcessParticipant>();
  @Output() openAddNew = new EventEmitter<void>();

  activeCategory: ProcessParticipantTableMenu['id'] = 'all';

  constructor() {
  }

  ngOnInit() {
    if (this.id?.length <= 0) {
      return;
    }
    this.id = this.id + getRandomInt(10000) + 'Menu';
  }

  setFilter(category: ProcessParticipantTableMenu['id']) {
    this.activeCategory = category;
    if (category === 'all') {
      return this.filterChange.emit('ALL');
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
