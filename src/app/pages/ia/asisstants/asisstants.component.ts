import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssistantsEditComponent } from './components/contacts-edit/contacts-edit.component';
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { ComponentsServicesService } from './components/components.services.service';
import { VexSecondaryToolbarComponent } from "@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component";
import { VexPageLayoutComponent } from "@vex/components/vex-page-layout/vex-page-layout.component";
import { VexBreadcrumbsComponent } from "@vex/components/vex-breadcrumbs/vex-breadcrumbs.component";
import { VexPageLayoutContentDirective } from "@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { MatIconModule } from '@angular/material/icon';
import { MODAL_SMALL } from '@shared/constants/constants';

@Component({
    selector: 'vex-asisstants',
    standalone: true,
    templateUrl: './asisstants.component.html',
    styleUrls: ['./asisstants.component.scss'],
    imports: [VexSecondaryToolbarComponent, VexPageLayoutComponent, VexBreadcrumbsComponent, VexPageLayoutContentDirective, MatIconModule]
})
export class AsisstantsComponent implements OnInit {
    assistants: assistantData[] = [];

    constructor(
        private dialog: MatDialog,
        private componentsServicesService: ComponentsServicesService
    ) { }

    ngOnInit() {
        this.componentsServicesService.assistant$.subscribe((assistants) => {
            this.assistants = assistants;
        });
        this.loadAssistants();
    }

    loadAssistants() {
        this.componentsServicesService.loadAssistants().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.assistants = response.data;
                } else {
                    this.assistants = [];
                }
            },
            error: (error) => {
                console.error('Error al cargar asistentes:', error);
                this.assistants = [];
            }
        });
    }

    openEditDialog(assistant: assistantData) {
        const dialogRef = this.dialog.open(AssistantsEditComponent, {
            data: assistant,
            ...MODAL_SMALL,
            disableClose: true
        });

        dialogRef.componentInstance.assistantUpdated.subscribe((updatedAssistant: assistantData) => {
            const index = this.assistants.findIndex(a => a.id === updatedAssistant.id);
            if (index !== -1) {
                this.assistants[index] = updatedAssistant;
            }
            this.componentsServicesService.assistantSubject.next(this.assistants);
        });
    }
}
