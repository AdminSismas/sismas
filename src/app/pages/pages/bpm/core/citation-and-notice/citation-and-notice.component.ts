import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  CitationAndNoticeTableMenuComponent
} from './citation-and-notice-table-menu/citation-and-notice-table-menu.component';
import { CitationAndNoticeTableComponent } from './citation-and-notice-table/citation-and-notice-table.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Observable } from 'rxjs';

import { environment } from '../../../../../../environments/environments';
import { Router } from '@angular/router';
import { SendInfoGeneralService } from '../../../../../apps/services/general/send-info-general.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParticipantsProcessService } from '../../../../../apps/services/bpm/core/participants-process.service';
import { ProcessParticipant } from '../../../../../apps/interfaces/bpm/process-participant';
import { PageSearchData } from '../../../../../apps/interfaces/page-search-data.model';
import { TypeProcessParticipant } from '../../../../../apps/interfaces/bpm/info-participants.interface';
import { LoadingAppComponent } from '../../../../../apps/components/loading-app/loading-app.component';
import { DetailsCitationNoticeComponent } from './components/details-citation-notice/details-citation-notice.component';
import { CitationNoticeGridComponent } from './citation-notice-grid/citation-notice-grid.component';

@Component({
  selector: 'vex-citation-and-notice',
  templateUrl: './citation-and-notice.component.html',
  styleUrl: './citation-and-notice.component.scss',
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSidenavModule,
    CitationAndNoticeTableMenuComponent,
    CitationAndNoticeTableComponent,
    AsyncPipe,
    LoadingAppComponent,
    NgIf,
    CitationNoticeGridComponent
  ]
})
export class CitationAndNoticeComponent implements OnInit {

  searchStr: UntypedFormControl = new UntypedFormControl();

  @Input({ required: true }) public executionId: string = '';

  id: string = this.getRandomInt(1234).toString();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  typeProcessDefault: TypeProcessParticipant['type'] = 'ALL';
  typeProcess!: string;
  searchStr$ = this.searchStr.valueChanges.pipe(debounceTime(10));
  infoFatherURL!: string;


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private readonly layoutService: VexLayoutService,
    private infoGeneralService: SendInfoGeneralService
  ) {
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(10000);
    } else {
      this.id = this.getRandomInt(10000).toString();
    }
    this.layoutService.collapseSidenav();
    this.typeProcess = this.typeProcessDefault;
    this.executionId = '76';
    if (this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(100000)
        + 'CitationNotificacionComponent' + this.getRandomInt(10);
    } else {
      this.id = this.getRandomInt(10000)
        + 'CitationNotificacionComponent' + this.getRandomInt(10);
    }
    this._infoFatherURL$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.infoFatherURL = value);

    if (!this.executionId) {
      this.returnPanelTask(true);
      return false;
    }
  }

  openDetailProcessParticipant(data?: ProcessParticipant) {
    this.dialog.open(DetailsCitationNoticeComponent, {
      data: data || null,
      width: '600px'
    });
  }

  toggleStar(id: ProcessParticipant['participationId']) {
    // const participants = this.tableData.find((c) => c.id === id);
    // if (participants) {
    //   participants.starred = !contact.starred;
    // }
  }

  setData(type: TypeProcessParticipant['type']) {
    this.typeProcess = type;
  }

  openMenu() {
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  isValueField(value: any) {
    return value !== null && value !== undefined && value !== '';
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router.navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then(() => {
        });
    }
  }

}
