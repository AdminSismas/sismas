/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProFlow } from '../../../../../../../apps/interfaces/bpm/pro-flow';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SendInfoGeneralService } from '../../../../../../../apps/services/general/send-info-general.service';
import { environment } from '../../../../../../../../environments/environments';
import { Router } from '@angular/router';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { getRandomInt } from 'src/app/apps/utils/general';
import { TabAlfaGeoMainComponent } from '../../tab-alfa-geo-main/tab-alfa-geo-main.component';

@Component({
  selector: 'vex-alfa-main',
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
    MatStepperModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TabAlfaGeoMainComponent
  ],
  templateUrl: './alfa-main.component.html',
  styleUrl: './alfa-main.component.scss'
})
export class AlfaMainComponent implements OnInit {
  public id: string = getRandomInt(12324).toString();

  @Input({ required: true }) public executionId:string = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public resourcesRemovers: string[] = [];
  @Input({ required: false }) public mode = 1;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  infoFatherURL!: string;

  constructor(
    proFlow: ProFlow,
    private infoGeneralService: SendInfoGeneralService,
    private router: Router
  ) {
    if (proFlow?.flowId) {
      this.id += proFlow?.flowId;
    }
    if (proFlow?.mode) {
      this.mode = proFlow?.mode;
    }
    this.destroyRef.onDestroy(() => {});
  }

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id =
        this.id + getRandomInt(100000) + 'AlfaMainComponent' + getRandomInt(10);
    } else {
      this.id = getRandomInt(10000) + 'AlfaMainComponent' + getRandomInt(10);
    }

    this._infoFatherURL$
      .pipe(filter<string>(Boolean))
      .subscribe((result: string) => {
        this.infoFatherURL = result;
      });

    if (!this.executionId) {
      this.returnPanelTask(true);
      return false;
    }
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }
}
