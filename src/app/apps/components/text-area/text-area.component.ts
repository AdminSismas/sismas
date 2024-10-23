import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { getRandomInt } from '../../utils/general';

@Component({
  selector: 'vex-text-area',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class TextAreaComponent implements OnInit {

  @Input() cssClasses: string = '';
  @Input() hintValue: string = '';
  @Input() label: string = '';
  @Input() formControlNameInput: string = '';
  @Input() idTextArea: string = '';
  @Input() hideRequiredMarker: boolean = true;

  ngOnInit(): void {
    if (this.idTextArea.length>0) {
      this.idTextArea = this.idTextArea + getRandomInt(10000) + this.formControlNameInput;
    } else {
      this.idTextArea = getRandomInt(10000) + this.formControlNameInput;
    }
  }
}
