import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  numberAttribute,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { debounceTime, fromEvent, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[vexMaxFluidHeight]',
  standalone: true
})
export class FluidMaxHeightDirective implements AfterViewInit, OnDestroy {
  @Input() minHeight!: number;
  @Input({ transform: numberAttribute, alias: 'fluidHeight' }) topOffset!: number;
  @HostBinding('style.overflow-y') overflowY = 'auto';

  private domElement: HTMLElement;
  private resizeSub: Subscription;

  private renderer: Renderer2;

  constructor(renderer: Renderer2, private elementRef: ElementRef) {
    this.renderer = renderer;
    // get ref HTML element
    this.domElement = this.elementRef.nativeElement as HTMLElement;

    // register on window resize event
    this.resizeSub = fromEvent(window, 'resize')
      .pipe(throttleTime(500), debounceTime(500))
      .subscribe(() => this.setHeight());
  }

  ngAfterViewInit() {
    this.setHeight();
  }

  ngOnDestroy(){
    this.resizeSub.unsubscribe();
  }

  private setHeight() {
    const windowHeight = window?.innerHeight;
    const topOffset = this.topOffset || this.calcTopOffset();
    let height = windowHeight - topOffset;

    if (this.minHeight && height < this.minHeight) {
      height = this.minHeight;
    }

    this.renderer.setStyle(this.domElement, 'maxHeight', `${height}px`);
  }

  private calcTopOffset(): number {
    try {
      const rect = this.domElement.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      return rect.top + scrollTop;
    } catch (e) {
      return 0;
    }
  }
}
