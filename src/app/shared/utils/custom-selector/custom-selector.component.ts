/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  forwardRef,
  OnInit,
  OnChanges,
  Input,
  Output,
  SimpleChanges,
  inject,
  EventEmitter
} from '@angular/core';
import {
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  ControlContainer,
  FormGroupDirective
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { INFORMATION_NOT_FOUND } from '@shared/constants/constants';
import { Observable } from 'rxjs';

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
  private http = inject(HttpClient);

  @Input({ required: true }) idSelector = '';
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
    if (this.idSelector?.length > 0) {
      this.idSelector =
        this.idSelector +
        this.getRandomInt(100000) +
        'customSelector' +
        this.getRandomInt(10);
    } else {
      this.idSelector =
        this.getRandomInt(10000) + 'customSelector' + this.getRandomInt(10);
    }
    this.chargeSelect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['apiUrlDynamic'] &&
      !this.apiUrlDynamic &&
      this.apiUrlDynamic.length <= 0
    ) {
      this.options = [];
      return;
    }

    if (
      changes['apiUrlDynamic'] &&
      this.apiUrlDynamic &&
      this.apiUrlDynamic.length > 0
    ) {
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
    this.selectionChange.emit(value);
  }

  // Métodos de ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private getData(url: string, params: HttpParams): Observable<any[]> {
    return this.http.get<any[]>(url, { params: params });
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly INFORMATION_NOT_FOUND = INFORMATION_NOT_FOUND;
}
