import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoadingAppComponent } from '../../loading-app/loading-app.component';
import { Observable, of } from 'rxjs';
import { Zone } from '../../../interfaces/territorial-organization/zone.model';
import { take } from 'rxjs/operators';
import { InformationGeographicService } from '../../../services/geographics/information-geographic.service';
import { Municipality } from '../../../interfaces/territorial-organization/municipality.model';
import { text } from 'aws-sdk/clients/customerprofiles';

@Component({
  selector: 'vex-geographic-viewer-embedded',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    LoadingAppComponent,
    NgIf
  ],
  templateUrl: './geographic-viewer-embedded.component.html',
  styleUrl: './geographic-viewer-embedded.component.scss'
})
export class GeographicViewerEmbeddedComponent implements OnInit, OnChanges {

  @Input({ required: false }) idComponent = 'GeneralMapContent1258446';
  @Input({ required: false }) executionId: string| null | undefined;
  @Input({ required: false }) ccZonaId: string | null | undefined;
  @Input({ required: false }) npn: string | null | undefined;
  @Input({ required: false }) schema: string | null | undefined;

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
        next: (result: any) => this.captureResult(result),
        error: (error) => this.captureErrorResult(),
      });
  }

  getViewGeneralMap(value: string) {
    this.geographicService.getViewGeneralMapById(value)
      .subscribe({
        next: (result: any) => this.captureResult(result),
        error: (error) => this.captureErrorResult(),
      });
  }

  getViewDataOpenMap(value: string) {
    this.geographicService.getViewDataOpenMapByNpn(value)
      .subscribe({
        next: (result: any) => this.captureResult(result),
        error: (error) => this.captureErrorResult(),
      });
  }

  captureResult(result: any) {
    this.urlIframe = this.sanitizer.bypassSecurityTrustResourceUrl(result);
    this.activateLoading(true);
  }

  captureErrorResult() {
    this.showMap = false;
    this.urlIframe = null;
    this.activateLoading(true);
  }


  activateLoading(value = false) {
    const valid = of(value);
    this.isExistDataInformations$ = valid.pipe(take(1));
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

}
