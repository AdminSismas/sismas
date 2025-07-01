import { AfterViewInit, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

export interface ModalResponse<T> {
  response: boolean;
  data?: T | null;
}

@Component({
  selector: 'app-modal-window',
  standalone: true,
  imports: [MatDialogModule, MatDividerModule, MatButtonModule, MatIconModule],
  host: {
    class: 'w-full h-full'
  },
  templateUrl: './modal-window.component.html'
})
export class ModalWindowComponent implements AfterViewInit {
  // INJECTS
  dialogRef = inject(MatDialogRef<ModalWindowComponent>);

  // INPUTS
  title = input<string>('Título ventana modal');
  actions = input(false, {
    transform: (value: boolean | string) =>
      typeof value === 'string' ? value === '' : value,
  });
  showCancelButton = input<boolean>(false);
  data = input<unknown | null>(null);

  // OUTPUTS
  dialog = output<MatDialogRef<ModalWindowComponent>>();
  accept = output<void>();

  ngAfterViewInit(): void {
    this.dialog.emit(this.dialogRef);
  }

  onAccept(): void {
    this.accept.emit();
  }
}
