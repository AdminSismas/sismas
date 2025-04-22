import { Component, OnInit, input, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { PhotosService } from 'src/app/apps/services/photos/photos.service';
import { from, mergeMap, toArray } from 'rxjs';

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
    CommonModule
  ],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
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

  constructor(private photosService: PhotosService) {}

  ngOnInit(): void {
    this.isExpandPanel(this.expandedComponent());
    this.autoSlide();
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

    this.photosService
      .listNamePhotos(this.baunitId(), municipioId)
      .pipe(
        mergeMap((fileNames) =>
          from(fileNames).pipe(
            mergeMap((fileName) =>
              this.photosService.getPhotoFile(
                this.baunitId(),
                fileName,
                municipioId
              )
            ),
            toArray()
          )
        )
      )
      .subscribe({
        next: (files) => {
          const filesUrl = files.map((file) => URL.createObjectURL(file));
          this.images.set(filesUrl);
          this.loading.set(false);
          console.log(this.images());
        }
      });

    // this.photosService.listPhotos(this.baunitId(), 1, 100).subscribe({
    //   next: (files: string[]) => {
    //     this.images = files.map((file) => `https://geo-masora-bucket.s3.us-east-1.amazonaws.com/${file}`);
    //     this.loading = false;

    //     if (this.images.length === 0) {
    //       console.warn('No se encontraron imágenes para el baunitId:', this.baunitId);
    //     }
    //   },
    // });
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images().length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images().length) %
      this.images().length;
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 10000);
  }
}
