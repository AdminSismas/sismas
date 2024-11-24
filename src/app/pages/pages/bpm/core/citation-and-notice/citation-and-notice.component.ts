import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CitationAndNoticeTableMenuComponent } from './citation-and-notice-table-menu/citation-and-notice-table-menu.component';
import { CitationAndNoticeTableComponent } from './citation-and-notice-table/citation-and-notice-table.component';
import { AsyncPipe } from '@angular/common';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { Contact } from '../../../../../apps/interfaces/bpm/contact.interface';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contactsData } from '../../../../../../static-data/contacts';

@Component({
  selector: 'vex-citation-and-notice',
  templateUrl: './citation-and-notice.component.html',
  styleUrl: './citation-and-notice.component.scss',
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
  styles: [
    `
      .mat-drawer-container {
        background: transparent !important;
      }
    `
  ],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSidenavModule,
    CitationAndNoticeTableMenuComponent,
    CitationAndNoticeTableComponent,
    AsyncPipe
  ]
})
export class CitationAndNoticeComponent implements OnInit {
  searchCtrl = new UntypedFormControl();

  searchStr$ = this.searchCtrl.valueChanges.pipe(debounceTime(10));

  menuOpen = false;

  activeCategory:
    | 'frequently'
    | 'starred'
    | 'all'
    | 'family'
    | 'friends'
    | 'colleagues'
    | 'business' = 'all';
  tableData = contactsData;
  tableColumns: TableColumn<Contact>[] = [
    {
      label: '',
      property: 'selected',
      type: 'checkbox',
      cssClasses: ['w-6']
    },
    {
      label: '',
      property: 'imageSrc',
      type: 'image',
      cssClasses: ['min-w-9']
    },
    {
      label: 'NAME',
      property: 'name',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'EMAIL',
      property: 'email',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'PHONE',
      property: 'phone',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: '',
      property: 'starred',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    },
    {
      label: '',
      property: 'menu',
      type: 'button',
      cssClasses: ['text-secondary', 'w-10']
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  openContact(id?: Contact['id']) {
    // this.dialog.open(ContactsEditComponent, {
    //   data: id || null,
    //   width: '600px'
    // });
  }

  toggleStar(id: Contact['id']) {
    const contact = this.tableData.find((c) => c.id === id);

    if (contact) {
      contact.starred = !contact.starred;
    }
  }

  setData(data: Contact[]) {
    this.tableData = data;
    this.menuOpen = false;
  }

  openMenu() {
    this.menuOpen = true;
  }
}
