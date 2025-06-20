import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-show-error-validate-alfa-main',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatRippleModule,
    ReactiveFormsModule
  ],
  templateUrl: './show-error-validate-alfa-main.component.html',
  styleUrl: './show-error-validate-alfa-main.component.scss',
  host: {
    class: 'h-full overflow-hidden'
  }
})
export class ShowErrorValidateAlfaMainComponent implements OnInit {
  listErrors: string[] = [];
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: string[]) {}

  ngOnInit() {
    if (this.defaults && this.defaults.length > 0) {
      this.listErrors = [...this.defaults];
    }

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  onFilterChange(value: string): void {
    if (!value) {
      this.listErrors = this.defaults;
      return;
    }

    value = value.trim();
    value = value.toLowerCase();
    this.listErrors = this.defaults.filter((val: string) => {
      if (val) {
        return val.toLowerCase().includes(value);
      }
      return val;
    });
  }

  copyError(error: string) {
    navigator.clipboard.writeText(error);
    Swal.fire({
      text: 'Error copiado al portapapeles',
      icon: 'info',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      timer: 2000
    });
  }
}
