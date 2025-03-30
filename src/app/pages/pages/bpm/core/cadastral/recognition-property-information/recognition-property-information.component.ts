import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, Observable, pairwise, startWith, Subscription } from 'rxjs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  INPUT_FORM_VISIT,
  TABLE_COLUMN_THIRD_PARTY
} from '../../../../../../apps/constants/information-property/cadastral-visit.constants';
import { JSONInput } from '../../../../../../apps/interfaces/forms/dynamic-forms';
import {
  BasicParticipantTableDialogComponent
} from 'src/app/apps/components/bpm/basic-participant-table-dialog/basic-participant-table-dialog.component';
import { ProcessParticipant } from 'src/app/apps/interfaces/bpm/process-participant';
import {
  MODAL_LARGE,
  MODAL_SMALL,
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from '../../../../../../apps/constants/general/constants';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecognitionPropertyService } from '../../../../../../apps/services/bpm/recognition-property.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { getRandomInt } from '../../../../../../apps/utils/general';
import { environment } from '../../../../../../../environments/environments';
import { ProFlow } from '../../../../../../apps/interfaces/bpm/pro-flow';
import { SendInfoGeneralService } from '../../../../../../apps/services/general/send-info-general.service';
import { Router } from '@angular/router';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { DynamicFormsComponent } from '../../../../../../apps/components/forms/dynamic-forms/dynamic-forms.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { LoadingServiceService } from '../../../../../../apps/services/general/loading-service.service';
import { FluidMinHeightDirective } from '../../../../../../apps/directives/fluid-min-height.directive';
import {
  RecognitionProperty,
  RecognitionPropertyBasic,
  TagsRecognition
} from '../../../../../../apps/interfaces/bpm/visita.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vex-recognition-property-information',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    SweetAlert2Module,
    VexPageLayoutComponent,
    DynamicFormsComponent,
    VexPageLayoutContentDirective,
    MatSort,
    FluidMinHeightDirective
  ],
  templateUrl: './recognition-property-information.component.html',
  styleUrl: './recognition-property-information.component.scss'
})
export class RecognitionPropertyInformation implements OnInit, OnDestroy, AfterViewInit {

  @Input({ required: true }) public executionId = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public mode = 0;
  @Input({ required: false }) public fluidHeight: string = '220';

  private thirdPartyAffected$: Subscription | undefined;
  private recognitionProperty: RecognitionPropertyService = inject(RecognitionPropertyService);
  private dialog: MatDialog = inject(MatDialog);
  private infoGeneralService: SendInfoGeneralService = inject(SendInfoGeneralService);
  private loadingServiceService: LoadingServiceService = inject(LoadingServiceService);
  private router: Router = inject(Router);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  flowId!: number;
  id: string = getRandomInt(13579).toString();
  schema = `${environment.schemas.temp}`;
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  infoFatherURL!: string;
  inputFormVisit: JSONInput[] = INPUT_FORM_VISIT;
  dataSource: MatTableDataSource<ProcessParticipant> = new MatTableDataSource<ProcessParticipant>([]);
  columns: TableColumn<ProcessParticipant>[] = TABLE_COLUMN_THIRD_PARTY;

  form = signal<FormGroup>(new FormGroup({}));
  totalElements = signal(0);
  initRecognitionProperty = signal<RecognitionProperty | RecognitionPropertyBasic | null>(null);


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('invalidForm') invalidForm!: SwalComponent;
  @ViewChild('successSave') successSave!: SwalComponent;

  constructor(proFlow: ProFlow) {
    if (proFlow?.flowId) {
      this.flowId += proFlow?.flowId;
    }
    if (proFlow?.mode) {
      this.mode = proFlow?.mode;
    }
    this.destroyRef.onDestroy(() => {
    });
  }


  ngOnInit() {
    if (this.id?.length > 0) {
      this.id =
        this.id + getRandomInt(1345789) + 'RecognitionPropertyInformation' + getRandomInt(10);
    } else {
      this.id = getRandomInt(987541) + 'RecognitionPropertyInformation' + getRandomInt(10);
    }

    this.loadingServiceService.activateLoading(true);
    this.getRecognitionProperty();

    this._infoFatherURL$
      .pipe(filter<string>(Boolean))
      .subscribe((result: string) => {
        this.infoFatherURL = result;
      });

    if (!this.executionId) {
      this.returnPanelTask(true);
      return false;
    }

    this.loadingServiceService.deActivate(1000);
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    setTimeout(() => {
      if (!this.infoFatherURL) {
        this.returnURLPrevious(`${environment.myWork_cadastralSearch}`);
        return;
      }

      if (!this.executionId) {
        this.returnPanelTask(true);
        return false;
      }

    }, 300);

    this.thirdPartyAffected.valueChanges.subscribe((value) => {
      if (value) {
        this.onThirdPartyAffectedTrue();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.thirdPartyAffected$) {
      this.thirdPartyAffected$.unsubscribe();
    }
  }

  onFormReady(form: FormGroup) {
    if (this.thirdPartyAffected$) {
      this.thirdPartyAffected$.unsubscribe();
    }
    this.thirdPartyAffected$ = this.form().get('thirdPartyAffected')
      ?.valueChanges.pipe(
        startWith(false),
        pairwise(),
        filter(([prev, current]) => prev === false && current === true)
      )
      .subscribe(() => {
        this.onThirdPartyAffectedTrue();
      });
  }

  onThirdPartyAffectedTrue() {
    this.dialog.open(BasicParticipantTableDialogComponent, {
      ...MODAL_SMALL
    })
      .afterClosed()
      .subscribe((result: ProcessParticipant[]) => {
        this.dataSource.data = result;
      });
  }

  saveForm() {
    if (this.form().invalid) {
      this.invalidForm.fire();
      return;
    }
    this.recognitionProperty.createRecognitionProperty(this.executionId, this.form().value)
      .subscribe({
        next: (response: RecognitionPropertyBasic) => {
          if (response) {
            this.successSave.fire().then(() => {
              this.initRecognitionProperty.set(response);
            });
          }
        }
      });
  }

  getRecognitionProperty() {
    this.recognitionProperty.getRecognitionProperty(this.executionId).subscribe({
      next: (response: RecognitionProperty) => {
        if (response) {
          this.initRecognitionProperty.set(response);
        }
      }
    });
  }

  get page() {
    return PAGE;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }

  get thirdPartyAffected() {
    return this.form().get('thirdPartyAffected') as FormControl;
  }
}
