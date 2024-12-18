// Angular framework
import { Component } from '@angular/core';

// Vex
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableDigitalizedSignaturesComponent } from 'src/app/apps/components/configuration/digitalized-signatures/table-digitalized-signatures.component';
import { CreateSignatureComponent } from 'src/app/apps/components/configuration/digitalized-signatures/create-signature/create-signature.component';

// Custom

@Component({
  selector: 'vex-digitalized-signatures',
  standalone: true,
  imports: [
    // Vex
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,

    // Material
    MatIconModule,
    MatButtonModule,

    // Custom
    TableDigitalizedSignaturesComponent
  ],
  templateUrl: './digitalized-signatures.component.html',
  styleUrl: './digitalized-signatures.component.scss'
})
export class DigitalizedSignaturesComponent {


  constructor (
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  openDialogCreateSignature() {
    console.log('Creando firma...')
    this.snackbar.open('Creando firma...', 'Aceptar', { duration: 3000 })
    this.dialog.open(CreateSignatureComponent)
  }
}
