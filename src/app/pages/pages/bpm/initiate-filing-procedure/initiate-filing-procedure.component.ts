// Angular framework
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { BehaviorSubject, firstValueFrom, Observable, of } from 'rxjs';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { filter, map, startWith, take } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
// Vex
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
// Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
// Custom
import { BasicParticipantTableComponent } from './components/basic-participant-table/basic-participant-table.component';
import { BaunitHead } from '../../../../apps/interfaces/information-property/baunit-head.model';
import { BpmCoreService } from '../../../../apps/services/bpm/bpm-core.service';
import { BpmDocument } from '../../../../apps/interfaces/bpm/bpm-document';
import { BpmProcessService, PermissionVailable } from '../../../../apps/services/bpm/bpm-process.service';
import { BpmTypeProcess } from '../../../../apps/interfaces/bpm/bpm-type-process';
import { CollectionServices } from '../../../../apps/services/general/collection.service';
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
} from '../../../../apps/constants/general/constantLabels';
import { DomainCollection } from '../../../../apps/interfaces/general/domain-name.model';
import {
  DOMAIN_COLLECTION_BPM_PROCESS_CATEGORY,
  GUION,
  NAME_NO_DISPONIBLE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_CADASTRAL,
  PANEL_ASSIGNED_TASKS,
  SPACE,
  TABLE_COLUMN_PROPERTIES
} from '../../../../apps/constants/general/constants';
import { environment } from '../../../../../environments/environments';
import { FluidMinHeightDirective } from '../../../../apps/directives/fluid-min-height.directive';
import { MetadataBpm } from '../../../../apps/interfaces/bpm/metadata-bpm';
import { ProcessCardComponent } from './components/process-card/process-card.component';
import { ProcessParticipant } from '../../../../apps/interfaces/bpm/process-participant';
import { ProExecutionE } from '../../../../apps/interfaces/bpm/pro-execution-e';
import { ProTaskE } from '../../../../apps/interfaces/bpm/pro-task-e';
import { SendInfoGeneralService } from '../../../../apps/services/general/send-info-general.service';
import {
  SendInformationRegisterService
} from '../../../../apps/services/register-procedure/send-information-register.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'vex-initiate-filing-procedure',
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
    AsyncPipe,
    FormsModule,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    // Vex
    VexBreadcrumbsComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    // Custom
    BasicParticipantTableComponent,
    FluidMinHeightDirective,
    FluidMinHeightDirective,
    ProcessCardComponent
  ],
  templateUrl: './initiate-filing-procedure.component.html',
  styleUrl: './initiate-filing-procedure.component.scss'
})
export class InitiateFilingProcedureComponent implements OnInit {
  protected readonly CONSTANT_NAME_REGISTER = CONSTANT_NAME_REGISTER;
  protected readonly CONSTANT_NAME_RELOAD = CONSTANT_NAME_RELOAD;
  protected readonly CONSTANT_NAME_NEXT = CONSTANT_NAME_NEXT;
  protected readonly CONSTANT_NAME_RETURN = CONSTANT_NAME_RETURN;
  protected readonly CONSTANT_NAME_INITIATE_FILING_PROCEDURE =
    CONSTANT_NAME_INITIATE_FILING_PROCEDURE;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
  protected readonly GUION = GUION;
  protected readonly pageSize = PAGE_SIZE_TABLE_CADASTRAL;
  protected readonly columns = TABLE_COLUMN_PROPERTIES;
  protected readonly page = PAGE;
  protected readonly pageSizeOptions = PAGE_SIZE_OPTION;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private _cadastralNumberId: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  private _listBpmProcessCategory: BehaviorSubject<DomainCollection[]> =
    new BehaviorSubject<DomainCollection[]>([]);
  private _listBpmTypeProcess: BehaviorSubject<BpmTypeProcess[]> =
    new BehaviorSubject<BpmTypeProcess[]>([]);
  private _listBpmDocumentsProcess: BehaviorSubject<BpmDocument[]> =
    new BehaviorSubject<BpmDocument[]>([]);

  informationRegister$: Observable<BaunitHead> =
    this.sendInformation.informationRegister$;
  cadastralNumberId$: Observable<string> =
    this._cadastralNumberId.asObservable();
  listBpmProcessCategory$: Observable<DomainCollection[]> =
    this._listBpmProcessCategory.asObservable();
  listBpmTypeProcess$: Observable<BpmTypeProcess[]> =
    this._listBpmTypeProcess.asObservable();
  listBpmDocumentsProcess$: Observable<BpmDocument[]> =
    this._listBpmDocumentsProcess.asObservable();
  isExistListBpmTypeProcess$: Observable<boolean> = of(false);
  bpmProccessCategorySelected = false;

  baunitIdE: string | null = null;
  baunitIdE$ = this.route.params.pipe(
    map((params) => params[CONSTANT_NAME_ID])
  );

  participants: ProcessParticipant[] = [];

  propertyProcessing = 'Predio y trámite';
  participation = 'Participación';
  verification = 'Verificación';
  informationRegister!: BaunitHead;
  informationClear = false;

  propertyProcessingFormGroup: UntypedFormGroup = this.formBuilder.group({
    selectBpmProcessByCategory: ['', Validators.required],
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
    private collectionServicesService: CollectionServices,
    private sendInformation: SendInformationRegisterService,
    private bpmProcessService: BpmProcessService,
    private bpmCoreService: BpmCoreService,
    private infoGeneralService: SendInfoGeneralService
  ) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.destroyRef.onDestroy(() => {});
  }

  async ngOnInit() {
    this.showBpmProcess(false);
    this.baunitIdE = await firstValueFrom(this.baunitIdE$);
    if (!this.baunitIdE || this.baunitIdE?.length <= 0) {
      this.snackBar.open(
        'Identificador de la unidad predial no válido, por favor revisar.',
        undefined,
        { duration: 10000 }
      );
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
        if (
          !this.informationRegister.cadastralNumber ||
          this.informationRegister.cadastralNumber.length <= 0
        ) {
          this.returnPanelTask(true);
          return;
        }
        this._cadastralNumberId.next(this.informationRegister.cadastralNumber);
      });

    this.obtainsCollectionsListProcessByCategory();
    const selectBpmProcessByCategory =this.propertyProcessingFormGroup.controls['selectBpmProcessByCategory'];
    this.listBpmProcessCategory$ = selectBpmProcessByCategory.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string | DomainCollection): DomainCollection[] {
    if (!value) return this._listBpmProcessCategory.value;

    const searchText = typeof value === 'string' ? value : value.dispname!;

    const filterValue = searchText.toLowerCase();

    return this._listBpmProcessCategory.value.filter((option) => option.dispname?.toLowerCase().includes(filterValue));
  }

  obtainsCollectionsListProcessByCategory() {
    const process = this.collectionServicesService.getDataDomainName(
      DOMAIN_COLLECTION_BPM_PROCESS_CATEGORY
    );
    process.subscribe({
      error: () => this._listBpmProcessCategory.next([]),
      next: (result: DomainCollection[]) => {
        let listCollections: DomainCollection[] = [];
        if (result != null && result.length > 0) {
          listCollections = result.filter((dmc) => dmc.inactive === false);
        }
        this._listBpmProcessCategory.next(listCollections);
      }
    });
  }

  loadBpmProcess(domainCollection: DomainCollection) {
    this.bpmProccessCategorySelected = true;
    if (!domainCollection || !domainCollection?.code) {
      return;
    }
    this.bpmProcessService
      .getProceduresByCategory(domainCollection.code)
      .subscribe({
        error: () => {
          this.showBpmProcess(false);
          this.changeSelectBpmProcess(null);
          this._listBpmTypeProcess.next([]);
        },
        next: (result: BpmTypeProcess[]) => {
          this.showBpmProcess(result && result?.length > 0);
          if (result?.length > 0) {
            result.forEach((rs) => (rs.selectProcess = false));
          }
          this.changeSelectBpmProcess(null);
          this._listBpmTypeProcess.next(result);
        }
      });
  }

  loadBpmListDocumentsByProcessId() {
    const processId =
      this.propertyProcessingFormGroup.get('selectBpmProcess')?.value;
    if (!processId) {
      this.snackBar.open(
        'No se encontro proceso seleccionado, por favor revisar.',
        undefined,
        { duration: 10000 }
      );
      return;
    }
    this.bpmProcessService.getListDocumentsByProcessId(processId).subscribe({
      next: (result: string[]) => {
        if (!result || result?.length <= 0) {
          this.snackBar.open(
            'Error no se encontro documentos asociados al proceso, por favor revisar.',
            undefined,
            { duration: 10000 }
          );
          this._listBpmDocumentsProcess.next([]);
          return;
        }
        const listBpmDocument: BpmDocument[] = [];
        result.map((st) => {
          const document = new BpmDocument(st);
          listBpmDocument.push(document);
        });
        this._listBpmDocumentsProcess.next(listBpmDocument);
      }
    });
  }

  async submit() {
    const processId =
      this.propertyProcessingFormGroup.get('selectBpmProcess')?.value;
    if (!processId) {
      this.snackBar.open(
        'No se encontró un proceso seleccionado, por favor revisar.',
        undefined,
        { duration: 10000 }
      );
      return;
    }
    const existeParticipants = this.participants.length > 0;
    if (!existeParticipants) {
      this.snackBar.open(
        'No se encontró participantes agregados al proceso, por favor revisar.',
        undefined,
        { duration: 10000 }
      );
      return;
    }
    const metadataList = this.createListMetadataBpm();
    if (!metadataList || metadataList.length <= 1) {
      this.snackBar.open(
        'Error no se encontró radicado auxiliar o identificado de la unidad predial, por favor revisar.',
        undefined,
        { duration: 10000 }
      );
      return;
    }

    const attachmentsList = await this.createListAttachmentsList();
    if (!attachmentsList || attachmentsList.length <= 0) {
      this.snackBar.open(
        'Error no se encontró documentos asociados al proceso, por favor revisar.',
        undefined,
        { duration: 10000 }
      );
      return;
    }
    const proExecutionE: ProExecutionE = new ProExecutionE(
      processId,
      this.participants,
      metadataList,
      attachmentsList
    );
    this.bpmCoreService.bpmOperationStartProcess(proExecutionE).subscribe({
      next: (proTaskE: ProTaskE) => {
        this.bpmProcessService.setPermissions({ executionId: '', message: '' });
        if (proTaskE?.executionId && proTaskE.proTask?.taskId !== -1) {
          this.infoGeneralService.setFatherURL(PANEL_ASSIGNED_TASKS);
        if (proTaskE?.executionId) {
          this.infoGeneralService.setFatherURL(PANEL_ASSIGNED_TASKS);
          this.router
            .navigate([`${environment.bpm_bpmCore}`, proTaskE.executionId])
            .then();
          this.infoGeneralService.setInfoProTaskE(proTaskE);

          this.snackBar.open(
            `Radicado: ${proTaskE?.proTask?.flowDetail} Exitoso, Versión: ${proTaskE?.executionId}`,
            'CERRAR',
            {
              duration: 10000
            }
          );

          return;
        }

          this.infoGeneralService.setInfoProTaskE(proTaskE);
          return;
        }

        if (proTaskE?.proTask) {
          if (proTaskE.proTask.taskId! < 0) {
            const vailablePermission: PermissionVailable = {
              executionId: proTaskE.executionId?.toString() || '',
              message: proTaskE.proTask.flowName!
            };
            this.router.navigate([environment.myWork_tasksPanel], {
              queryParams: { executionId: proTaskE.executionId }
            });
            this.snackBar.open(proTaskE.proTask.flowName!, 'Aceptar', {
              duration: 10000
            });
            this.bpmProcessService.setPermissions(vailablePermission);
            return;
          }
        }
        this.snackBar.open('ERROR, DESCONOCIDO');
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err?.error, 'CERRAR', {
          duration: 10000,
          horizontalPosition: 'right'
        });
      }
    });
  }

  validateSelectProcess(bpmProcess: BpmTypeProcess) {
    if (bpmProcess?.selectProcess) {
      this.listBpmTypeProcess$
        .pipe(filter<BpmTypeProcess[]>(Boolean))
        .subscribe((result) => {
          result.forEach((process) => {
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
    this.propertyProcessingFormGroup
      .get('selectBpmProcess')
      ?.patchValue(bpmProcess?.processId || '');
    this.verificationFormGroup
      .get('typeClass')
      ?.patchValue(bpmProcess?.description || '');
    this.verificationFormGroup
      .get('typeProcedure')
      ?.patchValue(bpmProcess?.name || '');
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router.navigate([`${environment.myWork_cadastralSearch}`]).then();
    }
  }

  trackByProcessId(index: number, process: BpmTypeProcess): number | undefined {
    return process.processId;
  }

  trackByTypeDocumentName(
    index: number,
    type: BpmDocument
  ): string | undefined {
    return type.name;
  }

  getOptionText(option: DomainCollection): string {
    return option ? option.dispname! : '';
  }

  showBpmProcess(value = false) {
    const valid = of(value);
    this.isExistListBpmTypeProcess$ = valid.pipe(take(3));
  }

  loadParticipants(participants: ProcessParticipant[]) {
    this.participants = participants;
  }

  get validateParticipants() {
    return this.participants.length <= 0;
  }

  get listBpmProcessCategory() {
    return this._listBpmProcessCategory.value;
  }

  createListMetadataBpm(): MetadataBpm[] {
    const list: MetadataBpm[] = [];
    if (this.baunitIdE) {
      list.push({
        metaField: `${CONSTANT_NAME_BAUNITID}`,
        metaValue: this.baunitIdE
      });
    }
    const auxiliaryFilings =
      this.verificationFormGroup.get('auxiliaryFilings')?.value;
    list.push({
      metaField: `${CONSTANT_NAME_ROOTING}`,
      metaValue:
        auxiliaryFilings && auxiliaryFilings?.length > 0 ? auxiliaryFilings : ''
    });
    return list;
  }

  async createListAttachmentsList(): Promise<string[]> {
    const list: string[] = [];
    const listBpmDocumentsProcess = await firstValueFrom(
      this.listBpmDocumentsProcess$
    );
    listBpmDocumentsProcess.forEach((st) => {
      const status = st.state ? CONSTANT_NAME_SI_ : CONSTANT_NAME_NO_;
      list.push(`${status}${SPACE}${st.name}`);
    });
    return list;
  }

  protected readonly CONSTANT_FILING_PROCEDURES = CONSTANT_FILING_PROCEDURES;
}
