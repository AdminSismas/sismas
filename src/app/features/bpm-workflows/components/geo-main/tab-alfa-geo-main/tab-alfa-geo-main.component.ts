import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  signal
} from '@angular/core';
import { LoadingServiceService } from '@shared/services/general/loading-service.service';
import { SendInfoGeneralService } from '@shared/services/general/send-info-general.service';
import { Router } from '@angular/router';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { GeographicViewerEmbeddedComponent } from 'src/app/apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';
import { FluidHeightDirective } from '@shared/directives';
import { environment } from '@environments/environments';
import { Observable } from 'rxjs';
import { LIST_BUTTON_GEO_MAIN } from '@shared/constants/general/constants';
import { filter } from 'rxjs/operators';
import { AlfaMainInformationComponent } from '@features/bpm-workflows/components/alfa-main/alfa-main-information/alfa-main-information.component';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-tab-alfa-geo-main',
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
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatTabGroup,
    MatTab,
    MatIcon,
    MatTabLabel,
    GeographicViewerEmbeddedComponent,
    FluidHeightDirective,
    AlfaMainInformationComponent
  ],
  templateUrl: './tab-alfa-geo-main.component.html',
  styleUrl: './tab-alfa-geo-main.component.scss'
})
export class TabAlfaGeoMainComponent implements OnInit, AfterViewInit {

  /* ---- Injects ---- */
  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );
  private infoGeneralService: SendInfoGeneralService = inject(
    SendInfoGeneralService
  );
  private router: Router = inject(Router);

  schema = `${environment.schemas.temp}`;
  executionIdGeo = '';
  enableRefreshButton = true;

  /* ---- Signals ---- */
  selectedMapTab = signal<boolean>(false);

  @Input({ required: true }) public executionId = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public textTabAlfaMain =
    'Información Alfanumérica';
  @Input({ required: false }) public textTabGeoMain = 'Mapa Geografico';
  @Input({ required: false }) public mode = 0;

  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  infoFatherURL!: string;

  ngOnInit() {
    this.loadingServiceService.activateLoading(true);

    // Se sobre escribe los botones que se deben habilitar cuando se formulario geo
    if (this.mode === 3) {
      if (this.resources && this.resources.length > 0) {
        LIST_BUTTON_GEO_MAIN.forEach((vl) => this.resources.push(vl));
      }
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
      this.loadingServiceService.activateLoading(false);
    }, 3000);
  }

  ngAfterViewInit(): void {
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

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }

  changeTabSelected(event: number) {
    if (event === 1) {
      this.selectedMapTab.set(true);
      return;
    }
    this.selectedMapTab.set(false);
    return;
  }
}
