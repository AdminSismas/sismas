import {
  Component,
  EventEmitter,
  Input,
  Output} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './header-tasks.component.html',
  styleUrl: './header-tasks.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class HeaderTasksComponent {
  searchStr: UntypedFormControl = new UntypedFormControl();

  @Input() public idHeader = '';
  @Input() public label = 'Tareas';
  @Input() public icon = '';
  @Input() public filterValue = '';

  @Output() outSearchStr = new EventEmitter<string>();

  onFilterChange () {
    const value = this.searchStr.value;

    if (this.isValueField(value)) {
      this.outSearchStr.emit(value);
    }
  }

  private isValueField(value: string) {
    return value !== null && value !== undefined;
  }
}
