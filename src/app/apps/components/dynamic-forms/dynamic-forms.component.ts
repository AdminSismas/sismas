import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ComboxColletionComponent } from '../combox-colletion/combox-colletion.component';
import { JSONInput } from '../../interfaces/dynamic-forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'dynamic-forms',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ComboxColletionComponent,
    MatAutocompleteModule
  ],
  templateUrl: './dynamic-forms.component.html',
  styles: ``
})
export class DynamicFormsComponent implements OnInit{

  @Input({ required: true }) public inputs: JSONInput[] = []

  public form: FormGroup = new FormGroup({})

  @Output() formReady = new EventEmitter<FormGroup>()

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm()
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



}
