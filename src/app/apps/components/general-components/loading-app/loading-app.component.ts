import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DOCUMENT, NgIf } from '@angular/common';
import { filter, take } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { animate, AnimationBuilder, style } from '@angular/animations';

@Component({
  selector: 'vex-loading-app',
  standalone: true,
  imports: [],
  templateUrl: './loading-app.component.html',
  styleUrl: './loading-app.component.scss'
})
export class LoadingAppComponent implements OnInit, OnChanges {

  splashScreenElem?: HTMLElement;
  @Input({ required: false }) idLoading = 'vexSplashScreen';
  @Input({ required: false }) textLoading = 'Cargando ...';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private animationBuilder: AnimationBuilder
  ) {
    this.splashScreenElem = this.document.body.querySelector(this.idLoading) ?? undefined;
    if (this.splashScreenElem) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => this.hide());
    }
  }

  ngOnInit(): void {
    if(this.textLoading && this.textLoading?.length <= 0) {
      this.textLoading ='Cargando ...';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['textLoading'] && this.textLoading && this.textLoading?.length <= 0) {
      this.textLoading ='Cargando ...';
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
