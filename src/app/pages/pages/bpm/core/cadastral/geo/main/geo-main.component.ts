import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { STRING_INFORMATION_NOT_FOUND } from '../../../../../../../apps/constants/general/constant';
import {
  LoadingAppComponent
} from '../../../../../../../apps/components/general-components/loading-app/loading-app.component';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlfaMainService } from '../../../../../../../apps/services/bpm/core/alfa-main.service';
import { SendInfoGeneralService } from '../../../../../../../apps/services/general/send-info-general.service';
import { Router } from '@angular/router';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../../../../../../../environments/environments';
import { FluidHeightDirective } from '../../../../../../../apps/directives/fluid-height.directive';
import {
  GeographicViewerEmbeddedComponent
} from '../../../../../../../apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';
import { AlfaMainComponent } from '../../alf/main/alfa-main.component';
import { ProFlow } from '../../../../../../../apps/interfaces/bpm/pro-flow';

@Component({
  selector: 'vex-geo-main',
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
    AsyncPipe,
    NgIf,
    VexPageLayoutComponent,
    FormsModule,
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    LoadingAppComponent,
    FluidHeightDirective,
    GeographicViewerEmbeddedComponent,
    AlfaMainComponent
  ],
  templateUrl: './geo-main.component.html',
  styleUrl: './geo-main.component.scss'
})
export class GeoMainComponent implements OnInit, AfterViewInit {

  public id: string = this.getRandomInt(1234).toString();
  public mode = 3;
  public schema: string = `${environment.schemas.temp}`;
  public executionIdGeo: string = '';

  @Input({ required: true }) public executionId = '';
  @Input({ required: true }) public resources: string[] = [];

  isExistDataInformations$: Observable<boolean> = of(false);
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;

  infoFatherURL!: string;

  constructor(
    proFlow: ProFlow,
    private snackbar: MatSnackBar,
    private alfaMainService: AlfaMainService,
    private infoGeneralService: SendInfoGeneralService,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (proFlow?.flowId) {
      this.id += proFlow?.flowId;
    }
    if (proFlow?.mode) {
      this.mode = proFlow?.mode;
    }
  }

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id =
        this.id +
        this.getRandomInt(100000) + 'GeoMainComponentAndTab' + this.getRandomInt(10);
    } else {
      this.id =
        this.getRandomInt(10000) + 'GeoMainComponentAndTab' + this.getRandomInt(10);
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
    setTimeout(() => {
      this.executionIdGeo = this.executionId;
    }, 100);

    setTimeout(() => {
      this.activateLoading(true);
    }, 5000);

  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.infoFatherURL) {
        this.returnURLPrevious(`${environment.myWork_cadastralSearch}`);
        return;
      }

      if (!this.executionId) {
        this.returnPanelTask(true);
        return false;
      }

    }, 300);
  }

  activateLoading(value = false) {
    const valid = of(value);
    this.isExistDataInformations$ = valid.pipe(take(3));
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
}
