import { Component, ElementRef, input, viewChild } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styles: `
    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: 200ms opacity ease-in-out;
      -webkit-transition: 200ms opacity ease-in-out;
    }

    .slide[data-active] {
      opacity: 1;
      z-index: 1;
    }
  `
})
export class CarouselComponent {
  images = input.required<string[]>();

  slides = viewChild<ElementRef>('slides');
  prevButton = viewChild<MatFabButton>('prevButton');
  nextButton = viewChild<MatFabButton>('nextButton');

  changeImage(offset: 1 | -1): void {
    const slides = this.slides()!.nativeElement;
    if (!slides) return;

    const activeSlide = slides.querySelector('[data-active]');

    const newIndex = [...slides.children].indexOf(activeSlide) + offset;

    if (newIndex < 0 || newIndex >= slides.children.length) return;

    if (newIndex === 0) {
      this.prevButton()!.disabled = true;
    } else {
      this.prevButton()!.disabled = false;
    }

    if (newIndex === slides.children.length - 1) {
      this.nextButton()!.disabled = true;
    } else {
      this.nextButton()!.disabled = false;
    }

    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
  }
}
