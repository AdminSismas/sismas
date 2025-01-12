import { Component, computed, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from "../header-cadastral-information-property/header-cadastral-information-property.component";
import { AdministrativeSource, CreateAdministrativeSource, CreateAdministrativeSourceParams, DeleteAdministrativeSourceParams, UpdateAdministrativeSource } from 'src/app/apps/interfaces/information-property/administrative-source';
import { MatTableModule } from '@angular/material/table';
import { AdministrativeSourcesService } from 'src/app/apps/services/information-property/administrative-sources.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';


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
  @Input() public id = '';
  @Input() public expandedComponent = false;
  @Input() public baunitId?: string | null;
  @Input() public schema?: string;
  @Input() public executionId?: string | null;
  @Input() public typeInformation?: string;

  @ViewChild('confirmDeleteDialog', { static: true }) confirmDeleteDialog!: TemplateRef<any>;
  public selectedFuente?: AdministrativeSource;

  public displayedColumns: string[] = [
    'domFuenteAdministrativaTipo',
    'fechaDocumentoFuente',
    'numeroFuente',
    'enteEmisor',
    'actions'
  ];

  public dataSource: AdministrativeSource[] = [];

  public actionBtns = computed(() => {
    return [
      {
        id: 'edit',
        label: 'Editar',
        icon: 'mat:edit'
      },
      {
        id: 'delete',
        label: 'Eliminar',
        icon: 'mat:delete'
      }
    ];
  });

  constructor(
    private administrativeSourcesService: AdministrativeSourcesService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.images = this.images.filter((image) => image && image.trim() !== '');
    this.autoSlide();
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.autoSlide();
    }
  }

  currentIndex = 0;
  images: string[] = [
    'assets/img/slider/slider1.jpg',
    'assets/img/slider/slider2.jpg',
    'assets/img/slider/slider3.jpg'
  ];

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
