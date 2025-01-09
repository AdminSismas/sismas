import { CommonModule, NgClass, NgForOf } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vex-custom-selector',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    ReactiveFormsModule,
    MatTableModule,
    NgClass,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './custom-selector.component.html',
  styleUrl: './custom-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectorComponent),
      multi: true
    }
  ]
})
export class CustomSelectorComponent {
  @Input() label: string = 'Seleccione una opción'; // Etiqueta del selector
  @Input() placeholder: string = ''; // Placeholder del selector
  @Input() apiUrl!: string; // URL para obtener las opciones
  @Input() valueKey: string = 'value'; // Clave para el `value` del mat-option
  @Input() displayKey: string = 'label'; // Clave para el texto del mat-option
  @Input() cssClasses: string = ''; // Clases CSS dinámicas
  @Input() hideRequiredMarker: boolean = false; // Opción para ocultar el marcador de requerido
  @Input() formControl!: FormControl; // FormControl para el binding
  @Input() hintValue: string = ''; // Valor del hint opcional
  @Input() options: any[] = [];
  @Input() queryParams: Record<string, string | number | boolean> = {};
  @Output() selectionChange = new EventEmitter<any>(); // Evento para emitir cambios de selección

  loading: boolean = false; // Indicador de carga
  value: any; // Valor del selector
  disabled: boolean = false; // Estado de deshabilitado

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOptions();
  }

  

  fetchOptions(): void {
    this.loading = true;
  
    let params = new HttpParams();
    if (this.queryParams && Object.keys(this.queryParams).length > 0) {
      Object.entries(this.queryParams).forEach(([key, value]) => {
        params = params.append(key, value.toString());
      });
    }
  
    this.http.get<any[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.options = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching options:', err);
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

  private onChange = (value: any) => {};
  private onTouched = () => {};
}
