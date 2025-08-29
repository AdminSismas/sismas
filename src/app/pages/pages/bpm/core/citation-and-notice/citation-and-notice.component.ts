import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  input,
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
  ],
})
export class CitationAndNoticeComponent implements OnInit {
  // Injects
  proFlow = inject(ProFlow);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private infoGeneralService = inject(SendInfoGeneralService);
  private cdr = inject(ChangeDetectorRef);

  // Inputs
  executionId = input.required<string>();
  resources = input.required<string[]>();
  mode = input.required({ transform: (value) => this.proFlow.mode || value });

  // Properties
  searchStr: UntypedFormControl = new UntypedFormControl();
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  typeProcess: TypeProcessParticipant = 'ALL';
  searchStr$ = this.searchStr.valueChanges.pipe(debounceTime(200));
  infoFatherURL!: string;

  ngOnInit() {
    this._infoFatherURL$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.infoFatherURL = value));

    if (!this.executionId) {
      this.returnPanelTask(true);
      return false;
    }

    this.cdr.markForCheck();
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
