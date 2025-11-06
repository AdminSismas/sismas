import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, take } from 'rxjs/operators';
import { animate, AnimationBuilder, style } from '@angular/animations';
import { LoadingServiceService } from '@shared/services/general/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class VexSplashScreenService {
  splashScreenElem?: HTMLElement;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private animationBuilder: AnimationBuilder,
    private loadingServiceService: LoadingServiceService,
  ) {
    this.splashScreenElem =
      this.document.body.querySelector('#vex-splash-screen') ?? undefined;

    if (this.splashScreenElem) {

      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => {
          this.loadingServiceService.hide();
          this.hide();
        });
    }
  }

  hide() {
    const player = this.animationBuilder
      .build([
        style({
          opacity: 1
        }),
        animate(
          '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({
            opacity: 0
          })
        )
      ])
      .create(this.splashScreenElem);

    player.onDone(() => this.splashScreenElem?.remove());
    player.play();
  }
}
