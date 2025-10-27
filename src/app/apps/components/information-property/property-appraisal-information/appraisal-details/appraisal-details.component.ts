import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { InfoAppraisal } from 'src/app/apps/interfaces/information-property/info-appraisal';
import { AppraisalLabelPipe } from '@shared/components';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vex-appraisal-details',
  standalone: true,
  imports: [
    ModalWindowComponent,
    CurrencyPipe,
    AppraisalLabelPipe,
    DatePipe,
    KeyValuePipe
  ],
  templateUrl: './appraisal-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppraisalDetailsComponent implements OnInit {
  // Properties
  protected readonly title = 'Detalle avalúo';
  protected readonly cadastralKeys = [
    'cadastralValuation',
    'cadastralValuationLand',
    'cadastralValuationUnits',
    'cadValLandCommon',
    'cadValLandPrivate',
    'cadValUnitbuiltCommon',
    'cadValUnitbuiltPrivate'
  ];
  protected readonly commercialKeys = [
    'commercialValuation',
    'commercialValuationLand',
    'commercialValuationUnits'
  ];
  protected readonly autoKeys = [
    'selfValuationValue',
    'selfValuationValueLand',
    'selfValuationValueUnits'
  ];
  protected readonly atributesKeys = [
    'cadastralValuationAt',
    'validityValuation'
  ];
  protected readonly groups: (
    | 'características'
    | 'catastral'
    | 'comercial'
    | 'autoavalúo'
  )[] = ['características', 'catastral', 'comercial', 'autoavalúo'];

  // Injects
  private data: InfoAppraisal = inject(MAT_DIALOG_DATA);

  // Signals
  private attributesAppraisalDetails = signal<Partial<InfoAppraisal>>({});
  private cadastralAppraisalDetails = signal<Partial<InfoAppraisal>>({});
  private commercialAppraisalDetails = signal<Partial<InfoAppraisal>>({});
  private autoAppraisalDetails = signal<Partial<InfoAppraisal>>({});

  ngOnInit(): void {
    this.attributesAppraisalDetails.set(
      this.generateObject(this.data, this.atributesKeys)
    );
    this.cadastralAppraisalDetails.set(
      this.generateObject(this.data, this.cadastralKeys)
    );
    this.commercialAppraisalDetails.set(
      this.generateObject(this.data, this.commercialKeys)
    );
    this.autoAppraisalDetails.set(
      this.generateObject(this.data, this.autoKeys)
    );
  }

  getInfoValue(value: unknown): string {
    if (value === null || value === undefined) return '';

    switch (typeof value) {
      case 'boolean':
        return value ? 'Sí' : 'No';
      case 'number':
        return value.toString();
      case 'string':
        return value;
      default:
        return '';
    }
  }

  getGroupObject(
    groupName: 'características' | 'catastral' | 'comercial' | 'autoavalúo'
  ): Partial<InfoAppraisal> {
    switch (groupName) {
      case 'características':
        return this.attributesAppraisalDetails();
      case 'catastral':
        return this.cadastralAppraisalDetails();
      case 'comercial':
        return this.commercialAppraisalDetails();
      case 'autoavalúo':
        return this.autoAppraisalDetails();
    }
  }

  private generateObject(
    row: InfoAppraisal,
    atributesKeys: string[]
  ): Partial<InfoAppraisal> {
    const data = Object.fromEntries(
      Object.entries(row).filter(([key]) => atributesKeys.includes(key))
    );
    return data;
  }
}
