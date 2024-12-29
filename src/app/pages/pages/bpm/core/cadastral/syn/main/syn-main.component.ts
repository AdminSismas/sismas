import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SyncMainService } from 'src/app/apps/services/bpm/sync-main.service';

@Component({
  selector: 'vex-syn-main',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    // Custom
  ],
  templateUrl: './syn-main.component.html',
  styleUrl: './syn-main.component.scss'
})
export class SynMainComponent implements OnInit {
  @Input() public id = '';
  @Input() public executionId = '';

  constructor(
    private syncMainService: SyncMainService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id = this.id + this.getRandomInt(100000)
        + 'AlfaMainComponent' + this.getRandomInt(10);
    } else {
      this.id = this.getRandomInt(10000)
        + 'AlfaMainComponent' + this.getRandomInt(10);
    }
  }


  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


  syncChanges() {
    console.log('Sync changes');
    console.log('Execution ID:', this.executionId);

    this.syncMainService.synchronizeChanges(this.executionId)
      .subscribe({
        next: (response: string) => {
          this.snackbar.open('Cambios sincronizados', 'Aceptar', { duration: 3000 });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.snackbar.open(error.error, 'Aceptar', { duration: 3000 });
          } else {
            this.snackbar.open('Error al sincronizar cambios', 'Aceptar', { duration: 3000 });
          }
        }
      });
  }
}
