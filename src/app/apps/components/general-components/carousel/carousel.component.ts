import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { MatButtonModule, MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltip],
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
  images = input.required<{ url: string, name: string }[]>();
  deleteButton = input<boolean>(false);
  resetCarousel = input<boolean>(false);
  showNames = input<boolean>(false);

  deleteImage = output<string>();

  newIndex = signal<number>(0);

  slides = viewChild<ElementRef>('slides');
  prevButton = viewChild<MatFabButton>('prevButton');
  nextButton = viewChild<MatFabButton>('nextButton');

  resetEffect = effect(() => {
    if (this.resetCarousel()) {
      this.resetSlider();
    }
  }, { allowSignalWrites: true});

  resetSlider(): void {
    const slides = this.slides()!.nativeElement;

    this.newIndex.set(0);

    console.log(this.newIndex());

    const activeSlide = slides.querySelector('[data-active]');
    if (activeSlide) {
      delete activeSlide.dataset.active;
    }
    slides.children[this.newIndex()].dataset.active = true;
    this.prevButton()!.disabled = true;
    this.nextButton()!.disabled = this.images().length <= 1;
  }

  changeImage(offset: 1 | -1): void {
    const slides = this.slides()!.nativeElement;
    if (!slides) return;

    const activeSlide = slides.querySelector('[data-active]');

    this.newIndex.set([...slides.children].indexOf(activeSlide) + offset);

    if (this.newIndex() < 0 || this.newIndex() >= slides.children.length) return;

    if (this.newIndex() === 0) {
      this.prevButton()!.disabled = true;
    } else {
      this.prevButton()!.disabled = false;
    }

    if (this.newIndex() === slides.children.length - 1) {
      this.nextButton()!.disabled = true;
    } else {
      this.nextButton()!.disabled = false;
    }

    slides.children[this.newIndex()].dataset.active = true;
    delete activeSlide.dataset.active;
  }

  onDeleteImage(urlFile: string): void {
    this.deleteImage.emit(urlFile);
  }
}
