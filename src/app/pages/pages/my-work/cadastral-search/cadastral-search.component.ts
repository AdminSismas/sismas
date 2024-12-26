import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableCadastralSearchComponent } from '../../../../apps/components/table-cadastral-search/table-cadastral-search.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.route.params.pipe(map((params) => {
      console.log(params);
    }))
  }

  ngAfterViewInit() {
  }

}
