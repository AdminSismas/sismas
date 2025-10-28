import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { IcaDetails } from 'src/app/apps/components/information-property/baunit-ica/interfaces/ica-details';
import { DatePipe } from '@angular/common';
import { NAME_NO_DISPONIBLE } from '@shared/constants';

enum IcaDetailLabel {
  accion = 'Acción',
  ciudadCamara = 'Ciudad Camara',
  direccionResidencia = 'Dirección Residencia',
  domActividadPrincipal = 'Actividad Principal',
  domActividadSecundaria = 'Actividad Secundaria',
  domicilioNotificacion = 'Domicilio Notificación',
  domIndividualType = 'Tipo de documento',
  domIndividualTypeNumber = 'Número de documento',
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
  prediador = 'Prediador',
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
  public readonly icaResponse = inject(MAT_DIALOG_DATA);

  /* ---- Properties ---- */
  public readonly title = 'Detalles ICA';
  protected readonly icaDetails = IcaDetails.mapToIcaDetails(this.icaResponse);
  protected readonly labelsOrder: (keyof typeof IcaDetailLabel)[] = [
    'domActividadPrincipal',
    'domActividadSecundaria',
    'nombresPersona',
    'apellidosPersona',
    'nombreEstablecimiento',
    'domIndividualType',
    'domIndividualTypeNumber',
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
    'prediador',
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
