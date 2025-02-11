// Angular framework
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
import { INPUT_FORM_VISIT, TABLE_COLUMN_THIRD_PARTY } from '../../../../../../apps/constants/information-property/cadastral-visit.constants';
import { JSONInput } from '../../../../../../apps/interfaces/forms/dynamic-forms';
import {
  BasicParticipantTableDialogComponent
} from 'src/app/apps/components/bpm/basic-participant-table-dialog/basic-participant-table-dialog.component';
import { ProcessParticipant } from 'src/app/apps/interfaces/bpm/process-participant';
import { MODAL_LARGE, PAGE, PAGE_SIZE, PAGE_SIZE_OPTION } from '../../../../../../apps/constants/general/constant';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-visita',
  standalone: true,
  animations: [stagger40ms, scaleIn400ms, fadeInUp400ms],
  imports: [
    // Vex
    // Material
    MatTableModule,
    MatIconModule,
    // Custom
    DynamicFormsComponent
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
  visibleColumns: string[] = [];
  page = PAGE;
  pageSize = PAGE_SIZE;
  totalElements = 0;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;

  private thirdPartyAffected$: Subscription | undefined;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    private dialog: MatDialog,
  ) {}

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

    this.visibleColumns = this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
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

  submit() {
    console.log(this.form.value);
  }
}
