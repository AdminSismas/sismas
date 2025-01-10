import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-access-records',
  standalone: true,
  imports: [
    CommonModule,
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './access-records.component.html',
  styleUrls: ['./access-records.component.scss']
})
export class AccessRecordsComponent implements OnInit {

  currentIndex = 0;
  images: string[] = [
    'assets/img/slider/slider1.jpg',
    'assets/img/slider/slider2.jpg',
    'assets/img/slider/slider3.jpg'
  ];

  ngOnInit(): void {
    this.autoSlide();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}
