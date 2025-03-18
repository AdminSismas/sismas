import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { InformationGeographicService } from '../../../services/geographics/information-geographic.service';
import { LoadingAppComponent } from '../../general-components/loading-app/loading-app.component';
import { MatButton } from '@angular/material/button';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { FluidHeightDirective } from '../../../directives/fluid-height.directive';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { validateVariable } from '../../../utils/general';

@Component({
  selector: 'vex-geographic-viewer-embedded',
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
    ReactiveFormsModule,
    AsyncPipe,
    LoadingAppComponent,
    NgIf,
    MatButton,
    VexPageLayoutContentDirective,
    FluidHeightDirective,
    MatIcon,
    NgIf,
    MatButton,
    VexPageLayoutContentDirective,
    FluidHeightDirective,
    MatIcon
  ],
  templateUrl: './geographic-viewer-embedded.component.html',
  styleUrl: './geographic-viewer-embedded.component.scss'
})
export class GeographicViewerEmbeddedComponent implements OnInit, OnChanges {

  @Input({ required: false }) idComponent = 'GeneralMapContent1258446';
  @Input({ required: false }) executionId: string | null | undefined;
  @Input({ required: false }) ccZonaId: string | null | undefined;
  @Input({ required: false }) npn: string | null | undefined;
  @Input({ required: false }) schema: string | null | undefined;
  @Input({ required: false }) enableRefreshButton: boolean = false;

  isExistDataInformations$: Observable<boolean> = of(false);

  urlIframe: SafeResourceUrl | string | null = null;
  showMap: boolean = false;

  constructor(
    private geographicService: InformationGeographicService,
    private sanitizer: DomSanitizer
  ) {
  }


  ngOnInit(): void {
    if (this.idComponent != null && this.idComponent?.length > 0) {
      this.idComponent = this.idComponent + this.getRandomInt(10000);
    } else {
      this.idComponent = this.getRandomInt(10000).toString();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.captureErrorResult();
    if (changes['ccZonaId'] && this.ccZonaId && this.ccZonaId?.length > 0) {
      this.showMap = true;
      this.activateLoading();
      this.getViewGeneralMap(this.ccZonaId);
      return;
    }

    if (changes['npn'] && this.npn && this.npn?.length > 0) {
      this.showMap = true;
      this.activateLoading();
      this.getViewDataOpenMap(this.npn);
      return;
    }

    if (changes['executionId'] && this.executionId && this.executionId?.length > 0 && this.schema && this.schema?.length > 0) {
      this.showMap = true;
      this.activateLoading();
      this.getViewGeneralMapByExecutionId(this.executionId, this.schema);
      return;
    }

    this.captureErrorResult();
  }

  getViewGeneralMapByExecutionId(executionId: string, schema: string) {
    this.geographicService.getViewGeneralMapByExecutionId(executionId, schema)
      .subscribe({
        next: (result: string | null) => this.captureResult(result),
        error: (error) => this.captureErrorResult()
      });
  }

  getViewGeneralMap(value: string) {
    this.geographicService.getViewGeneralMapById(value)
      .subscribe({
        next: (result: string | null) => this.captureResult(result),
        error: (error) => this.captureErrorResult()
      });
  }

  getViewDataOpenMap(value: string) {
    this.geographicService.getViewDataOpenMapByNpn(value)
      .subscribe({
        next: (result: string | null) => this.captureResult(result),
        error: (error) => this.captureErrorResult()
      });
  }

  captureResult(result: string | null) {
    if (validateVariable(result) && result != null) {
      this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(result);
      this.activateLoading(true);
      return;
    }
    this.captureErrorResult();
  }

  captureErrorResult() {
    this.showMap = false;
    this.urlIframe = null;
    this.activateLoading(true);
  }

  refreshMap() {
    this.urlIframe = null;
    this.showMap = true;
    this.activateLoading();

    if (this.ccZonaId && this.ccZonaId?.length > 0) {
      this.getViewGeneralMap(this.ccZonaId);
      return;
    }

    if (this.npn && this.npn?.length > 0) {
      this.getViewDataOpenMap(this.npn);
      return;
    }

    if (this.executionId && this.executionId?.length > 0 && this.schema && this.schema?.length > 0) {
      this.getViewGeneralMapByExecutionId(this.executionId, this.schema);
      return;
    }
  }

  activateLoading(value = false) {
    const valid = of(value);
    this.isExistDataInformations$ = valid.pipe(take(3));
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

}
