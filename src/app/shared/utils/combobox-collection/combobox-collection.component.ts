import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  input,
  output
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
import { CollectionServices } from '@shared/services/general/collection.service';
import { DomainCollection } from '@shared/interfaces/forms';
import { MatTableModule } from '@angular/material/table';
import { HttpParams } from '@angular/common/http';
import { STRING_INFORMATION_NOT_FOUND } from '@shared/constants/constants';
import { map } from 'rxjs';

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

  public readonly label = input('');
  public readonly formControlNameCombobox = input('');
  public readonly typeDomainName = input('');
  public readonly typeCalificationDomainName = input('');
  public readonly placeholderDomainName = input<string>();
  public readonly cssClasses = input<string>('mainClass');
  public readonly valueReturn = input<string | undefined>('dispname');
  public readonly hintValue = input<string | null>(null);
  public readonly hideRequiredMarker = input(true);
  public readonly validateInactiveCollection = input(false);
  public readonly queryParams = input<
    Record<string, string | number | boolean>
  >({});
  public readonly optionsExternal = input<DomainCollection[]>([]);
  public readonly valueCode = input(false, {
    transform: (value: string | boolean /*T:VAE*/) => {
      if (typeof value === 'boolean') return value;
      if (value === '') return true;
      if (value === 'true') return true;
      if (value === 'false') return false;
      return false;
    }
  });
  readonly filterOptions = input<string[]>([]);

  selectionChange = output();

  loading = false; // Indicador de carga

  constructor(private collectionServicesService: CollectionServices) {}

  ngOnInit(): void {
    this.loading = true;
    const typeDomainName = this.typeDomainName();

    const queryParams = this.queryParams();
    if (this.validateFiel(typeDomainName)) {
      this.obtainsCollectionsList();
    } else if (queryParams && Object.keys(queryParams).length > 0) {
      this.obtainsCollectionsListParams();
    }
  }

  obtainsCollectionsList() {
    if (this.typeDomainName != null && this.typeDomainName().length > 0) {
      this.collectionServicesService
        .getDataDomainName(this.typeDomainName())
        .pipe(
          map((result: DomainCollection[]) => {
            if (this.filterOptions().length > 0) {
              let newResult = result;
              this.filterOptions().forEach(
                (filter) => (newResult = this.filterResult(newResult, filter))
              );

              return newResult;
            }

            return result;
          })
        )
        .subscribe((result) => this.captureInformationSubscribe(result));
    }
  }

  filterResult(result: DomainCollection[], filter: string): DomainCollection[] {
    return result.filter((item) => {
      const filterLower = filter.trim().toLowerCase();
      const dispnameLower = item.dispname?.trim().toLowerCase() ?? '';

      return !dispnameLower.includes(filterLower);
    });
  }

  obtainsCollectionsListParams() {
    let params: HttpParams = new HttpParams();
    const queryParams = this.queryParams();
    if (queryParams && Object.keys(queryParams).length > 0) {
      Object.entries(queryParams).forEach(([key, value]) => {
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
      this.validateInactiveCollection()
    ) {
      result = result.filter((dmc) => dmc.inactive === false);
    }
    this.options = result;
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    const queryParams = this.queryParams();
    if (
      changes['optionsExternal'] &&
      this.optionsExternal().length > 0 &&
      !this.validateFiel(this.typeDomainName()) &&
      (!queryParams || Object.keys(queryParams).length <= 0)
    ) {
      this.captureInformationSubscribe(this.optionsExternal());
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChange(value: any) {
    this.selectionChange.emit(value);
  }

  validateFiel(value: string | number | false | true) {
    return value && value !== undefined && value !== null && value !== '';
  }

  protected readonly STRING_INFORMATION_NOT_FOUND =
    STRING_INFORMATION_NOT_FOUND;
}
