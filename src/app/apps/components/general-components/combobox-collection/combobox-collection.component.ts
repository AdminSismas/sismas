import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgClass } from '@angular/common';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule
} from '@angular/forms';
import { CollectionServices } from '../../../services/general/collection.service';
import { DomainCollection } from '../../../interfaces/general/domain-name.model';
import { MatTableModule } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { STRING_INFORMATION_NOT_FOUND } from '../../../constants/general/constants';

@Component({
  selector: 'vex-combox-colletion',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    NgClass,
    CommonModule
  ],
  templateUrl: './combobox-collection.component.html',
  styleUrl: './combobox-collection.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class ComboboxCollectionComponent implements OnInit, OnChanges {
  options: DomainCollection[] = [];

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
  @Input() public validateInactiveCollection = false;
  @Input() public queryParams: Record<string, string | number | boolean> = {};
  @Input() public optionsExternal: DomainCollection[] = [];
  @Input({ transform: (value: string | boolean) => {
    if (typeof value === 'boolean') return value;
    if (value === '') return true;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return false;
  } }) public valueCode = false;

  @Output() selectionChange = new EventEmitter<any>();

  loading = false; // Indicador de carga

  constructor(private collectionServicesService: CollectionServices) {}

  ngOnInit(): void {
    this.loading = true;
    let textID: string = 'ValidateExtID' + this.getRandomInt(10);
    if (this.validateFiel(this.typeDomainName)) {
      textID = this.typeDomainName;
    }
    if (this.idComboCollection?.length > 0) {
      this.idComboCollection =
        this.idComboCollection + this.getRandomInt(10000) + textID;
    } else {
      this.idComboCollection = this.getRandomInt(10000) + textID;
    }

    if (this.validateFiel(this.typeDomainName)) {
      this.obtainsCollectionsList();
    } else if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      this.obtainsCollectionsListParams();
    }

    this.cssClasses = !this.cssClasses ? 'mainClass' : this.cssClasses;
  }

  obtainsCollectionsList() {
    if (this.typeDomainName != null && this.typeDomainName.length > 0) {
      this.collectionServicesService
        .getDataDomainName(this.typeDomainName)
        .subscribe((result: DomainCollection[]) =>
          this.captureInformationSubscribe(result)
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
    this.collectionServicesService
      .getDataDomainNameParams(params)
      .subscribe((result: DomainCollection[]) =>
        this.captureInformationSubscribe(result)
      );
  }

  captureInformationSubscribe(result: DomainCollection[]) {
    if (
      result != null &&
      result.length > 0 &&
      this.validateInactiveCollection
    ) {
      result = result.filter((dmc) => dmc.inactive === false);
    }
    this.options = result;
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['optionsExternal'] &&
      this.optionsExternal.length > 0 &&
      !this.validateFiel(this.typeDomainName) &&
      (!this.queryParams || Object.keys(this.queryParams).length <= 0)
    ) {
      this.captureInformationSubscribe(this.optionsExternal);
    }
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

  protected readonly STRING_INFORMATION_NOT_FOUND =
    STRING_INFORMATION_NOT_FOUND;
}
