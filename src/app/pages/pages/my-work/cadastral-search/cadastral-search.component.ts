import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableCadastralSearchComponent } from '../../../../apps/components/table-cadastral-search/table-cadastral-search.component';

@Component({
  selector: 'vex-consult-properties',
  standalone: true,
  imports: [
    TableCadastralSearchComponent
  ],
  templateUrl: './cadastral-search.component.html',
  styleUrl: './cadastral-search.component.scss'
})
export class CadastralSearchComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
  }

}
