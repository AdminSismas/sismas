import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from "../header-cadastral-information-property/header-cadastral-information-property.component";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { PhotosService, Photo } from 'src/app/apps/services/photos/photos.service';


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
  ],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  images: string[] = [];
  loading = true;
  currentIndex = 0;

  @Input() public id = '';
  @Input() public expandedComponent = false;
  @Input() public baunitId?: string | null;
  @Input() public schema?: string;
  @Input() public executionId?: string | null;
  @Input() public typeInformation?: string;

  @ViewChild('confirmDeleteDialog', { static: true }) confirmDeleteDialog!: TemplateRef<any>;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private photosService: PhotosService
  ) {}

  ngOnInit(): void {
    // this.baunitId = '1027396'; // BaunitId quemado para hacer pruebas
    this.isExpandPanel(this.expandedComponent);
    this.autoSlide();
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.loadPhotos();
    }
  }

  loadPhotos() {
    if (!this.baunitId) {
      console.error('baunitId no definido.');
      this.loading = false;
      return;
    }

    this.photosService.listPhotos(this.baunitId, 1, 100).subscribe({
      next: (files: string[]) => {
        this.images = files.map((file) => `https://geo-masora-bucket.s3.us-east-1.amazonaws.com/${file}`);
        this.loading = false;

        if (this.images.length === 0) {
          console.warn('No se encontraron imágenes para el baunitId:', this.baunitId);
        }
      },
      error: (err: any) => {
        // console.error('Error al cargar las imágenes:', err.message || err);
        this.loading = false;
      },
    });
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
    }, 10000);
  }
}
