// Angular framework
import { Component, ViewChild } from '@angular/core';

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
import {
  TableDigitalizedSignaturesComponent
} from '@pages/configuration/digitalized-signatures/table-digitalized-signatures.component';
import {
  CreateSignatureComponent
} from '@features/configuration/components/digitalized-signatures/create-signature/create-signature.component';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { map, Observable } from 'rxjs';

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

  isNotDesktop$: Observable<boolean> = this.layoutService.isDesktop$.pipe(map((isDesktop) => !isDesktop));
  @ViewChild(TableDigitalizedSignaturesComponent) tableDigitalizedSignaturesComponent!: TableDigitalizedSignaturesComponent;

  constructor (
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private layoutService: VexLayoutService,
  ) {}

  openDialogCreateSignature() {
    this.dialog.open(CreateSignatureComponent)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.snackbar.open('Firma agregada', 'Aceptar', { duration: 10000 });
          this.tableDigitalizedSignaturesComponent.getDataDigitalizedSignatures();
        }
      });
  }
}
