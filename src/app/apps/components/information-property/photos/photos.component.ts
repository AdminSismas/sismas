import { Component, computed, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from "../header-cadastral-information-property/header-cadastral-information-property.component";
import { AdministrativeSource } from 'src/app/apps/interfaces/information-property/administrative-source';
import { MatTableModule } from '@angular/material/table';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
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
  styleUrl: './photos.component.scss'
})
export class PhotosComponent implements OnInit {
  photos: Photo[] = [];
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
    private administrativeSourcesService: AdministrativeSourcesService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private photosService: PhotosService
  ) { }

  ngOnInit(): void {
    console.log('ID recibido:', this.baunitId);
    this.loadPhotos();
  }

  loadPhotos() {
    if (!this.baunitId) {
      console.error('baunitId no definido.');
      this.loading = false;
      return;
    }

    this.photosService.listPhotos().subscribe({
      next: (photos: Photo[]) => {
        // Filtrar imágenes que coincidan con el baunitId
        this.photos = photos.filter((photo) => {
          if (!photo.key || typeof photo.key !== 'string') {
            console.warn('Imagen con clave inválida:', photo);
            return false; // Omitir si no tiene clave válida
          }
          const match = photo.key.match(/\/674\/(\d+)\//); // Extraer el número entre /674/ y /
          return match && match[1] === this.baunitId; // Comparar con baunitId
        });

        // Si no hay coincidencias, mostrar el mensaje de "No hay fotos"
        if (this.photos.length === 0) {
          console.warn('No se encontraron imágenes para el baunitId:', this.baunitId);
        }

        // Obtener URLs para el carrusel
        this.images = this.photos.map((photo) => photo.url);

        this.loading = false; // Detener estado de carga
      },
      error: (err: any) => {
        console.error('Error al cargar las imágenes:', err.message || err);
        this.loading = false; // Detener estado de carga incluso si hay error
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
    }, 5000);
  }

}
