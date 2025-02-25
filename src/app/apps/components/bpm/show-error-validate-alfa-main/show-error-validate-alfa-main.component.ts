import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { FluidHeightDirective } from '../../../directives/fluid-height.directive';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';

@Component({
  selector: 'vex-show-error-validate-alfa-main',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    FluidHeightDirective,
    MatStepperModule,
    FluidHeightDirective,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './show-error-validate-alfa-main.component.html',
  styleUrl: './show-error-validate-alfa-main.component.scss'
})
export class ShowErrorValidateAlfaMainComponent implements OnInit {

  listErrors: string[] = [];
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: string[],
    private dialogRef: MatDialogRef<ShowErrorValidateAlfaMainComponent>,
  ) {
  }

  ngOnInit() {
    if(this.defaults && this.defaults.length > 0) {
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
    this.listErrors = this.defaults
      .filter((val: string) => {
        if (val) {
          return val.toLowerCase().includes(value);
        }
        return val;
      });
  }
}


