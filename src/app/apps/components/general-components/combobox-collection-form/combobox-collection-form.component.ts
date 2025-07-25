import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  forwardRef,
  OnDestroy} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgClass } from '@angular/common';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { CollectionServices } from '../../../services/general/collection.service';
import { DomainCalificationCollection, DomainCollection } from '../../../interfaces/general/domain-name.model';
import { MatTableModule } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import {
  CONSTANT_ERR_CAPITAL_LETTER,
  CONSTANT_ERR_INVALID_AREA,
  CONSTANT_ERR_INVALID_NUMBER,
  CONSTANT_ERR_INVALID_YEAR,
  CONSTANT_ERR_MIN03_CHARACTERS,
  CONSTANT_ERR_MIN10_CHARACTERS,
  CONSTANT_ERR_ONLY_INVALID_LETTER,
  CONSTANT_ERR_ONLY_INVALID_NUMBER,
  CONSTANT_ERR_ONLY_ONE_99,
  CONSTANT_ERR_ONLY_TEXT_NUMBER
} from '../../../constants/general/constantsAlertLabel';
import { BehaviorSubject, Subject } from 'rxjs';
import { STRING_INFORMATION_NOT_FOUND } from '../../../constants/general/constants';

// @ts-ignore
@Component({
  selector: 'vex-combobox-collection-form',
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
  templateUrl: './combobox-collection-form.component.html',
  styleUrl: './combobox-collection-form.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxCollectionFormComponent),
      multi: true
    }
  ],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ComboboxCollectionFormComponent implements OnInit, OnDestroy {

  options: DomainCollection[] = [];
  calificationOptions: DomainCalificationCollection[] = [];
  loading = false; // Indicador de carga

  private destroy$ = new Subject<void>();
  control: FormControl | null | undefined = null;

  @Input() public label = '';
  @Input({ required: true }) public formControlComboxColletion!: FormControl;
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
  @Output() selectionChange = new EventEmitter<any>();

  _filteredOptions$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredOptions$ = this._filteredOptions$.asObservable();

  constructor(
    private collectionServicesService: CollectionServices
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    let textID: string = 'ValidateExtID3543d3' + this.getRandomInt(10);
    if (this.validateFiel(this.typeDomainName)) {
      textID = this.typeDomainName;
    }
    if (this.idComboCollection?.length > 0) {
      this.idComboCollection = this.idComboCollection + this.getRandomInt(52547) + textID;
    } else {
      this.idComboCollection = this.getRandomInt(2115) + textID;
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
    if (result != null && result.length > 0 && this.validateInactiveCollection) {
      result = result.filter(dmc => dmc.inactive === false);
    }
    this.options = result;
    this._filteredOptions$.next(this.options);
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

  checkIsInValid(formControl: AbstractControl | null): boolean {
    return !(
      formControl && formControl.hasOwnProperty('status') && formControl.status === 'VALID' &&
      formControl.errors === null
    );
  }

  checkForErrorsIn(formControl: AbstractControl): string {
    if (formControl.hasError('required')) {
      return 'Campo requerido';
    }

    if (formControl.errors?.hasOwnProperty('capitalLetter') && formControl.errors?.['capitalLetter']) {
      return CONSTANT_ERR_CAPITAL_LETTER;
    }

    if (formControl.errors?.hasOwnProperty('onlyNumber') && formControl.errors?.['onlyNumber']) {
      return CONSTANT_ERR_INVALID_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('errorArea') && formControl.errors?.['errorArea']) {
      return CONSTANT_ERR_INVALID_AREA;
    }

    if (formControl.errors?.hasOwnProperty('yearBetween1900And2099') && formControl.errors?.['yearBetween1900And2099']) {
      return CONSTANT_ERR_INVALID_YEAR;
    }

    if (formControl.errors?.hasOwnProperty('max99') && formControl.errors?.['max99']) {
      return CONSTANT_ERR_ONLY_ONE_99;
    }

    if (formControl.errors?.hasOwnProperty('onlyTextOrNumber') && formControl.errors?.['onlyTextOrNumber']) {
      return CONSTANT_ERR_ONLY_TEXT_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('min03Characters') && formControl.errors?.['min03Characters']) {
      return CONSTANT_ERR_MIN03_CHARACTERS;
    }

    if (formControl.errors?.hasOwnProperty('min10Characters') && formControl.errors?.['min10Characters']) {
      return CONSTANT_ERR_MIN10_CHARACTERS;
    }

    if (formControl.errors?.hasOwnProperty('onlyTextAndNumberGuionCommand') && formControl.errors?.['onlyTextAndNumberGuionCommand']) {
      return CONSTANT_ERR_ONLY_INVALID_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('onlyNumber') && formControl.errors?.['onlyNumber']) {
      return CONSTANT_ERR_ONLY_INVALID_NUMBER;
    }

    if (formControl.errors?.hasOwnProperty('onlyLetters') && formControl.errors?.['onlyLetters']) {
      return CONSTANT_ERR_ONLY_INVALID_LETTER;
    }

    if (formControl.errors?.hasOwnProperty('max') && formControl.errors?.['max']) {
      return 'Error, valor maximo: ' + formControl.errors?.['max'].max + ' valor actual: ' + formControl.errors?.['max'].actual;
    }

    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly STRING_INFORMATION_NOT_FOUND = STRING_INFORMATION_NOT_FOUND;
}
