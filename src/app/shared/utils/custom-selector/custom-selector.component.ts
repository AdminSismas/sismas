/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  forwardRef,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { INFORMATION_NOT_FOUND } from '@shared/constants/constants';

@Component({
  selector: 'vex-combox-custom-selector',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    NgClass
  ],
  templateUrl: './custom-selector.component.html',
  styleUrl: './custom-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectorComponent),
      multi: true
    }
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class CustomSelectorComponent implements OnInit, OnChanges {
  /* ---- Injects ---- */
  http = inject(HttpClient);

  /* ---- Inputs ---- */
  public readonly displayKey = input<string>('label'); // Clave para el texto del mat-option
  public readonly label = input<string>('Seleccione una opción'); // Etiqueta del selector
  public readonly placeholder = input<string>(''); // Placeholder del selector
  public readonly apiUrl = input<string>(''); // URL para obtener las opciones
  public readonly apiUrlDynamic = input<string>(''); // URL para obtener las opciones dinamico
  public readonly valueKey = input<string>('value'); // Clave para el `value` del mat-option
  public readonly cssClasses = input<string>(''); // Clases CSS dinámicas
  public readonly hideRequiredMarker = input<boolean>(false); // Opción para ocultar el marcador de requerido
  public readonly formControlName = input<string>(''); // FormControl para el binding
  public readonly hintValue = input<string>(''); // Valor del hint opcional
  public readonly options = input<any[]>([]);
  public readonly queryParams =
    input<Record<string, string | number | boolean>>({});

  /* ---- Outputs ---- */
  selectionChange = output<any>(); // Evento para emitir cambios de selección

  /* ---- Signals ---- */
  public readonly optionValues = signal<any[]>(this.options() ?? []);
  public readonly apiUrlService = signal<string>(this.apiUrl() ?? '');
  public readonly loading = signal<boolean>(false); // Indicador de carga

  private value: any; // Valor del selector

  disabled = false; // Estado de deshabilitado

  ngOnInit(): void {
    this.chargeSelect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['apiUrlDynamic'] &&
      !this.apiUrlDynamic() &&
      this.apiUrlDynamic().length <= 0
    ) {
      this.optionValues.set([]);
      return;
    }

    if (
      changes['apiUrlDynamic'] &&
      this.apiUrlDynamic() &&
      this.apiUrlDynamic().length > 0
    ) {
      this.apiUrlService.set(this.apiUrlDynamic());
      this.chargeSelect();
      return;
    }
  }

  chargeSelect(): void {
    if (this.apiUrlService()) {
      this.fetchOptions();
    }
  }

  fetchOptions(): void {
    this.loading.set(true);
    let params: HttpParams = new HttpParams();
    if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      Object.entries(this.queryParams).forEach(([key, value]) => {
        params = params.append(key, value.toString());
      });
    }
    this.getData(this.apiUrlService(), params).subscribe({
      next: (data) => {
        this.optionValues.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSelectionChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.selectionChange.emit(value);
  }

  // Métodos de ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private getData(url: string, params: HttpParams): Observable<any[]> {
    return this.http.get<any[]>(url, { params });
  }

  private onChange = (value: any) => {
    console.log(value);
  };
  private onTouched = () => {
    console.log('onTouched');
  };

  protected readonly INFORMATION_NOT_FOUND = INFORMATION_NOT_FOUND;
}
