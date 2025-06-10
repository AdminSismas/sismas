import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { InformationGeographicService } from '../../../services/geographics/information-geographic.service';
import { MatButton } from '@angular/material/button';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { FluidHeightDirective } from '../../../directives/fluid-height.directive';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { getRandomInt, validateVariable } from '../../../utils/general';
import { LoadingServiceService } from '../../../services/general/loading-service.service';

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
  @Input({ required: false }) thematicMapValue: string | null | undefined;
  @Input({ required: false }) npn: string | null | undefined;
  @Input({ required: false }) schema: string | null | undefined;
  @Input({ required: false }) enableRefreshButton = false;
  @Input({ required: false }) getData = false;

  urlIframe: SafeResourceUrl | string | null = null;
  showMap = false;

  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );

  constructor(
    private geographicService: InformationGeographicService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.idComponent != null && this.idComponent?.length > 0) {
      this.idComponent =
        this.idComponent +
        getRandomInt(1000) +
        'desdC2258446' +
        getRandomInt(4321);
    } else {
      this.idComponent =
        getRandomInt(10000) + 'desdC6558522' + getRandomInt(1234);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.captureErrorResult();

    if (changes['ccZonaId'] && this.ccZonaId && this.ccZonaId?.length > 0) {
      this.showMap = true;
      this.loadingServiceService.activateLoading(true);
      this.getViewGeneralMap(this.ccZonaId);
      return;
    }

    if (changes['npn'] && this.npn && this.npn?.length > 0) {
      this.showMap = true;
      this.loadingServiceService.activateLoading(true);
      this.getViewDataOpenMap(this.npn);
      return;
    }

    if (
      changes['getData'] &&
      changes['getData'].currentValue &&
      this.executionId &&
      this.executionId?.length > 0 &&
      this.schema &&
      this.schema?.length > 0
    ) {
      this.showMap = true;
      this.loadingServiceService.activateLoading(true);
      this.getViewGeneralMapByExecutionId(this.executionId, this.schema);
      return;
    }

    if (
      changes['thematicMapValue'] &&
      this.thematicMapValue &&
      this.thematicMapValue?.length > 0
    ) {
      this.showMap = true;
      this.loadingServiceService.activateLoading(true);
      this.getViewGeneralThematicMap(this.thematicMapValue);
      return;
    }

    this.captureErrorResult();
  }

  getViewGeneralMapByExecutionId(executionId: string, schema: string) {
    this.geographicService
      .getViewGeneralMapByExecutionId(executionId, schema)
      .subscribe({
        next: (result: string | null) => this.captureResult(result),
        error: () => this.captureErrorResult()
      });
  }

  getViewGeneralMap(value: string) {
    this.geographicService.getViewGeneralMapById(value).subscribe({
      next: (result: string | null) => this.captureResult(result),
      error: () => this.captureErrorResult()
    });
  }

  getViewGeneralThematicMap(value: string) {
    this.geographicService
      .getViewThematicMapByCodeMunicipality(value)
      .subscribe({
        next: (result: string | null) => this.captureResult(result),
        error: () => this.captureErrorResult()
      });
  }

  getViewDataOpenMap(value: string) {
    this.geographicService.getViewDataOpenMapByNpn(value).subscribe({
      next: (result: string | null) => this.captureResult(result),
      error: () => this.captureErrorResult()
    });
  }

  captureResult(result: string | null) {
    if (validateVariable(result) && result != null) {
      this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(result);
      this.loadingServiceService.activateLoading(false);
      return;
    }
    this.captureErrorResult();
  }

  captureErrorResult() {
    this.showMap = false;
    this.urlIframe = null;
    this.loadingServiceService.activateLoading(false);
  }

  refreshMap() {
    this.urlIframe = null;
    this.showMap = true;
    this.loadingServiceService.activateLoading(true);

    if (this.ccZonaId && this.ccZonaId?.length > 0) {
      this.getViewGeneralMap(this.ccZonaId);
      return;
    }

    if (this.npn && this.npn?.length > 0) {
      this.getViewDataOpenMap(this.npn);
      return;
    }

    if (
      this.executionId &&
      this.executionId?.length > 0 &&
      this.schema &&
      this.schema?.length > 0
    ) {
      this.getViewGeneralMapByExecutionId(this.executionId, this.schema);
      return;
    }

    if (this.thematicMapValue && this.thematicMapValue?.length > 0) {
      this.getViewGeneralThematicMap(this.thematicMapValue);
      return;
    }
  }
}
