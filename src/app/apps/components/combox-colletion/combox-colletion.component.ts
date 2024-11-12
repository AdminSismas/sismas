import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CollectionServicesService } from '../../services/general/collection-services.service';
import { DomainCollection } from '../../interfaces/domain-name.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'vex-combox-colletion',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatTableModule,
    NgClass
  ],
  templateUrl: './combox-colletion.component.html',
  styleUrl: './combox-colletion.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class ComboxColletionComponent implements OnInit {

  options: DomainCollection[] = [];

  @Input() public label: string = '';
  @Input() public formControlNameCombobox: string = '';
  @Input() public typeDomainName: string = '';
  @Input() public placeholderDomainName?: string;
  @Input() public idComboCollection: string = '';
  @Input() public cssClasses?: string;
  @Input() public valueReturn: string | undefined = 'dispname';
  @Input() public hintValue: string | null = null;
  @Input() public hideRequiredMarker: boolean = true;

  @Output() stringEventEmitter = new EventEmitter<string>();

  constructor(
    private collectionServicesService: CollectionServicesService
  ) {
  }

  ngOnInit(): void {
    if (this.idComboCollection?.length > 0) {
      this.idComboCollection = this.idComboCollection + this.getRandomInt(10000) + this.typeDomainName;
    } else {
      this.idComboCollection = this.getRandomInt(10000) + this.typeDomainName;
    }
    this.obtainsCollectionsList();

    this.cssClasses = !this.cssClasses ? 'mainClass': this.cssClasses
  }

  obtainsCollectionsList() {
    if (this.typeDomainName != null && this.typeDomainName.length > 0) {
      this.collectionServicesService.getDataDomainName(this.typeDomainName)
        .subscribe(
          (result: DomainCollection[]) => this.captureInformationSubscribe(result)
        );
    }
  }

  captureInformationSubscribe(result: DomainCollection[]) {
    if (result != null && result.length > 0) {
      result = result.filter(dmc => dmc.inactive === false);
    }
    this.options = result;
    console.log(this.options);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  returnEvent(value: string) {
    this.stringEventEmitter.emit(value);
  }
}
