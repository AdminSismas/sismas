import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT, NgIf } from '@angular/common';
import { filter, take } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { animate, AnimationBuilder, style } from '@angular/animations';

@Component({
  selector: 'vex-loading-app',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loading-app.component.html',
  styleUrl: './loading-app.component.scss'
})
export class LoadingAppComponent  {

  splashScreenElem?: HTMLElement;
  @Input({ required: true }) idLoading = 'vexSplashScreen';
  @Input({ required: true }) showImage = true;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private animationBuilder: AnimationBuilder
  ) {
    this.splashScreenElem =
      this.document.body.querySelector(this.idLoading) ?? undefined;

    if (this.splashScreenElem) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => this.hide());
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
