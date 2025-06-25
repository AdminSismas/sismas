import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CitationAndNoticeTableMenuComponent } from './citation-and-notice-table-menu/citation-and-notice-table-menu.component';
import { AsyncPipe } from '@angular/common';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Observable } from 'rxjs';

import { environment } from '../../../../../../environments/environments';
import { Router } from '@angular/router';
import { SendInfoGeneralService } from '../../../../../apps/services/general/send-info-general.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProcessParticipant } from '../../../../../apps/interfaces/bpm/process-participant';
import {
  ProcessParticipantTableMenu,
  TypeProcessParticipant
} from '../../../../../apps/interfaces/bpm/citation-and-notice/info-participants.interface';
import { DetailsCitationNoticeComponent } from './components/details-citation-notice/details-citation-notice.component';
import { CitationNoticeGridComponent } from './citation-notice-grid/citation-notice-grid.component';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ProFlow } from '../../../../../apps/interfaces/bpm/pro-flow';
import { getRandomInt } from 'src/app/apps/utils/general';
import { MODAL_SMALL_DETAIL_NOTIFICE } from '../../../../../apps/constants/general/constants';
import { TableThirdPartyAffectedComponent } from 'src/app/apps/components/general-components/table-third-party-affected/table-third-party-affected.component';

@Component({
  selector: 'vex-citation-and-notice',
  templateUrl: './citation-and-notice.component.html',
  styleUrl: './citation-and-notice.component.scss',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSidenavModule,
    CitationAndNoticeTableMenuComponent,
    AsyncPipe,
    CitationNoticeGridComponent,
    TableThirdPartyAffectedComponent
  ]
})
export class CitationAndNoticeComponent implements OnInit {
  public id: string = getRandomInt(1234).toString();

  searchStr: UntypedFormControl = new UntypedFormControl();

  @Input({ required: true }) public executionId = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public mode = 1;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  typeProcessDefault: TypeProcessParticipant = 'ALL';
  typeProcess!: TypeProcessParticipant;
  searchStr$ = this.searchStr.valueChanges.pipe(debounceTime(10));
  infoFatherURL!: string;

  constructor(
    proFlow: ProFlow,
    private dialog: MatDialog,
    private router: Router,
    private infoGeneralService: SendInfoGeneralService,
    private cdr: ChangeDetectorRef
  ) {
    if (proFlow?.flowId) {
      this.id += proFlow?.flowId;
    }
    if (proFlow?.mode) {
      this.mode = proFlow?.mode;
    }
    this.destroyRef.onDestroy(() => {
      // Empty block
    });
  }

  ngOnInit() {
    if (this.id != null && this.id?.length > 0) {
      this.id = this.id + getRandomInt(12000);
    } else {
      this.id = getRandomInt(10000).toString();
    }
    this.typeProcess = this.typeProcessDefault;
    if (this.id?.length > 0) {
      this.id =
        this.id +
        getRandomInt(100000) +
        'CitationNotificacionComponent' +
        getRandomInt(10);
    } else {
      this.id =
        getRandomInt(10000) +
        'CitationNotificacionComponent' +
        getRandomInt(10);
    }
    this._infoFatherURL$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.infoFatherURL = value));

    if (!this.executionId) {
      this.returnPanelTask(true);
      return false;
    }
    //
    this.cdr.markForCheck(); //
  }

  openDetailProcessParticipant(data?: ProcessParticipant) {
    this.dialog.open(DetailsCitationNoticeComponent, {
      ...MODAL_SMALL_DETAIL_NOTIFICE,
      disableClose: true,
      data: data || null
    });
  }

  setData(type: TypeProcessParticipant) {
    this.typeProcess = type;
  }

  openMassiveProcessParticipant(type: ProcessParticipantTableMenu['id']) {
    const type1 = type;
    console.log(type1);
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then(() => {
          // Empty block
        });
    }
  }
}
