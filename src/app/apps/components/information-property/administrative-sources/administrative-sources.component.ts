import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HeaderCadastralInformationPropertyComponent } from "../header-cadastral-information-property/header-cadastral-information-property.component";
import { AdministrativeSource } from 'src/app/apps/interfaces/information-property/administrative-source';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'vex-administrative-sources',
  standalone: true,
  imports: [
    MatExpansionModule,
    HeaderCadastralInformationPropertyComponent,
    MatTableModule
  ],
  templateUrl: './administrative-sources.component.html',
  styleUrl: './administrative-sources.component.scss'
})
export class AdministrativeSourcesComponent implements OnInit {
  @Input() public id: string = '';
  @Input() public expandedComponent: boolean = false;
  @Input() public baunitId?: string | null;
  @Input() public schema?: string;
  @Input() public executionId?: string | null;
  @Input() public typeInformation?: string;

  public displayedColumns: string[] = ['domFuenteAdministrativaTipo'];

  public example_data: AdministrativeSource[] = [
    {
      "fuenteAdminId": 13,
      "domFuenteAdministrativaTipo": "(Documento público) Sentencia judicial",
      "fechaDocumentoFuente": "2023-12-31",
      "numeroFuente": "SENTC_2023_1234_99999",
      "enteEmisor": "Juzgado segundo de Garzón unico",
      "hash": "-1617978730",
      "createdBy": "test7",
      "createdAt": "2024-11-25T14:08:45.23842",
      "updatedBy": "test7",
      "updatedAt": "2024-11-25T14:08:45.23842"
    },
    {
      "fuenteAdminId": 15,
      "domFuenteAdministrativaTipo": "(Documento público) Sentencia judicial",
      "fechaDocumentoFuente": "2023-12-14",
      "numeroFuente": "SENTC_2023_1234",
      "enteEmisor": "Juzgado segundo de Garzón",
      "hash": "1346114377",
      "createdBy": "test7",
      "createdAt": "2024-11-25T14:10:24.279511",
      "updatedBy": "test7",
      "updatedAt": "2024-11-25T14:10:24.279511"
    }
  ]


  ngOnInit(): void {
    if (this.id?.length > 0) {
      return
    }
  }


}
