
import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { RULE_PAGE_CADASTRAL_DA, TITULO_PAGE_CADASTRAL_DA } from '../../../../shared/constants/general/constants';
import {
  TableCadastralSearchComponent
} from 'src/app/apps/components/tables/table-cadastral-search/table-cadastral-search.component';

@Component({
  selector: 'vex-cadastral-search-da',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    MatButtonToggleModule,
    TableCadastralSearchComponent
],
  templateUrl: './cadastral-search-da.component.html',
  styleUrl: './cadastral-search-da.component.scss'
})
export class CadastralSearchDAComponent  {

  titlePage: string = TITULO_PAGE_CADASTRAL_DA;
  rulePage: string = RULE_PAGE_CADASTRAL_DA;


}
