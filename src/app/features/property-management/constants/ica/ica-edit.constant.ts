import { Validators } from "@angular/forms";
import { IcaResponse } from "@shared/interfaces";
import { JSONInput } from "@shared/interfaces/forms";
import { GeneralValidationsService } from "@shared/services/general/validations/general-validations.service";

const generalValidators = new GeneralValidationsService();

export const ICA_EDIT_INPUTS: JSONInput[] = [
  {
    name: 'domActividadPrincipal',
    label: 'Actividad Principal',
    placeholder: 'Actividad Principal',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'domActividadSecundaria',
    label: 'Actividad Secundaria',
    placeholder: 'Actividad Secundaria',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'primerNombre',
    label: 'Primer Nombre',
    placeholder: 'Primer Nombre',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'segundoNombre',
    label: 'Segundo Nombre',
    placeholder: 'Segundo Nombre',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'primerApellido',
    label: 'Primer Apellido',
    placeholder: 'Primer Apellido',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'segundoApellido',
    label: 'Segundo Apellido',
    placeholder: 'Segundo Apellido',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'nombreEstablecimiento',
    label: 'Nombre Establecimiento',
    placeholder: 'Nombre Establecimiento',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'domIndividualType',
    label: 'Tipo de persona',
    placeholder: 'Tipo de persona',
    element: 'collection',
    type: 'IndividualType',
    validators: [Validators.required]
  },
  {
    name: 'domIndividualTypeNumber',
    label: 'Tipo de documento',
    placeholder: 'Tipo de documento',
    element: 'collection',
    type: 'IndividualTypeNumber',
    validators: [Validators.required]
  },
  {
    name: 'documentoIdentidad',
    label: 'Número de documento',
    placeholder: 'Número de documento',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'inscritoCc',
    label: 'Cédula inscrita',
    placeholder: 'Cédula inscrita',
    element: 'select',
    type: 'text',
    options: [{ label: 'Si', value: true }, { label: 'No', value: false }],
    validators: [Validators.required]
  },
  {
    name: 'regimenTributario',
    label: 'Régimen Tributario',
    placeholder: 'Régimen Tributario',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'telefono',
    label: 'Teléfono',
    placeholder: 'Teléfono',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Email',
    element: 'input',
    type: 'text',
    validators: [generalValidators.emailValidator]
  },
  {
    name: 'notificacionElectronica',
    label: 'Notificación Electrónica',
    placeholder: 'Notificación Electrónica',
    element: 'select',
    type: 'boolean',
    options: [{ label: 'Si', value: true }, { label: 'No', value: false }],
    validators: [Validators.required]
  },
  {
    name: 'escritura',
    label: 'Escritura',
    placeholder: 'Escritura',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'granContribuyente',
    label: 'Gran Contribuyente',
    placeholder: 'Gran Contribuyente',
    element: 'select',
    type: 'boolean',
    options: [{ label: 'Si', value: true }, { label: 'No', value: false }],
    validators: [Validators.required]
  },
  {
    name: 'fechaMatricula',
    label: 'Fecha Matrícula',
    placeholder: 'Fecha Matrícula',
    element: 'date',
    type: 'date',
    validators: []
  },
  {
    name: 'fechaInicioActividades',
    label: 'Fecha Inicio Actividades',
    placeholder: 'Fecha Inicio Actividades',
    element: 'date',
    type: 'date',
    validators: []
  },
  {
    name: 'estadoRegistroMercantil',
    label: 'Estado Registro Mercantil',
    placeholder: 'Estado Registro Mercantil',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'ciudadCamara',
    label: 'Ciudad Camara',
    placeholder: 'Ciudad Camara',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'matricula',
    label: 'Matricula',
    placeholder: 'Matricula',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'direccionResidencia',
    label: 'Dirección Residencia',
    placeholder: 'Dirección Residencia',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'domicilioNotificacion',
    label: 'Domicilio Notificación',
    placeholder: 'Domicilio Notificación',
    element: 'input',
    type: 'text',
    validators: []
  }
];

export const EXAMPLE_TEST_ICA_CREATE: Partial<IcaResponse> = {
  nombreEstablecimiento: 'Nombre Establecimiento',
  primerNombre: 'Juan',
  primerApellido: 'Perez',
  domActividadPrincipal: 'Restaurante',
  domIndividualTypeNumber: 'Cédula de ciudadanía',
  domIndividualType: 'Persona natural',
  documentoIdentidad: '1020304050',
  inscritoCc: true,
  notificacionElectronica: true,
  granContribuyente: false,
};
