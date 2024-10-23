import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-header-tasks',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms],
  imports: [
    FormsModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './header-tasks.component.html',
  styleUrl: './header-tasks.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class HeaderTasksComponent implements OnInit, OnChanges {
  searchStr: UntypedFormControl = new UntypedFormControl();

  @Input() public idHeader: string = '';
  @Input() public label: string = 'Tareas';
  @Input() public icon: string = '';

  @Output() outSearchStr = new EventEmitter<string>();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
  }

  ngOnInit(): void {
    if (this.idHeader?.length > 0) {
      this.idHeader = this.idHeader + this.getRandomInt(10000);
    } else {
      this.idHeader = this.getRandomInt(10000) + this.label?.trim();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.searchStr.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (this.isValueField(value)) {
          this.outSearchStr.emit(value);
        }
      });
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  private isValueField(value: any) {
    return value !== null && value !== undefined && value !== '';
  }
}
