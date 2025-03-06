import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgClass, NgForOf } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CollectionServices } from '../../../services/general/collection.service';
import { DomainCalificationCollection, DomainCollection } from '../../../interfaces/general/domain-name.model';
import { MatTableModule } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'vex-combox-colletion',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    MatTableModule,
    NgClass,
    CommonModule
  ],
  templateUrl: './combox-colletion.component.html',
  styleUrl: './combox-colletion.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ComboxColletionComponent implements OnInit {

  options: DomainCollection[] = [];
  calificationOptions: DomainCalificationCollection[] = [];

  @Input() public label = '';
  @Input() public formControlNameCombobox = '';
  @Input() public typeDomainName = '';
  @Input() public typeCalificationDomainName = '';
  @Input() public placeholderDomainName?: string;
  @Input() public idComboCollection = '';
  @Input() public cssClasses?: string;
  @Input() public valueReturn: string | undefined = 'dispname';
  @Input() public hintValue: string | null = null;
  @Input() public hideRequiredMarker = true;
  @Input() public queryParams: Record<string, string | number | boolean> = {};

  @Output() selectionChange = new EventEmitter<any>();

  loading: boolean = false; // Indicador de carga

  constructor(
    private collectionServicesService: CollectionServices
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    let textID: string = 'ValidateExtID' + this.getRandomInt(10);
    if (this.validateFiel(this.typeDomainName)) {
      textID = this.typeDomainName;
    }
    if (this.idComboCollection?.length > 0) {
      this.idComboCollection = this.idComboCollection + this.getRandomInt(10000) + textID;
    } else {
      this.idComboCollection = this.getRandomInt(10000) + textID;
    }

    if (this.validateFiel(this.typeDomainName)) {
      this.obtainsCollectionsList();
      this.obtainsCalificationCollectionsList();
    } else if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      this.obtainsCollectionsListParams();
    }

    this.cssClasses = !this.cssClasses ? 'mainClass' : this.cssClasses;
  }

  obtainsCollectionsList() {
    if (this.typeDomainName != null && this.typeDomainName.length > 0) {
      this.collectionServicesService.getDataDomainName(this.typeDomainName)
        .subscribe(
          (result: DomainCollection[]) => this.captureInformationSubscribe(result)
        );
    }
  }

  obtainsCollectionsListParams() {
    let params: HttpParams = new HttpParams();
    if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      Object.entries(this.queryParams).forEach(([key, value]) => {
        params = params.append(key, value.toString());
      });
    }
    this.collectionServicesService.getDataDomainNameParams(params).subscribe(
      (result: DomainCollection[]) => this.captureInformationSubscribe(result)
    );
  }

  obtainsCalificationCollectionsList() {
    if (this.typeCalificationDomainName != null && this.typeCalificationDomainName.length > 0) {
      this.collectionServicesService.getCalificationDataDomainName(this.typeCalificationDomainName)
        .subscribe(
          (result: DomainCalificationCollection[]) => this.captureCalificationInformationSubscribe(result)
        );
    }
  }

  captureCalificationInformationSubscribe(result: DomainCalificationCollection[]) {
    this.calificationOptions = result;
  }

  captureInformationSubscribe(result: DomainCollection[]) {
    if (result != null && result.length > 0) {
      result = result.filter(dmc => dmc.inactive === false);
    }
    this.options = result;
    this.loading = false;
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  onSelectionChange(value: any) {
    this.selectionChange.emit(value);
  }

  validateFiel(value: string | number | false | true) {
    return value && value !== undefined && value !== null && value !== '';
  }
}
