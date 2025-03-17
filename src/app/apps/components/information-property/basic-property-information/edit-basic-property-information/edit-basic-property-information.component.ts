import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { ComboxColletionComponent } from '../../../general-components/combox-colletion/combox-colletion.component';
import {
  InformationPropertyService
} from 'src/app/apps/services/territorial-organization/information-property.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environments';

interface EditBasicPropertyInputs {

  groupName?:string;
  fields?: InputsField[];
}
interface InputsField {
  name: string;
  label: string;
  placeholder: string;
  collection: boolean;
  type: string;
  group:string;
  groupName:string
}

@Component({
  selector: 'vex-edit-basic-property-information',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDialogClose,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ComboxColletionComponent,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './edit-basic-property-information.component.html',
  styles: ``
})
export class EditBasicPropertyInformationComponent implements OnInit {
  public maxDate = new Date();

  public inputs: EditBasicPropertyInputs[] = [
    // GRUPO "Identificación del predio"
        {
        groupName:'Identificación del predio',
        fields:[
          {
            name: 'propertyRegistryOffice',
            label: 'Oficina de registro',
            collection: false,
            type: 'text',
            placeholder: 'Oficina de registro',
            group:'',
            groupName:'Identificación del predio'
          },
          {
            name: 'propertyRegistryNumber',
            label: 'Número de registro',
            collection: false,
            type: 'text',
            placeholder: 'Número de registro',
            group:'',
            groupName:'Identificación del predio'
          },

            {
              name: 'cadastralNumber',
              label: 'Número predial',
              collection: false,
              type: 'text',
              placeholder: 'Número predial',
              group:'',
              groupName:'Identificación del predio'
            },
            {
              name: 'cadastralLastNumber',
              label: 'Número predial anterior',
              collection: false,
              type: 'number',
              placeholder: 'Número predial anterior',
              group:'',
              groupName:'Identificación del predio'
            },
// *********** estos dos campo contituyen matricula inmobiliaria**********


// *********** estos dos campo contituyen matricula inmobiliaria**********
            {
              name: 'baunitIdOrigin',
              label: 'Nupre',
              collection: false,
              type: 'text',
              placeholder: 'Nupre',
              group:'',
              groupName:'Identificación del predio'
            },
            ]
            },
        {
        groupName:'Propiedad y uso',
          fields:[
              // *****GRUPO "Propiedad y uso" ****

                {
                // DEBE SER LISTA TIPO
                  name: 'domBaunitEconoDesti',
                  label: 'Destino económico',
                  collection: true,
                  type: 'BaunitEconoDesti',
                  placeholder: 'Destino económico',
                  group:'',
                  groupName:'Propiedad y uso'
                },
                // DEBE SER LISTA TIPO
                {
                  name: 'domBaunitType',
                  label: 'Tipo',
                  collection: true,
                  type: 'BaunitType',
                  placeholder: 'Tipo',
                  group:'',
                  groupName:'Propiedad y uso'
                },
                {
                  // DEBE SER LISTA TIPO
                  name: 'domBaunitCondition',
                  label: 'Condición propiedad',
                  collection: true,
                  type: 'BaunitCondition',
                  placeholder: 'Condición propiedad',
                  group:'',
                  groupName:'Propiedad y uso'
                },
                {
                  name: 'cadastralCreatedAt',
                  label: 'Inscripción catastral',
                  collection: false,
                  type: 'date',
                  placeholder: 'Inscripción catastral',
                  group:'',
                  groupName:'Propiedad y uso'
                },
                {
                  name: 'cadastralRegistryNumberTemp',
                  label: 'Código homologado',
                  collection: false,
                  type: 'text',
                  placeholder: 'Código homologado',
                  group:'',
                  groupName:'Propiedad y uso'
                },
            ]
        },
        {
          groupName:'Tamaños y áreas',
          fields:[
            // *****GRUPO "Tamaños y áreas" ****

              {
                name: 'propertyRegistryArea',
                label: 'Área registral',
                collection: false,
                type: 'text',
                placeholder: 'Área registral',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadastralArea',
                label: 'Área catastral',
                collection: false,
                type: 'text',
                placeholder: 'Área catastral',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadlAreaCommonE',
                label: 'Área catastral común',
                collection: false,
                type: 'text',
                placeholder: 'Área catastral común',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadAreaPrivate',
                label: 'Área catastral privada',
                collection: false,
                type: 'text',
                placeholder: 'Área catastral privada',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadastralAreaUnitbuilt',
                label: 'Área catastral construida',
                collection: false,
                type: 'text',
                placeholder: 'Área catastral construida',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadAreaUnitbuiltCommon',
                label: 'Área catastral construida común',
                collection: false,
                type: 'text',
                placeholder: 'Área catastral construida común',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadAreaUnitbuiltPrivate',
                label: 'Área catastral construida Privada',
                collection: false,
                type: 'text',
                placeholder: 'Área catastral construida Privada',
                group:'',
                groupName:'Tamaños y áreas'
              },
          ]
        },

  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: BasicInformationProperty,
    private fb: FormBuilder,
    private informationPropretyService: InformationPropertyService,
    private dialogRef: MatDialogRef<EditBasicPropertyInformationComponent>,
    private snackbar: MatSnackBar
  ) { }

  public form: FormGroup = this.fb.group({
    // GRUPO "Identificación del predio"
    "cadastralNumberFormat": ['', [Validators.required]],
    "cadastralNumber": ['', [Validators.required]],
    "cadastralLastNumber": ['', [Validators.min(0)]],
    "propertyRegistryOffice": [''],
    "propertyRegistryNumber": [''],
    "baunitIdOrigin": [''],

   // *****GRUPO "Propiedad y uso" ****

    "domBaunitEconoDesti": ['',[ Validators.required]],
    "domBaunitType": ['',[ Validators.required]],
    "domBaunitCondition": ['', [Validators.required]],
    "cadastralCreatedAt": [''],
    "cadastralRegistryNumberTemp": [''],

    // *****GRUPO "Tamaños y áreas" ****
    "propertyRegistryArea": [''],
    "cadastralArea": ['',[Validators.required,Validators.min(0)]],
    "cadlAreaCommonE": [''],
    "cadAreaPrivate": [''],
    "cadastralAreaUnitbuilt": [''],
    "cadAreaUnitbuiltCommon": [''],
    "cadAreaUnitbuiltPrivate": [''],

    // *****GRUPO "Seguimientos y actualizaciones" ****

     "cadastralLastEventAt": [''],
     "cadastralLastEventCode": [''],
     "updatedBy": [''],
     "updatedAt": ['']

  });

  ngOnInit(): void {
    this.form.reset(this.data);

    const newCadastraCreatedAt = new Date(this.data.cadastralCreatedAt  + 'T00:00:00-05:00');
    this.form.controls['cadastralCreatedAt'].setValue(newCadastraCreatedAt);

    const enableInputs: string[] = [
      'propertyRegistryOffice',
      'propertyRegistryNumber',
      'domBaunitEconoDesti',
      'domBaunitType',
      'cadastralCreatedAt',
      'cadAreaPrivate',
      'propertyRegistryArea',
      'cadastralArea'
    ];

    Object.keys(this.form.controls).forEach(field => {
      if ( !enableInputs.includes(field) ) {
        this.form.get(field)?.disable();
      }
    });
    if(environment.titulo === 'Manizales'){
      this.form.get('propertyRegistryOffice')?.disable();
      this.form.get('propertyRegistryOffice')?.setValue('100');
    }
  }

  editBasicInformationProperty() {
    console.log('valores formulario', this.form.value);
    this.informationPropretyService.updateBasicInformationProperty(
      this.data.executionId!,
      this.data.baunitIdE!,
      this.form.value
    )
    .subscribe({
      next: (data: BasicInformationProperty) => {
        this.snackbar.open('Se ha actualizado los aspectos generales del predio', 'CERRAR', {
          duration: 10000,
        });
        this.dialogRef.close(data);
      }
    });
  }
}
