import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SyncMainService } from 'src/app/apps/services/bpm/sync-main.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-syn-main',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatProgressSpinnerModule
    // Custom
  ],
  templateUrl: './syn-main.component.html',
  styleUrl: './syn-main.component.scss'
})
export class SynMainComponent {
  @Input() public executionId = '';
  @Input() private mode = 1;
  @Input({ required: true }) public resources: string[] = [];

  loading = false;

  constructor(private syncMainService: SyncMainService) {}

  syncChanges() {
    this.loading = true;
    this.syncMainService.synchronizeChanges(this.executionId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Cambios sincronizados',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          showCancelButton: false
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
