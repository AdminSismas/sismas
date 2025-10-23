/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
  signal,
  inject,
  effect,
  OnDestroy
} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

/* Material Modules */
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/* Components */
import { ComboboxCollectionComponent } from '@shared/components';
import { JSONInput } from '@shared/interfaces';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TextAreaComponent } from '@shared/components';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'src/app/apps/constants/general/constants';
import { output } from '@angular/core';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-forms',
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
    ComboboxCollectionComponent,
    NgxMatFileInputModule,
    TextAreaComponent
  ],
  templateUrl: './dynamic-forms.component.html',
  styleUrl: './dynamic-forms.component.scss',
  providers: [
    provideMomentDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class DynamicFormsComponent implements OnInit, OnChanges, OnDestroy {
  private fb = inject(FormBuilder);

  inputs = input.required<JSONInput[]>();
  className = input<string>('');
  disabled = input<boolean>(false);
  initValues = input<any | null>(null);

  form = signal(this.fb.group({}));
  private dateFilters = new Map<string, (date: Moment | null) => boolean>();
  private formValueChanges = signal<Subscription | undefined>(undefined);

  formReady = output<FormGroup>();
  // new EventEmitter<FormGroup>();

  resetFormEffect = effect(() => {
    if (this.initValues()) {
      this.form().reset(this.initValues()!);
    }
  });

  ngOnInit(): void {
    this.createForm();
    this.createDateFilters();

    if (this.disabled()) {
      this.form().disable();
    }

    if (this.initValues()) {
      this.form().reset(this.initValues()!);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.form) {
      if (changes['disabled'].currentValue) {
        this.form().disable();
      } else {
        this.form().enable();
      }
    }

    if (changes['initValues'] && this.form) {
      this.form().reset(this.initValues()!);
    }
  }

  ngOnDestroy(): void {
    this.formValueChanges()?.unsubscribe();
    this.formValueChanges.set(undefined);
  }

  private createDateFilters(): void {
    this.inputs()
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
    this.inputs().forEach((input) => {
      formObject[input.name] = ['', input.validators];
    });

    this.form.set(this.fb.group(formObject));

    this.formReady.emit(this.form());

    this.formValueChanges.set(this.form().valueChanges.subscribe(() => {
      this.formReady.emit(this.form());
    }));
  }

  cssClassesForm(cssClasses: string | undefined): string {
    if (this.inputs().length === 1) return 'w-full h-full';
    if (cssClasses) {
      return cssClasses;
    } else {
      return 'w-full h-full grid grid-cols-2 grid-flow-row gap-x-4';
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

  private createFilterForType(
    typeString: string
  ): (date: Moment | null) => boolean {
    return (date: Moment | null): boolean => {
      if (!date) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateToCompare = date.toDate();
      dateToCompare.setHours(0, 0, 0, 0);

      switch (typeString) {
        case 'future':
          return dateToCompare.getTime() >= today.getTime();
        case 'past':
          return dateToCompare.getTime() <= today.getTime();
        case 'today':
          return dateToCompare.getTime() === today.getTime();
        default:
          return true;
      }
    };
  }

  getDateFiler(inputName: string): (date: Moment | null) => boolean {
    return this.dateFilters.get(inputName) || (() => true);
  }

  onFileSelected(event: Event, controlName: string): void {
    const element = event.target as HTMLInputElement;
    let file: File | null = null;
    if (element.files && element.files.length > 0) {
      file = element.files[0];
    }

    this.form().get(controlName)!.patchValue(file);

  }
}
