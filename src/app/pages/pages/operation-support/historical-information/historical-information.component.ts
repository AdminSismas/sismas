import { Component} from '@angular/core';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { INFORMATION_HISTORICAL, RULE_PAGE_HISTORICAL } from '../../../../apps/constants/general/constant';


import { MatCheckboxModule } from '@angular/material/checkbox';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { TableCadastralSearchComponent } from 'src/app/apps/components/tables/table-cadastral-search/table-cadastral-search.component';

@Component({
  selector: 'vex-historical-information',
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    MatCheckboxModule,
    VexPageLayoutComponent,
    TableCadastralSearchComponent
  ],
  templateUrl: './historical-information.component.html',
  styleUrl: './historical-information.component.scss'
})
export class HistoricalInformationComponent  {

    titlePage: string = INFORMATION_HISTORICAL;
    rulePage: string = RULE_PAGE_HISTORICAL;


}
