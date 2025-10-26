/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { INFORMATION_NOT_FOUND } from '@shared/constants';

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
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustomSelectorComponent implements OnInit, OnChanges {
  readonly label = input('Seleccione una opción'); // Etiqueta del selector
  readonly placeholder = input(''); // Placeholder del selector
  @Input() apiUrl!: string; // URL para obtener las opciones
  readonly apiUrlDynamic = input.required<string>(); // URL para obtener las opciones dinamico
  @Input() valueKey = 'value'; // Clave para el `value` del mat-option
  readonly displayKey = input.required<string>(); // Clave para el texto del mat-option
  readonly cssClasses = input(''); // Clases CSS dinámicas
  readonly hideRequiredMarker = input(false); // Opción para ocultar el marcador de requerido
  readonly formControlName = input(''); // FormControl para el binding
  @Input() hintValue = ''; // Valor del hint opcional
  @Input() options: any[] = [];
  readonly queryParams = input<Record<string, string | number | boolean>>({});
  @Output() selectionChange = new EventEmitter<any>(); // Evento para emitir cambios de selección

  loading = false; // Indicador de carga
  value: any; // Valor del selector
  disabled = false; // Estado de deshabilitado

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.chargeSelect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const apiUrlDynamic = this.apiUrlDynamic();
    if (changes['apiUrlDynamic'] && !apiUrlDynamic && apiUrlDynamic.length <= 0) {
      this.options = [];
      return;
    }

    if (changes['apiUrlDynamic'] && apiUrlDynamic && apiUrlDynamic.length > 0) {
      this.apiUrl = apiUrlDynamic;
      this.chargeSelect();
      return;
    }
  }

  chargeSelect(): void {
    if (this.apiUrl) {
      this.fetchOptions();
    }
  }

  fetchOptions(): void {
    this.loading = true;
    let params: HttpParams = new HttpParams();
    const queryParams = this.queryParams();
    if (queryParams && Object.keys(queryParams).length > 0) {
      Object.entries(queryParams).forEach(([key, value]) => {
        params = params.append(key, value.toString());
      });
    }
    this.getData(this.apiUrl, params).subscribe({
      next: (data) => {
        this.options = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
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
    console.log('onChange', value);
  };
  private onTouched = () => {
    console.log('onTouched');
  };

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly INFORMATION_NOT_FOUND = INFORMATION_NOT_FOUND;
}
