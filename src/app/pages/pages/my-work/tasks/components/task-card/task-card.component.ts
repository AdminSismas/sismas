import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProTaskE } from '../../../../../../apps/interfaces/pro-task-e';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { TruncatePipe } from '../../../../../../apps/pipes/truncate-pipe.pipe';
import { NAME_NO_DISPONIBLE, SPACE } from '../../../../../../apps/constants/constant';
import { environment as envi } from '../../../../../../../environments/environments';

@Component({
  selector: 'vex-task-card',
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    TruncatePipe
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {

  @Input({ required: true }) public idCard: string |undefined = '';
  @Input({ required: true }) protaskE!: ProTaskE;
  @Output() openProtaskE: EventEmitter<ProTaskE> = new EventEmitter<ProTaskE>();
  @Output() openDetailProtaskE: EventEmitter<number | undefined> = new EventEmitter<ProTaskE['executionId']>();

  URL_ICON_BASE: string = `${envi.ulr_icon_base}`;

  constructor() {
  }

  ngOnInit() {
    if (this.idCard != null && this.idCard?.length>0) {
      this.idCard = this.idCard + this.getRandomInt(10000)
    } else {
      this.idCard = this.getRandomInt(10000).toString();
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;
}
