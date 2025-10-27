import { Component, inject, OnInit } from '@angular/core';
import { TableCadastralSearchComponent } from '../../../../apps/components/tables/table-cadastral-search/table-cadastral-search.component';
import { LoadingServiceService } from '@shared/services';

@Component({
  selector: 'vex-consult-properties',
  standalone: true,
  imports: [TableCadastralSearchComponent],
  templateUrl: './cadastral-search.component.html',
  styleUrl: './cadastral-search.component.scss'
})
export class CadastralSearchComponent implements OnInit {
  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );

  ngOnInit(): void {
    this.loadingServiceService.activateLoading(false);
  }
}
