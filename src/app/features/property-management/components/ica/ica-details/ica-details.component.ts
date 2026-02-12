import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
import {
  IcaDetails,
  IcaResponse
} from '@features/property-management/models/ica';
import { DatePipe } from '@angular/common';
import { NAME_NO_DISPONIBLE } from '@shared/constants/constants';

enum IcaDetailLabel {
  cadastral_number = 'NPN',
  baunit_id = 'Número de ficha',
  npn_format = 'Formato NPN',
  departamento = 'Departamento',
  municipio = 'Municipio',
  ciudadCamara = 'Ciudad Camara',
  direccionResidencia = 'Dirección Residencia',
  domActividadPrincipal = 'Actividad Principal',
  domActividadSecundaria = 'Actividad Secundaria',
  domicilioNotificacion = 'Domicilio Notificación',
  domIndividualType = 'Tipo de persona',
  domIndividualTypeNumber = 'Tipo de documento',
  documentoIdentidad = 'Número de documento',
  email = 'Email',
  escritura = 'Escritura',
  estadoRegistroMercantil = 'Estado Registro Mercantil',
  fechaInicioActividades = 'Fecha Inicio Actividades',
  fechaMatricula = 'Fecha Matrícula',
  granContribuyente = 'Gran Contribuyente',
  inscritoCc = 'Cédula inscrita',
  matricula = 'Matricula',
  nombreEstablecimiento = 'Nombre Establecimiento',
  nombresPersona = 'Nombre(s) de la Persona',
  apellidosPersona = 'Apellido(s) de la Persona',
  notificacionElectronica = 'Notificación Electrónica',
  regimenTributario = 'Régimen Tributario',
  telefono = 'Teléfono'
}

@Component({
  selector: 'vex-ica-details',
  standalone: true,
  imports: [ModalWindowComponent, DatePipe],
  templateUrl: './ica-details.component.html'
})
export class IcaDetailsComponent {
  /* ---- Injects ---- */
  public readonly icaResponse: IcaResponse = inject(MAT_DIALOG_DATA);

  /* ---- Properties ---- */
  public readonly title = 'Detalles ICA';
  protected readonly icaDetails = IcaDetails.mapToIcaDetails(this.icaResponse);
  protected readonly labelsOrder: (keyof typeof IcaDetailLabel)[] = [
    'cadastral_number',
    'baunit_id',
    'npn_format',
    'departamento',
    'municipio',
    'domActividadPrincipal',
    'domActividadSecundaria',
    'nombresPersona',
    'apellidosPersona',
    'nombreEstablecimiento',
    'domIndividualType',
    'domIndividualTypeNumber',
    'documentoIdentidad',
    'inscritoCc',
    'regimenTributario',
    'telefono',
    'email',
    'notificacionElectronica',
    'escritura',
    'granContribuyente',
    'fechaMatricula',
    'fechaInicioActividades',
    'estadoRegistroMercantil',
    'ciudadCamara',
    'matricula',
    'direccionResidencia',
    'domicilioNotificacion'
  ];

  /* ---- Methods ---- */
  labelDetail(key: keyof typeof IcaDetailLabel) {
    return IcaDetailLabel[key];
  }

  public get NoData(): string {
    return NAME_NO_DISPONIBLE;
  }
}
