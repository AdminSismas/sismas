// Angular framework
import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { filter, pairwise, startWith, Subscription } from 'rxjs';
// Vex
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
// Material
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// Custom
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';
import {
  INPUT_FORM_VISIT,
  TABLE_COLUMN_THIRD_PARTY
} from '../../../../../../apps/constants/information-property/cadastral-visit.constants';
import { JSONInput } from '../../../../../../apps/interfaces/forms/dynamic-forms';
import {
  BasicParticipantTableDialogComponent
} from 'src/app/apps/components/bpm/basic-participant-table-dialog/basic-participant-table-dialog.component';
import { ProcessParticipant } from 'src/app/apps/interfaces/bpm/process-participant';
import { MODAL_LARGE, PAGE, PAGE_SIZE, PAGE_SIZE_OPTION } from '../../../../../../apps/constants/general/constants';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VisitaService } from 'src/app/apps/services/bpm/visita.service';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'vex-visita',
  standalone: true,
  animations: [stagger40ms, scaleIn400ms, fadeInUp400ms],
  imports: [
    // Vex
    // Material
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    // Custom
    DynamicFormsComponent,
    SweetAlert2Module
  ],
  templateUrl: './visita.component.html',
  styleUrl: './visita.component.scss'
})
export class VisitaComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public id = '';
  @Input() public executionId = '';
  @Input({ required: true }) public resources: string[] = [];

  form: FormGroup = new FormGroup({});
  inputFormVisit: JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration
  dataSource: MatTableDataSource<ProcessParticipant> = new MatTableDataSource<ProcessParticipant>([]);
  columns: TableColumn<ProcessParticipant>[] = TABLE_COLUMN_THIRD_PARTY;
  totalElements = signal(0);

  private thirdPartyAffected$: Subscription | undefined;

  private visitaService = inject(VisitaService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('invalidForm') invalidForm!: SwalComponent;
  @ViewChild('successSave') successSave!: SwalComponent;

  get page() {
    return PAGE;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get pageSizeOptions() {
    return PAGE_SIZE_OPTION;
  }

  get visibleColumns() {
    return this.columns
    .filter((column) => column.visible)
    .map((column) => column.property);
  }

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id =
        this.id +
        this.getRandomInt(100000) +
        'AlfaMainComponent' +
        this.getRandomInt(10);
    } else {
      this.id =
        this.getRandomInt(10000) + 'AlfaMainComponent' + this.getRandomInt(10);
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy(): void {
    if (this.thirdPartyAffected$) {
      this.thirdPartyAffected$.unsubscribe();
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  onFormReady(form: FormGroup) {

    if (this.thirdPartyAffected$) {
      this.thirdPartyAffected$.unsubscribe();
    }

    this.form = form;
    this.form.setValidators(this.atLeastOneFieldFilledValidator.bind(this));
    this.form.updateValueAndValidity();
    this.thirdPartyAffected$ = this.form
      .get('thirdPartyAffected')
      ?.valueChanges.pipe(
        startWith(false),
        pairwise(),
        filter(([prev, current]) =>  prev === false && current === true),
      )
      .subscribe(() => {
        this.onThirdPartyAffectedTrue();
      });
  }

  onThirdPartyAffectedTrue() {
    this.dialog.open(BasicParticipantTableDialogComponent, {
      ...MODAL_LARGE,
    })
    .afterClosed()
    .subscribe((result: ProcessParticipant[]) => {
      this.dataSource.data = result;
    });
  }

  atLeastOneFieldFilledValidator(control: AbstractControl): ValidationErrors | null {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const controls = control.controls;

    // Check if any control has a value
    const hasFilledField = Object.keys(controls).some(key => {
      const control = controls[key];
      if (control.disabled) {
        return false;
      }

      const value = control.value;

      // Check for empty strings, null, undefined
      if (value === null || value === undefined || value === '') {
        return false;
      }

      return true;
    });

    return hasFilledField ? null : { atLeastOneFieldRequired: true };
  }

  saveForm() {
    if (this.form.invalid) {
      this.invalidForm.fire();
      return;
    }

    this.visitaService.createReconocimientoPredial(this.executionId, this.form.value)
      .subscribe({
        next: () => {
          this.successSave.fire();
        }
      });
  }
}
