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
import { filter, Observable, Subscription } from 'rxjs';
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
} from '../../../../../../apps/constants/information-property/cadastral-recognition.constants';
import { JSONInput } from '../../../../../../apps/interfaces/forms/dynamic-forms';
import {
  ParticipantTableDialogComponent
} from '../../../../../../apps/components/bpm/participant-table-dialog/participant-table-dialog.component';
import { ProcessParticipant } from 'src/app/apps/interfaces/bpm/process-participant';
import { MODAL_DINAMIC_HEIGHT, PAGE, PAGE_SIZE } from '../../../../../../apps/constants/general/constants';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecognitionPropertyService } from '../../../../../../apps/services/bpm/recognition-property.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { environment } from '../../../../../../../environments/environments';
import { ProFlow } from '../../../../../../apps/interfaces/bpm/pro-flow';
import { SendInfoGeneralService } from '../../../../../../apps/services/general/send-info-general.service';
import { Router } from '@angular/router';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { DynamicFormsComponent } from '../../../../../../apps/components/forms/dynamic-forms/dynamic-forms.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { LoadingServiceService } from '../../../../../../apps/services/general/loading-service.service';
import { FluidMinHeightDirective } from '../../../../../../apps/directives/fluid-min-height.directive';
import { RecognitionProperty, RecognitionPropertyBasic } from '../../../../../../apps/interfaces/bpm/visita.interface';
import { ThirdPartyAffectedParticipant } from '../../../../../../apps/interfaces/general/content-info';
import {
  ParticipantTableComponent
} from '../../../../../../apps/components/general-components/participant-table/participant-table.component';
import { getRandomInt } from '../../../../../../apps/utils/general';
import { ParticipantsServiceService } from '../../../../../../apps/services/users/participants-service.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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
    FluidMinHeightDirective,
    ParticipantTableComponent
  ],
  templateUrl: './recognition-property-information.component.html',
  styleUrl: './recognition-property-information.component.scss'
})
export class RecognitionPropertyInformation implements OnInit, OnDestroy, AfterViewInit {

  @Input({ required: true }) public executionId: string = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public mode = 0;
  @Input({ required: false }) public fluidHeight: string = '180';

  private thirdPartyAffected$: Subscription | undefined;
  private recognitionProperty: RecognitionPropertyService = inject(RecognitionPropertyService);
  private participantsService: ParticipantsServiceService = inject(ParticipantsServiceService);
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
  columns: TableColumn<ProcessParticipant>[] = TABLE_COLUMN_THIRD_PARTY;

  form = signal<FormGroup>(new FormGroup({}));
  totalElements = signal(0);
  initRecognitionProperty = signal<RecognitionProperty | RecognitionPropertyBasic | null>(null);
  existThirdPartyAffected = signal(false);

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
        if (!this.existThirdPartyAffected()) {
          this.onThirdPartyAffectedTrue();
          return;
        }
        this.confirmAction(
          () => this.onThirdPartyAffectedTrue(),
          'Actualmente hay terceros afectados en el tramite,¿Deseas agregar alguno nuevo?',
          'info'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.thirdPartyAffected$) {
      this.thirdPartyAffected$.unsubscribe();
    }
  }

  onThirdPartyAffectedTrue() {
    let obj: ThirdPartyAffectedParticipant = { executionId: this.executionId, thirdPartyAffected: true };
    this.dialog.open(ParticipantTableDialogComponent, {
      ...MODAL_DINAMIC_HEIGHT,
      disableClose: true,
      data: obj
    }).afterClosed()
      .subscribe((result: ProcessParticipant[]) => {
        if (result?.length > 0 && this.thirdPartyAffected?.value) {
          this.participantsService.getExistThirdPartyAffected(this.executionId)
            .subscribe((response: boolean) => this.existThirdPartyAffected.set(response));
        }
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
    this.recognitionProperty.getRecognitionProperty(this.executionId)
      .subscribe((response: RecognitionProperty) => this.getExistThirdPartyAffected(response));
  }

  getExistThirdPartyAffected(response: RecognitionProperty | null) {
    this.participantsService.getExistThirdPartyAffected(this.executionId)
      .subscribe((responseThirdPartyAffected: boolean) => {
        if (response != null) {
          response.thirdPartyAffected = responseThirdPartyAffected;
        } else {
          this.thirdPartyAffected?.setValue(responseThirdPartyAffected);
        }
        this.existThirdPartyAffected.set(responseThirdPartyAffected);
        this.initRecognitionProperty.set(response);
      });
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

  confirmAction(action: () => void, message: string,
                icon: SweetAlertIcon | undefined): void {
    Swal.fire({
      text: message,
      icon: icon,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cerrar`
    }).then((result) => {
      if (result.isConfirmed) {
        action();
      }
    });
  }

}
