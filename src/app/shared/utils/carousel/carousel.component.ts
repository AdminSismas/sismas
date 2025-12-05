import {
  Component,
  effect,
  input,
  output,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltip],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  host: {
    class: 'h-full w-full'
  }
})
export class CarouselComponent implements AfterViewInit, OnDestroy {
  private swiper!: Swiper;

  /* ---- Inputs ----- */
  images = input.required<{ url: string; name: string }[]>();
  deleteButton = input(false, { transform: this.initBooleanValueInput });
  resetCarousel = input(false, { transform: this.initBooleanValueInput });
  showNames = input(false, { transform: this.initBooleanValueInput });

  /* ---- Outputs ----- */
  deleteImage = output<string>();

  constructor() {
    effect(
      () => {
        if (this.resetCarousel()) {
          this.resetSlider();
        }
      },
      { allowSignalWrites: true }
    );

    this.initSwiperEffect();
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  initBooleanValueInput(value: string | boolean): boolean {
    if (typeof value === 'boolean') return value;

    switch (`${value}`.toLowerCase()) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return false;
    }
  }

  private initSwiper(): void {
    this.swiper = new Swiper('.swiper', {
      modules: [Navigation, Pagination],
      direction: 'horizontal',
      loop: this.images().length > 1,
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }

  private initSwiperEffect(): void {
    effect(
      () => {
        if (this.images().length > 0) {
          this.swiper.destroy(true, true);
          this.initSwiper();
        } else {
          if (this.swiper) {
            this.swiper.destroy(true, true);
          }
        }
      },
      { allowSignalWrites: true }
    );
  }

  resetSlider(): void {
    if (this.swiper) {
      this.swiper.slideTo(0, 0);
    }
  }

  onDeleteImage(urlFile: string): void {
    this.deleteImage.emit(urlFile);
  }
}
