import { Component, OnInit } from '@angular/core';
import { Link } from '@vex/interfaces/link.interface';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { AssistantsEditComponent } from '../components/contacts-edit/contacts-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../interfaces/contact.interface';
import { trackById } from '@vex/utils/track-by';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs/operators';
import { ContactsCardComponent } from '../components/contacts-card/contacts-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AssistantsService } from 'src/app/core/crud/assistantsService.service';
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { contactsData } from 'src/static-data/contacts';
import { MODAL_SMALL } from '../../../../../apps/constants/general/constants';


@Component({
  selector: 'vex-contacts-grid',
  templateUrl: './assistants-grid.component.html',
  styleUrls: ['./assistants-grid.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  standalone: true,
  imports: [
    MatIconModule,
    MatTabsModule,
    NgFor,
    MatButtonModule,
    MatTooltipModule,
    NgIf,
    ContactsCardComponent
  ]
})
export class AssistantsGridComponent implements OnInit {
  assistants: assistantData[] = [];

  filteredContacts$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('activeCategory')),
    map((activeCategory) => {
      switch (activeCategory) {
        case 'all': {
          return contactsData;
        }
        //agrego null para que filtre
        case null: {
          return contactsData;
        }
        //agrego null para que filtre
        case 'starred': {
          return contactsData.filter((c) => c.starred);
        }

        default: {
          return [];
        }
      }
    })
  );

  links: Link[] = [
    {
      label: 'All Contacts',
      route: '../all'
    },
    {
      label: 'Frequently Contacted',
      route: '../frequent'
    },
    {
      label: 'Starred',
      route: '../starred'
    }
  ];

  trackById = trackById;

  constructor(
    private dialogAssistant: MatDialog,
    private route: ActivatedRoute,
    private assistantsService: AssistantsService,
    ) {  }

  ngOnInit() {
    this.assistantsService.listAssistant(1).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filtra los asistentes con status === 1
          this.assistants = response.data.filter(assistant => assistant.status === 1);
        } else {
          this.assistants = [];
        }
        console.log('oninit:', this.assistants);
      },
      error: (error) => {
        console.log(error);
        this.assistants = [];
      }
    });
  }

  //modal
  openAssistant(id?: Contact['id']) {
    const assistantData = id ? this.assistants.find(assistant => assistant.id === id) : null;

    this.dialogAssistant.open(AssistantsEditComponent, {
      data: assistantData || {  // Si no hay datos, pasa un objeto vacío
        empresa: '',
        nombre: '',
        descripcion: ''
      },
      ...MODAL_SMALL,
    });
  }

  toggleStar(id: Contact['id']) {
    const contact = contactsData.find((c) => c.id === id);
    if (contact) {
      contact.starred = !contact.starred;
    }
  }
}
