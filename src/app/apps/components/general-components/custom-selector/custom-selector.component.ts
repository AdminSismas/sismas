/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
  /* ---- Injects ---- */
  http = inject(HttpClient);

  /* ---- Inputs ---- */
  @Input() label = 'Seleccione una opción'; // Etiqueta del selector
  @Input() placeholder = ''; // Placeholder del selector
  @Input() apiUrl!: string; // URL para obtener las opciones
  @Input() apiUrlDynamic!: string; // URL para obtener las opciones dinamico
  @Input() valueKey = 'value'; // Clave para el `value` del mat-option
  @Input({ required: true }) displayKey = 'label'; // Clave para el texto del mat-option
  @Input() cssClasses = ''; // Clases CSS dinámicas
  @Input() hideRequiredMarker = false; // Opción para ocultar el marcador de requerido
  @Input() formControlName = ''; // FormControl para el binding
  @Input() hintValue = ''; // Valor del hint opcional
  @Input() options: any[] = [];
  @Input() queryParams: Record<string, string | number | boolean> = {};
  @Output() selectionChange = new EventEmitter<any>(); // Evento para emitir cambios de selección

  loading = false; // Indicador de carga
  value: any; // Valor del selector
  disabled = false; // Estado de deshabilitado

  ngOnInit(): void {
    this.chargeSelect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiUrlDynamic'] && !this.apiUrlDynamic && this.apiUrlDynamic.length <= 0) {
      this.options = [];
      return;
    }

    if (changes['apiUrlDynamic'] && this.apiUrlDynamic && this.apiUrlDynamic.length > 0) {
      this.apiUrl = this.apiUrlDynamic;
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
    if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      Object.entries(this.queryParams).forEach(([key, value]) => {
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
    console.log(value);
  };
  private onTouched = () => {
    console.log('onTouched');
  };

  protected readonly INFORMATION_NOT_FOUND = INFORMATION_NOT_FOUND;
}
