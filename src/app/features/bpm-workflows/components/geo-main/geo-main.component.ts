import { Component, DestroyRef, inject, OnInit, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LIST_BUTTON_GEO_MAIN } from '@shared/constants/constants';
import { Observable } from 'rxjs';
import { SendInfoGeneralService } from '@shared/services/general/send-info-general.service';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { filter } from 'rxjs/operators';
import { environment } from '@environments/environments';
import { TabAlfaGeoMainComponent } from './tab-alfa-geo-main/tab-alfa-geo-main.component';
import {
  CONSTANT_TEXT_ALFA_MAIN_GEO,
  CONSTANT_TEXT_GEO_MAIN_GEO
} from '@shared/constants/constantLabels';

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
    FormsModule,
    ReactiveFormsModule,
    TabAlfaGeoMainComponent
  ],
  templateUrl: './geo-main.component.html',
  styleUrl: './geo-main.component.scss'
})
export class GeoMainComponent implements OnInit {

  public schema = `${environment.schemas.temp}`;
  public enableRefreshButton = true;

  public readonly executionId = input.required<string>();
  public readonly resources = input.required<string[]>();
  public readonly resourcesRemovers = input<string[]>([]);
  public readonly mode = input(3);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  infoFatherURL!: string;

  constructor(
    private infoGeneralService: SendInfoGeneralService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // Se sobre escribe los botones que se deben habilitar
    const resources = this.resources();
    if (resources && resources.length > 0) {
      LIST_BUTTON_GEO_MAIN.forEach(vl => this.resources().push(vl));
    }

    this._infoFatherURL$
      .pipe(filter<string>(Boolean))
      .subscribe((result: string) => {
        this.infoFatherURL = result;
      });

    if (!this.executionId()) {
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

  protected readonly CONSTANT_TEXT_ALFA_MAIN_GEO = CONSTANT_TEXT_ALFA_MAIN_GEO;
  protected readonly CONSTANT_TEXT_GEO_MAIN_GEO = CONSTANT_TEXT_GEO_MAIN_GEO;
}
