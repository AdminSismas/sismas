import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { map, Observable, startWith } from 'rxjs';

/* Material Modules */
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/* Components */
import { ComboxColletionComponent } from '../combox-colletion/combox-colletion.component';
import { JSONInput } from '../../interfaces/dynamic-forms';

@Component({
  selector: 'dynamic-forms',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgClass,
    /* Material */
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    /* Custom */
    ComboxColletionComponent,
  ],
  templateUrl: './dynamic-forms.component.html',
  styles: ``
})
export class DynamicFormsComponent implements OnInit{

  @Input({ required: true }) public inputs: JSONInput[] = []
  @Input() public initValues: any = {}
  @Input() public className: string = '';

  public form: FormGroup = new FormGroup({})
  public options$: { [key: string]: Observable<string[]> | undefined } = {}

  @Output() formReady = new EventEmitter<FormGroup>()

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm()

    this.inputs.forEach((input: JSONInput) => {
      if (input.element === 'autocomplete') {
        this.options$[input.name] = this.form.get(input.name)!.valueChanges.pipe(
          startWith(''),
          map((value: string) => input.autocompleteOptions!.filter(
            (option: any) => option.toLowerCase().includes(value.toLowerCase() || ''))
          )
        )
      }
    })

    if (this.initValues) {
      this.form.reset(this.initValues)
    }
  }

  private createForm (): void {
    const formObject: any = {}
    this.inputs.forEach(input => {
      formObject[input.name] = ['', input.validators]
    })

    this.form = this.fb.group(formObject)

    this.formReady.emit(this.form)

    this.form.valueChanges.subscribe(value => {
      this.formReady.emit(this.form)
    })
  }

  cssClassesForm(cssClasses: string): string {
    if (cssClasses) {
      return cssClasses
    } else {
      return 'w-full h-full grid grid-cols-2 grid-flow-row gap-x-4'
    }
  }


  cssClassesInput(cssClasses: string | undefined): string {
    if (cssClasses) {
      return cssClasses
    } else {
      return 'w-full h-full'
    }
  }
}
