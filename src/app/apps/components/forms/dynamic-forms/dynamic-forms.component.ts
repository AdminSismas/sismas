/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

/* Material Modules */
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/* Components */
import { ComboxColletionComponent } from '../../general-components/combox-colletion/combox-colletion.component';
import { JSONInput } from '../../../interfaces/forms/dynamic-forms';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TextAreaComponent } from '../../general-components/text-area/text-area.component';

@Component({
  selector: 'vex-dynamic-forms',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckbox,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    ComboxColletionComponent,
    NgxMatFileInputModule,
    TextAreaComponent
  ],
  templateUrl: './dynamic-forms.component.html',
  styleUrl: './dynamic-forms.component.scss',
})
export class DynamicFormsComponent implements OnInit, OnChanges {
  @Input({ required: true }) inputs: JSONInput[] = [];
  @Input() className = '';
  @Input() disabled = false;
  @Input() initValues: any | null = {};

  form: FormGroup = new FormGroup({});
  private dateFilters = new Map<string, (date: Date | null) => boolean>();

  @Output() formReady = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForm();
    this.createDateFilters();

    if (this.disabled) {
      this.form.disable();
    }

    if (this.initValues != null && this.initValues()) {
      this.form.reset(this.initValues());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.form) {
      if (changes['disabled'].currentValue) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }

    if (changes['initValues'] && this.form) {
      this.form.reset(this.initValues);
    }
  }

  private createDateFilters(): void {
    this.inputs
      .filter((input) => input.element === 'date')
      .forEach((dateInput) => {
        this.dateFilters.set(
          dateInput.name,
          this.createFilterForType(dateInput.type)
        );
      });
  }

  private createForm(): void {
    const formObject: any = {};
    this.inputs.forEach((input) => {
      formObject[input.name] = ['', input.validators];
    });

    this.form = this.fb.group(formObject);

    this.formReady.emit(this.form);

    this.form.valueChanges.subscribe(() => {
      this.formReady.emit(this.form);
    });
  }

  cssClassesForm(cssClasses: string | undefined): string {
    if (this.inputs.length === 1) return 'w-full h-full';
    if (cssClasses) {
      return cssClasses;
    } else {
      return 'w-full h-full grid grid-cols-2 grid-flow-row gap-x-4';
    }
  }

  cssClassesVerticalComponent(inpunt: JSONInput): string {
    if (inpunt?.verticalComponent != null && inpunt?.verticalComponent) {
      return 'form-content-item';
    } else {
      return 'w-full';
    }
  }

  cssClassesInput(cssClasses: string | undefined): string {
    if (cssClasses) {
      return cssClasses;
    } else {
      return 'w-full h-full';
    }
  }

  labelPositionToggle(input: JSONInput): 'before' | 'after' {
    if (input.type === 'before') {
      return 'before';
    }
    return 'after';
  }

  private createFilterForType(typeString: string): (date: Date | null) => boolean {
    return (date: Date | null): boolean => {
      if (!date) return true;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      switch (typeString) {
        case 'future':
          return date.getTime() >= today.getTime();
        case 'past':
          return date.getTime() <= today.getTime();
        case 'today':
          return date.getTime() === today.getTime();
        default:
          return true;
      }
    };
  }

  getDateFiler(inputName: string): (date: Date | null) => boolean {
    return this.dateFilters.get(inputName) || (() => true);
  }
}
