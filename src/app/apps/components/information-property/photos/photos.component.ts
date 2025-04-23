import { Component, forwardRef, input, OnInit, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { PhotosService } from 'src/app/apps/services/photos/photos.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { CarouselComponent } from '../../general-components/carousel/carousel.component';

@Component({
  selector: 'vex-photos',
  standalone: true,
  imports: [
    MatExpansionModule,
    HeaderCadastralInformationPropertyComponent,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    CommonModule,
    CarouselComponent
  ],
  templateUrl: './photos.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhotosComponent),
      multi: true
    }
  ]
})
export class PhotosComponent implements OnInit {
  images = signal<string[]>([]);
  loading = signal(true);
  currentIndex = 0;

  expandedComponent = input<boolean>(false);
  baunitId = input<string>('');
  schema = input<string>('');
  executionId = input<string | null | undefined>('');
  typeInformation = input<string>('');
  npn = input.required<string>();

  constructor(private photosService: PhotosService) {
  }

  ngOnInit(): void {
    this.isExpandPanel(this.expandedComponent());
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.loadPhotos();
    }
  }

  loadPhotos() {
    if (!this.baunitId()) {
      console.error('baunitId no definido.');
      this.loading.set(false);
      return;
    }

    const municipioId = this.npn().slice(2, 5);

    this.photosService.listNamePhotos(this.baunitId(), municipioId).subscribe({
      next: (urlFiles) => {
        this.images.set(urlFiles);
        this.loading.set(false);
      }
    });
  }
}
