import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';

interface EditBasicPropertyInputs {
  name: string;
  label: string;
  placeholder: string;
  collection: boolean;
  type: string;
}

@Component({
  selector: 'vex-edit-basic-property-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ComboxColletionComponent
  ],
  templateUrl: './edit-basic-property-information.component.html',
  styles: ``
})
export class EditBasicPropertyInformationComponent implements OnInit {

  public inputs: EditBasicPropertyInputs[] = [
    {
      name: 'propertyRegistryOffice',
      label: 'Oficina de registro',
      collection: false,
      type: 'text',
      placeholder: 'Nombre de la oficina de registro'
    },
    {
      name: 'propertyRegistryNumber',
      label: 'Número de registro',
      collection: false,
      type: 'text',
      placeholder: 'Número de registro'
    },
    {
      name: 'propertyRegistryArea',
      label: 'Área de registro',
      collection: false,
      type: 'number',
      placeholder: 'Área de registro'
    },
    {
      name: 'cadastralArea',
      label: 'Área de cadastro',
      collection: false,
      type: 'number',
      placeholder: 'Área de cadastro'
    },
    {
      name: 'cadastralNumber',
      label: 'Número de cadastro',
      collection: false,
      type: 'text',
      placeholder: 'Número de cadastro'
    },
    {
      name: 'cadastralLastNumber',
      label: 'Último número de cadastro',
      collection: false,
      type: 'text',
      placeholder: 'Último número de cadastro'
    },
    {
      name: 'cadastralRegistryNumberTemp',
      label: 'Número temporal de registro',
      collection: false,
      type: 'text',
      placeholder: 'Número temporal de registro'
    },
    {
      name: 'cadastralRegistryNumber',
      label: 'Número de registro',
      collection: false,
      type: 'text',
      placeholder: 'Número de registro'
    },
    {
      name: 'domBaunitType',
      label: 'Tipo de unidad',
      collection: true,
      type: 'BaunitType',
      placeholder: 'Elejir un tipo de unidad'
    },
    {
      name: 'domBaunitCondition',
      label: 'Condición de la unidad',
      collection: true,
      type: 'BaunitCondition',
      placeholder: 'Elejir una condición de la unidad'
    },
    {
      name: 'domBaunitEconoDesti',
      label: 'Destino económico',
      collection: true,
      type: 'BaunitEconoDesti',
      placeholder: 'Elejir un destino económico'
    },
    {
      name: 'domBaunitProcessType',
      label: 'Tipo de proceso',
      collection: true,
      type: 'BaunitProcessType',
      placeholder: 'Elijir un tipo de proceso'
    }
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BasicInformationProperty,
    private fb: FormBuilder
  ) { }

  public form: FormGroup = this.fb.group({
    "propertyRegistryOffice": ['', Validators.required],
    "propertyRegistryNumber": ['', Validators.required],
    "propertyRegistryArea": ['', Validators.required],
    "cadastralArea": ['', Validators.required],
    "cadastralNumber": ['', Validators.required],
    "cadastralLastNumber": ['', Validators.required],
    "cadastralRegistryNumberTemp": ['', Validators.required],
    "cadastralRegistryNumber": ['', Validators.required],
    "domBaunitType": ['', Validators.required],
    "domBaunitCondition": ['', Validators.required],
    "domBaunitEconoDesti": ['', Validators.required],
    "domBaunitProcessType": ['', Validators.required]
  })

  ngOnInit(): void {
    this.form.reset(this.data);
  }
}
