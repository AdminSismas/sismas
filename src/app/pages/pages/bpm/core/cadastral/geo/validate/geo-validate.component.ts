import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter } from 'rxjs';
import {
  CONSTANT_TEXT_ALFA_MAIN_GEO,
  CONSTANT_TEXT_GEO_MAIN_GEO
} from 'src/app/apps/constants/general/constantLabels';
import { LIST_BUTTON_GEO_MAIN } from '@shared/constants';
import { SendInfoGeneralService } from 'src/app/apps/services/general/send-info-general.service';
import { environment } from 'src/environments/environments';
import { TabAlfaGeoMainComponent } from '../../tab-alfa-geo-main/tab-alfa-geo-main.component';

@Component({
  selector: 'vex-geo-validate',
  standalone: true,
  imports: [TabAlfaGeoMainComponent],
  templateUrl: './geo-validate.component.html',
  styleUrl: './geo-validate.component.scss'
})
export class GeoValidateComponent implements OnInit {
  public schema = `${environment.schemas.temp}`;
  public enableRefreshButton = true;

  public readonly executionId = input.required<string>();
  public readonly resources = input.required<string[]>();
  public readonly mode = input.required<number>();

  private infoGeneralService = inject(SendInfoGeneralService);
  private router = inject(Router);

  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  infoFatherURL!: string;

  ngOnInit() {
    // Se sobre escribe los botones que se deben habilitar
    const resources = this.resources();
    if (resources && resources.length > 0) {
      LIST_BUTTON_GEO_MAIN.forEach((vl) => this.resources().push(vl));
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
