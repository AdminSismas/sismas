/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';


import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { TITULO_PAGE_CADASTRAL_DA, RULE_PAGE_CADASTRAL_DA} from 'src/app/apps/constants/constant';
import { TableCadastralSearchComponent } from 'src/app/apps/components/table-cadastral-search/table-cadastral-search.component';

@Component({
  selector: 'vex-cadastral-search-da',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    TableCadastralSearchComponent
],
  templateUrl: './cadastral-search-da.component.html',
  styleUrl: './cadastral-search-da.component.scss'
})
export class CadastralSearchDAComponent {
titlePage: string = TITULO_PAGE_CADASTRAL_DA;
rulePage: string = RULE_PAGE_CADASTRAL_DA;

}
