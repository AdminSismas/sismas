import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AssistantsEditComponent } from '../contacts-edit/contacts-edit.component';
import { MatRippleModule } from '@angular/material/core';
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { VexConfigService } from '@vex/config/vex-config.service';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentsServicesService } from '../components.services.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContactsParamsComponent } from '../contacts-params/contacts-params.component';
import { MODAL_SMALL } from '../../../../../../shared/constants/general/constants';

@Component({
  selector: 'vex-contacts-card',
  templateUrl: './contacts-card.component.html',
  styleUrls: ['./contacts-card.component.scss'],
  standalone: true,
  imports: [
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    RouterLink
  ]
})
export class ContactsCardComponent implements OnInit {
  @Input() assistant!: assistantData;
  @Output() openContact = new EventEmitter<assistantData['id']>();
  @Output() toggleStar = new EventEmitter<assistantData['id']>();
  subject$: BehaviorSubject<assistantData[]> = new BehaviorSubject<assistantData[]>([]);
  data$: Observable<assistantData[]> = this.subject$.asObservable();
  allusers: assistantData[] = [];

  constructor(
    private configService: VexConfigService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private componentsServicesService: ComponentsServicesService
  ) { }

  ngOnInit() {
    if (this.assistant.status !== 1) {
      this.assistant = null!; // Evita procesar asistentes con status 0
    }
    // Cargar el footer
    this.footerVisibleChange(false);
    this.loadAssistants();
  }

  loadAssistants() {
    this.componentsServicesService.loadAssistants().subscribe((response) => {
      if (response.success) {
        // Filtra los usuarios para que solo aquellos con status 1 se muestren
        this.allusers = (response.data || []).filter(assistant => assistant.status === 1);
        this.subject$.next(this.allusers);
        this.cdr.markForCheck();
      }
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AssistantsEditComponent, {
      data: {
        id: this.assistant.id,
        idempresa: this.assistant.idempresa,
        empresa: this.assistant.empresa,
        id_asistente: this.assistant.id_asistente,
        nombre: this.assistant.nombre,
        descripcion: this.assistant.descripcion,
        instrucciones: this.assistant.instrucciones,
        modelo_predeterminado: this.assistant.modelo_predeterminado,
        modelo_actual: this.assistant.modelo_actual,
        cambiar_modelo: this.assistant.cambiar_modelo,
        openai: this.assistant.openai,
        anthropic: this.assistant.anthropic,
        google: this.assistant.google,
        llama: this.assistant.llama,
        cic: this.assistant.cic,
        escuchar: this.assistant.escuchar,
        hablar: this.assistant.hablar,
        archivos: this.assistant.archivos,
        codigo: this.assistant.codigo,
        tavily: this.assistant.tavily,
        wikipedia: this.assistant.wikipedia,
        pdf: this.assistant.pdf,
        bi: this.assistant.bi,
        video: this.assistant.video,
        imgurl: this.assistant.imgurl,
        status: this.assistant.status
      },
      ...MODAL_SMALL,
      disableClose: true
    });

    dialogRef.componentInstance.assistantUpdated.subscribe((updatedAssistant: assistantData) => {
      const index = this.allusers.findIndex((e) => e.id === updatedAssistant.id);
      if (index > -1) {
        this.allusers[index] = { ...updatedAssistant };
        this.assistant = { ...updatedAssistant };
        this.subject$.next([...this.allusers]);
        this.cdr.markForCheck();
      }
    });
  }

  openParamsModal() {
    const dialogRef = this.dialog.open(ContactsParamsComponent, {
      data: this.assistant,
      ...MODAL_SMALL,
      disableClose: true
    });

    dialogRef.componentInstance.assistantUpdated.subscribe((updatedAssistant: assistantData) => {
      const index = this.allusers.findIndex((e) => e.id === updatedAssistant.id);
      if (index > -1) {
        this.allusers[index] = { ...updatedAssistant };
        this.assistant = { ...updatedAssistant };
        this.subject$.next([...this.allusers]);
        this.cdr.markForCheck();
      }
    });
  }

  emitToggleStar(event: MouseEvent, contactId: assistantData['id']) {
    event.stopPropagation();
    this.toggleStar.emit(contactId);
  }

  footerVisibleChange(change: boolean): void {
    this.configService.updateConfig({
      footer: {
        visible: false
      }
    });
  }
}
