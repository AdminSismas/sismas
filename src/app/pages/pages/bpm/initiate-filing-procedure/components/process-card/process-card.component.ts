import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { TruncatePipe } from '../../../../../../apps/pipes/truncate-pipe.pipe';
import { BpmTypeProcess } from '@shared/interfaces';
import { environment as envi } from '@environments/environments';
import { NAME_NO_DISPONIBLE } from '../../../../../../shared/constants/general/constants';
import { SPACE } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'vex-process-card',
  standalone: true,
  imports: [
    MatIconModule,
    MatRippleModule,
    TruncatePipe,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './process-card.component.html',
  styleUrl: './process-card.component.scss'
})
export class ProcessCardComponent implements OnInit {

  URL_ICON_BASE = `${envi.ulr_icon_base}`;

  @Input({ required: true }) public idCard: string | undefined = '';
  @Input({ required: true }) bpmTypeProcess!: BpmTypeProcess;
  @Output() selectProcess: EventEmitter<BpmTypeProcess> = new EventEmitter<BpmTypeProcess>();

  ngOnInit() {
    if (this.idCard != null && this.idCard?.length > 0) {
      this.idCard = this.idCard + this.getRandomInt(10000);
    } else {
      this.idCard = this.getRandomInt(10000).toString();
    }
  }

  emitSelectProcess(event: MouseEvent, bpmTypeProcess: BpmTypeProcess) {
    event.stopPropagation();
    bpmTypeProcess.selectProcess = !bpmTypeProcess.selectProcess;
    this.selectProcess.emit(bpmTypeProcess);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly SPACE = SPACE;
}
