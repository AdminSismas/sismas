import { NgClass } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroupDirective, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SendGeneralRequestsService } from '../../../services/general/send-general-requests.service';
import { catchError, Observable } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'vex-combox-custom-selector',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    NgClass,
    MatTooltip
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

  @Input({ required: true }) idSelector: string = '';
  @Input() label: string = 'Seleccione una opción'; // Etiqueta del selector
  @Input() placeholder: string = ''; // Placeholder del selector
  @Input() apiUrl!: string; // URL para obtener las opciones
  @Input() valueKey: string = 'value'; // Clave para el `value` del mat-option
  @Input({ required: true }) displayKey: string = 'label'; // Clave para el texto del mat-option
  @Input() cssClasses: string = ''; // Clases CSS dinámicas
  @Input() hideRequiredMarker: boolean = false; // Opción para ocultar el marcador de requerido
  @Input() formControlName: string = ''; // FormControl para el binding
  @Input() hintValue: string = ''; // Valor del hint opcional
  @Input() options: any[] = [];
  @Input() queryParams: Record<string, string | number | boolean> = {};
  @Output() selectionChange = new EventEmitter<any>(); // Evento para emitir cambios de selección

  loading: boolean = false; // Indicador de carga
  value: any; // Valor del selector
  disabled: boolean = false; // Estado de deshabilitado

  constructor(private requestsService: SendGeneralRequestsService) {}

  ngOnInit(): void {
    if (this.idSelector?.length > 0) {
      this.idSelector = this.idSelector + this.getRandomInt(100000)
        + 'customSelector' + this.getRandomInt(10);
    } else {
      this.idSelector = this.getRandomInt(10000)
        + 'customSelector' + this.getRandomInt(10);
    }
    if(this.apiUrl) {
      this.fetchOptions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
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
      error: (err) => {
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

  private getData(url: string, params: unknown): Observable<any[]> {
    return this.requestsService.sendRequestsGetOption(url, { params: params })
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  private onChange = (value: any) => {};
  private onTouched = () => {};

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
}
