import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { BasicInformationProperty } from 'src/app/apps/interfaces/information-property/basic-information-property';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';

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
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ComboxColletionComponent,
    MatDatepickerModule
  ],
  templateUrl: './edit-basic-property-information.component.html',
  styles: ``
})
export class EditBasicPropertyInformationComponent implements OnInit {
  groupedInputs: any;
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
                  name: 'cadastralRegistryNumber',
                  label: 'Incripción catastral',
                  collection: false,
                  type: 'text',
                  placeholder: 'Incripción catastral',
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
                name: 'propertyRegistryAreaE',
                label: 'Área registral',
                collection: false,
                type: 'text',
                placeholder: 'Área registral',
                group:'',
                groupName:'Tamaños y áreas'
              },
              {
                name: 'cadastralAreaE',
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
                name: 'cadAreaPrivateE',
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
    "propertyRegistryOffice": ['', [Validators.required]],
    "propertyRegistryNumber": ['', [Validators.required]],
    "baunitIdOrigin": [''],

   // *****GRUPO "Propiedad y uso" ****

    "domBaunitEconoDesti": ['',[ Validators.required]],
    "domBaunitType": ['',[ Validators.required]],
    "domBaunitCondition": ['', [Validators.required]],
    "cadastralRegistryNumber": [''],
    "cadastralRegistryNumberTemp": [''],

    // *****GRUPO "Tamaños y áreas" ****
    "propertyRegistryAreaE": [''],
    "cadastralAreaE": ['',[Validators.required,Validators.min(0)]],
    "cadlAreaCommonE": [''],
    "cadAreaPrivateE": [''],
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
    Object.keys(this.form.controls).forEach(field => {
      if (field !== 'propertyRegistryOffice' && field !== 'propertyRegistryNumber' && field !== 'domBaunitEconoDesti' && field !== 'domBaunitType' && field !== 'cadastralRegistryNumber') {
        this.form.get(field)?.disable();
      }
    });
  }

  editBasicInformationProperty() {
    this.informationPropretyService.updateBasicInformationProperty(
      this.data.executionId as string,
      this!.data!.baunitIdE as string,
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

  groupInputsByGroupName(inputs: any[]): any {
    return inputs.reduce((groups, input) => {
      const groupName = input.groupName || 'Otros';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(input);
      return groups;
    }, {});
  }
}
