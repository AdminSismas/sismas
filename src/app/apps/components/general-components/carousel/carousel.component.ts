import { Component, effect, input, output, AfterViewInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';

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

  images = input.required<{ url: string, name: string }[]>();
  deleteButton = input<boolean>(false);
  resetCarousel = input<boolean>(false);
  showNames = input<boolean>(false);

  deleteImage = output<string>();

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
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

  resetEffect = effect(() => {
    if (this.resetCarousel()) {
      this.resetSlider();
    }
  }, { allowSignalWrites: true});

  resetSlider(): void {
    if (this.swiper) {
      this.swiper.slideTo(0, 0);
    }
  }

  onDeleteImage(urlFile: string): void {
    this.deleteImage.emit(urlFile);
  }

}
