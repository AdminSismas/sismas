import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, DatePipe, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import {
  CONSTANT_FILING_PROCEDURES,
  CONSTANT_NAME_BAUNITID,
  CONSTANT_NAME_ID,
  CONSTANT_NAME_INITIATE_FILING_PROCEDURE,
  CONSTANT_NAME_NEXT,
  CONSTANT_NAME_NO_,
  CONSTANT_NAME_REGISTER,
  CONSTANT_NAME_RELOAD,
  CONSTANT_NAME_RETURN,
  CONSTANT_NAME_ROOTING,
  CONSTANT_NAME_SI_
} from '../../../../apps/constants/constantLabels';
import { InputComponent } from '../../../../apps/components/input/input.component';
import {
  DOMAIN_COLLETION_BPMPROCESSCATEGORY,
  GUION,
  NAME_NO_DISPONIBLE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_CADASTRAL,
  PANEL_ASSIGNED_TASKS,
  SPACE,
  TABLE_COLUMN_PROPERTIES
} from '../../../../apps/constants/constant';
import { filter, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomainCollection } from '../../../../apps/interfaces/domain-name.model';
import { CollectionServicesService } from '../../../../apps/services/general/collection-services.service';
import { BpmTypeProcess } from '../../../../apps/interfaces/bpm/bpm-type-process';
import { BpmProcessService } from '../../../../apps/services/bpm/bpm-process.service';
import { ProcessCardComponent } from './components/process-card/process-card.component';
import { TaskCardComponent } from '../../my-work/tasks/components/task-card/task-card.component';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ComboxColletionComponent } from '../../../../apps/components/combox-colletion/combox-colletion.component';
import {
  SendInformationRegisterService
} from '../../../../apps/services/register-procedure/send-information-register.service';
import { BaunitHead } from '../../../../apps/interfaces/information-property/baunit-head.model';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BasicParticipantTableComponent } from './components/basic-participant-table/basic-participant-table.component';
import { ProcessParticipant } from '../../../../apps/interfaces/bpm/process-participant';
import { BpmDocument } from '../../../../apps/interfaces/bpm/bpm-document';
import { ProExecutionE } from '../../../../apps/interfaces/bpm/pro-execution-e';
import { MetadataBpm } from '../../../../apps/interfaces/bpm/metadata-bpm';
import { BpmCoreService } from '../../../../apps/services/bpm/bpm-core.service';
import { ProTaskE } from '../../../../apps/interfaces/pro-task-e';
import { environment } from '../../../../../environments/environments';
import { SendInfoGeneralService } from '../../../../apps/services/general/send-info-general.service';
import { FluidMinHeightDirective } from '../../../../apps/directives/fluid-min-height.directive';

@Component({
  selector: 'vex-initiate-filing-procedure',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms],
  imports: [
    VexSecondaryToolbarComponent,
    VexBreadcrumbsComponent,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    NgIf,
    MatCheckboxModule,
    MatSnackBarModule,
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    FluidMinHeightDirective,
    InputComponent,
    DatePipe,
    AsyncPipe,
    MatAutocompleteModule,
    ProcessCardComponent,
    TaskCardComponent,
    NgOptimizedImage,
    ComboxColletionComponent,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    BasicParticipantTableComponent,
    FormsModule,
    FluidMinHeightDirective
  ],
  templateUrl: './initiate-filing-procedure.component.html',
  styleUrl: './initiate-filing-procedure.component.scss'
})
export class InitiateFilingProcedureComponent implements OnInit {

  protected readonly CONSTANT_NAME_REGISTER = CONSTANT_NAME_REGISTER;
  protected readonly CONSTANT_NAME_RELOAD = CONSTANT_NAME_RELOAD;
  protected readonly CONSTANT_NAME_NEXT = CONSTANT_NAME_NEXT;
  protected readonly CONSTANT_NAME_RETURN = CONSTANT_NAME_RETURN;
  protected readonly CONSTANT_NAME_INITIATE_FILING_PROCEDURE = CONSTANT_NAME_INITIATE_FILING_PROCEDURE;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly GUION = GUION;
  protected readonly pageSize = PAGE_SIZE_TABLE_CADASTRAL;
  protected readonly columns = TABLE_COLUMN_PROPERTIES;
  protected readonly page = PAGE;
  protected readonly pageSizeOptions = PAGE_SIZE_OPTION;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private _cadastralNumberId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _listBpmProcessCategory: BehaviorSubject<DomainCollection[]> = new BehaviorSubject<DomainCollection[]>([]);
  private _listBpmTypeProcess: BehaviorSubject<BpmTypeProcess[]> = new BehaviorSubject<BpmTypeProcess[]>([]);
  private _listBpmDocumentsProcess: BehaviorSubject<BpmDocument[]> = new BehaviorSubject<BpmDocument[]>([]);

  informationRegister$: Observable<BaunitHead> = this.sendInformation.informationRegister$;
  cadastralNumberId$: Observable<string> = this._cadastralNumberId.asObservable();
  listBpmProcessCategory$: Observable<DomainCollection[]> = this._listBpmProcessCategory.asObservable();
  listBpmTypeProcess$: Observable<BpmTypeProcess[]> = this._listBpmTypeProcess.asObservable();
  listBpmDocumentsProcess$: Observable<BpmDocument[]> = this._listBpmDocumentsProcess.asObservable();
  isExistListBpmTypeProcess$: Observable<boolean> = of(false);

  baunitIdE: string | null = null;
  baunitIdE$ = this.route.params.pipe(map((params) => params[CONSTANT_NAME_ID]));

  participants: ProcessParticipant[] = [];

  propertyProcessing: string = 'Predio y Trámite';
  participation: string = 'Participación';
  verification: string = 'Verificación';
  informationRegister!: BaunitHead;
  informationClear: boolean = false;

  propertyProcessingFormGroup: UntypedFormGroup = this.formBuilder.group({
    selectBpmProcessByCategory: [null, Validators.required],
    selectBpmProcess: [null, Validators.required]
  });

  participationFormGroup: UntypedFormGroup = this.formBuilder.group({
    numberID: [null],
    typeNumberDocument: [null],
    typeParticipation: [null],
    personCompleted: [{ value: '', disabled: true }]
  });

  verificationFormGroup: UntypedFormGroup = this.formBuilder.group({
    typeClass: [{ value: '', disabled: true }],
    typeProcedure: [{ value: '', disabled: true }],
    auxiliaryFilings: [null]
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private collectionServicesService: CollectionServicesService,
    private sendInformation: SendInformationRegisterService,
    private bpmProcessService: BpmProcessService,
    private bpmCoreService: BpmCoreService,
    private infoGeneralService: SendInfoGeneralService
  ) {
    this.destroyRef.onDestroy(() => {
    });
  }

  async ngOnInit() {
    this.showBpmProcess(false);
    this.baunitIdE = await firstValueFrom(this.baunitIdE$);
    if (!this.baunitIdE || this.baunitIdE?.length <= 0) {
      this.snackBar.open('Identificador de la unidad predial no valido, por favor revisar.', undefined,
        { duration: 2000 });
      this.returnPanelTask(true);
      return;
    }

    this.informationRegister$
      .pipe(filter<BaunitHead>(Boolean))
      .subscribe((result: BaunitHead) => {
        if (!result) {
          this.returnPanelTask(true);
          return;
        }
        this.informationRegister = result;
        if (!this.informationRegister.cadastralNumber || this.informationRegister.cadastralNumber.length <= 0) {
          this.returnPanelTask(true);
          return;
        }
        this._cadastralNumberId.next(this.informationRegister.cadastralNumber);
      });

    this.obtainsCollectionsListProcessByCategory();
  }

  obtainsCollectionsListProcessByCategory() {
    let process = this.collectionServicesService.getDataDomainName(DOMAIN_COLLETION_BPMPROCESSCATEGORY);
    process.subscribe(
      {
        error: () => this._listBpmProcessCategory.next([]),
        next: (result: DomainCollection[]) => {
          let listCollections: DomainCollection[] = [];
          if (result != null && result.length > 0) {
            listCollections = result.filter(dmc => dmc.inactive === false);
          }
          this._listBpmProcessCategory.next(listCollections);
        }
      }
    );
  }

  loadBpmProcess(domainCollection: DomainCollection) {
    if (!domainCollection || !domainCollection?.code) {
      return;
    }
    this.bpmProcessService.getProceduresByCategory(domainCollection.code)
      .subscribe(
        {
          error: () => {
            this.showBpmProcess(false);
            this.changeSelectBpmProcess(null);
            this._listBpmTypeProcess.next([]);
          },
          next: (result: BpmTypeProcess[]) => {
            this.showBpmProcess(result && result?.length > 0);
            if (result?.length > 0) {
              result.forEach(rs => rs.selectProcess = false);
            }
            this.changeSelectBpmProcess(null);
            this._listBpmTypeProcess.next(result);
          }
        }
      );
  }

  loadBpmListDocumentsByProcessId() {
    const processId = this.propertyProcessingFormGroup.get('selectBpmProcess')?.value;
    if (!processId) {
      this.snackBar.open('No se encontro proceso seleccionado, por favor revisar.', undefined,
        { duration: 2000 });
      return;
    }
    this.bpmProcessService.getListDocumentsByProcessId(processId)
      .subscribe(
        {
          error: () => {
          },
          next: (result: string[]) => {
            if (!result || result?.length <= 0) {
              this.snackBar.open('Error no se encontro documentos asociados al proceso, por favor revisar.', undefined,
                { duration: 2000 });
              this._listBpmDocumentsProcess.next([]);
              return;
            }
            let listBpmDocument: BpmDocument[] = [];
            result.map(st => {
              let document = new BpmDocument(st);
              listBpmDocument.push(document);
            });
            this._listBpmDocumentsProcess.next(listBpmDocument);
          }
        }
      );
  }

  async submit() {
    const processId = this.propertyProcessingFormGroup.get('selectBpmProcess')?.value;
    if (!processId) {
      this.snackBar.open('No se encontro proceso seleccionado, por favor revisar.', undefined,
        { duration: 2000 });
      return;
    }
    const existeParticipants = this.participants.length > 0;
    if (!existeParticipants) {
      this.snackBar.open('No se encontro participantes agregados al proceso, por favor revisar.', undefined,
        { duration: 2000 });
      return;
    }
    const metadataList = this.createListMetadataBpm();
    if (!metadataList || metadataList.length <= 1) {
      this.snackBar.open('Error no se encontro radicado auxiliar o identificado de la unidad predial, por favor revisar.', undefined,
        { duration: 2000 });
      return;
    }

    const attachmentsList = await this.createListAttachmentsList();
    if (!attachmentsList || attachmentsList.length <= 0) {
      this.snackBar.open('Error no se encontro documentos asociados al proceso, por favor revisar.', undefined,
        { duration: 2000 });
      return;
    }
    const proExecutionE: ProExecutionE = new ProExecutionE(
      processId, this.participants, metadataList, attachmentsList
    );
    console.log(proExecutionE);
    this.bpmCoreService.bpmOperationStartProcess(proExecutionE).subscribe(
      {
        next: (proTaskE: ProTaskE) => {
          if (proTaskE?.executionId) {
            this.infoGeneralService.setFatherURL(PANEL_ASSIGNED_TASKS);
            this.router.navigate([`${environment.bpm_bpmCore}`, proTaskE.executionId])
              .then(() => {
              });

            this.snackBar.open(
              `Radicado Exitoso, Identificador: ${proTaskE?.executionId}`,
              'CLOSE',
              {
                duration: 5000
              }
            );
            return;
          }
          this.snackBar.open('ERROR, DESCONOCIDO');
        },
        error: (err: any) => {
          console.log(err);
          this.snackBar.open(err?.error, 'CLOSE', {
            duration: 5000,
            horizontalPosition: 'right'
          });
        }
      });
  }

  validateSelectProcess(bpmProcess: BpmTypeProcess) {
    if (bpmProcess?.selectProcess) {
      this.listBpmTypeProcess$.pipe(filter<BpmTypeProcess[]>(Boolean))
        .subscribe((result) => {
          result.forEach(process => {
            if (process.processId !== bpmProcess.processId) {
              process.selectProcess = false;
            }
          });
        });
      this.changeSelectBpmProcess(bpmProcess);
    } else {
      this.changeSelectBpmProcess(null);
    }
  }

  changeSelectBpmProcess(bpmProcess: BpmTypeProcess | null | undefined): void {
    if (bpmProcess === undefined) return;
    this.propertyProcessingFormGroup.get('selectBpmProcess')?.patchValue(bpmProcess?.processId || '');
    this.verificationFormGroup.get('typeClass')?.patchValue(bpmProcess?.description || '');
    this.verificationFormGroup.get('typeProcedure')?.patchValue(bpmProcess?.name || '');
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router.navigate([`${environment.myWork_cadastralSearch}`])
        .then(() => {
        });
    }
  }

  trackByProcessId(index: number, process: BpmTypeProcess): number | undefined {
    return process.processId;
  }

  trackByTypeDocumentName(index: number, type: BpmDocument): string | undefined {
    return type.name;
  }

  getOptionText(option: any): string {
    return option ? option.dispname : null;
  }

  showBpmProcess(value: boolean = false) {
    const valid = of(value);
    this.isExistListBpmTypeProcess$ = valid.pipe(take(3));
  }

  loadParticipants(participants: ProcessParticipant[]) {
    this.participants = participants;
  }

  get validateParticipants() {
    return this.participants.length <= 0;
  }

  createListMetadataBpm(): MetadataBpm[] {
    let list: MetadataBpm[] = [];
    if (this.baunitIdE) {
      list.push({
        metaField: `${CONSTANT_NAME_BAUNITID}`,
        metaValue: this.baunitIdE
      });
    }
    const auxiliaryFilings = this.verificationFormGroup.get('auxiliaryFilings')?.value;
    list.push({
      metaField: `${CONSTANT_NAME_ROOTING}`,
      metaValue: auxiliaryFilings && auxiliaryFilings?.length > 0 ? auxiliaryFilings : ''
    });
    return list;
  }

  async createListAttachmentsList(): Promise<string[]> {
    let list: string[] = [];
    const listBpmDocumentsProcess = await firstValueFrom(this.listBpmDocumentsProcess$);
    listBpmDocumentsProcess.forEach(st => {
      let status = st.state ? CONSTANT_NAME_SI_ : CONSTANT_NAME_NO_;
      list.push(`${status}${SPACE}${st.name}`);
    });
    return list;
  }

  protected readonly CONSTANT_FILING_PROCEDURES = CONSTANT_FILING_PROCEDURES;
}
