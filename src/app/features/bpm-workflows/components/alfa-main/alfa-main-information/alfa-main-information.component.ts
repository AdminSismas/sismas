import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  signal,
  input,
  viewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader
} from '@angular/material/expansion';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TableAlfaMainComponent } from '@features/bpm-workflows/components/table-alfa-main/table-alfa-main.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { Observable, ReplaySubject } from 'rxjs';
import { ChangeControl } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { OperationContentInformation } from '@shared/interfaces';
import { ProFlow } from '@shared/interfaces';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main/alfa-main.service';
import { SendInfoGeneralService } from '@shared/services/general/send-info-general.service';
import { InformationGeographicService } from '@features/bpm-workflows/services/alfa-main/information-geographic.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs/operators';
import { environment } from '@environments/environments';
import Swal from 'sweetalert2';
import { Operation } from '@shared/interfaces';
import {
  MAX_PAGE_SIZE_TABLE_UNIQUE,
  MODAL_MEDIUM,
  MODAL_SMALL,
  MODAL_SMALL_XS,
  PAGE,
  PAGE_OPTION_UNIQUE,
  TYPE_BUTTON_ELEVEN,
  TYPE_BUTTON_FIVE,
  TYPE_BUTTON_FOUR,
  TYPE_BUTTON_NINE,
  TYPE_BUTTON_ONE,
  TYPE_BUTTON_SIX,
  TYPE_BUTTON_TEN,
  TYPE_BUTTON_TREE,
  TYPE_BUTTON_TWO,
  TYPE_OPERATION_ADD,
  TYPE_OPERATION_CALCULATE_BOUNDARIES,
  TYPE_OPERATION_CREATE,
  TYPE_OPERATION_CREATE_GEO,
  TYPE_OPERATION_DELETE,
  TYPE_OPERATION_DELETE_GEO
} from '@shared/constants';
import { Pegeable } from '@shared/interfaces';
import { PageSearchData } from '@shared/interfaces';
import { ClearInformationDataComponent } from 'src/app/features/bpm-workflows/components/clear-information-data/clear-information-data.component';
import {
  CONSTANT_KEYWORD_DELETE_ALFA_MAIN,
  CONSTANT_KEYWORD_DELETE_GEO_MAIN,
  CONSTANT_MSG_KEYWORD_DELETE_ALFA_MAIN,
  CONSTANT_MSG_KEYWORD_DELETE_GEO_MAIN,
  CONSTANT_MSG_PLACEHOLDER_DELETE_GEO_MAIN,
  CONSTANT_TEXT_DELETE_GEO_MAIN,
  CONSTANT_TEXT_DELETE_GEO_MAIN_EMPTY,
  CONSTANT_TEXT_DELETE_GEO_MAIN_FAIL
} from '@shared/constants';
import { ViewChangeAlphaMainRecordComponent } from '@features/bpm-workflows/components/view-change-alpha-main-record/view-change-alpha-main-record.component';
import {
  TypeButtonAlfaMain,
  TypeOperationAlfaMain,
  TypeOperationGeoMain
} from '@shared/interfaces';
import { DataAlfaMain } from '@shared/interfaces';
import { CrudAlfaMainComponent } from '@features/bpm-workflows/components/alfa-main/crud-alfa-main/crud-alfa-main.component';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { LoadingServiceService } from '@shared/services/general/loading-service.service';
import { TableProceduresComponent } from 'src/app/apps/components/tables/table-procedures/table-procedures.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ViewChangesComponent } from '@features/bpm-workflows/components/alfa-main/alfa-main-information/view-changes/view-changes.component';
import { LoaderComponent } from '@shared/ui/loader/loader.component';import { FluidMinHeightDirective } from '@shared/directives/fluid-min-height.directive';

@Component({
  selector: 'vex-alfa-main-information',
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
    FluidMinHeightDirective,
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatIcon,
    TableAlfaMainComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    NgClass,
    SweetAlert2Module,
    LoaderComponent
  ],
  templateUrl: './alfa-main-information.component.html',
  styleUrl: './alfa-main-information.component.scss'
})
export class AlfaMainInformationComponent implements OnInit, AfterViewInit {
  public readonly executionId = input.required<string>();
  public readonly resources = input.required<string[]>();
  public readonly resourcesRemovers = input<string[]>([]);
  @Input({ required: false }) public mode = 1;
  public readonly fluidHeight = input('220');

  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );
  private alfaMainService: AlfaMainService = inject(AlfaMainService);

  refreshData$: Observable<boolean> = this.alfaMainService.refreshData$;
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  _validateChangeLog$: ReplaySubject<ChangeControl> =
    new ReplaySubject<ChangeControl>(1);
  _createChangeLog$: ReplaySubject<ChangeControl> =
    new ReplaySubject<ChangeControl>(1);

  validateChangeLog$: Observable<ChangeControl> =
    this._validateChangeLog$.asObservable();
  createChangeLog$: Observable<ChangeControl> =
    this._createChangeLog$.asObservable();

  infoFatherURL!: string;
  contentInformations!: InformationPegeable;
  changeGeoControl!: ChangeControl;
  listOperationContentInformation: OperationContentInformation[] = [];

  isResetLoading = signal<boolean>(false);

  public readonly successValidityProcedure = viewChild.required<SwalComponent>('successValidityProcedure');
  public readonly errorValidityProcedure = viewChild.required<SwalComponent>('errorValidityProcedure');

  constructor(
    proFlow: ProFlow,
    private infoGeneralService: SendInfoGeneralService,
    private geographicService: InformationGeographicService,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (proFlow?.mode) {
      this.mode = proFlow?.mode;
    }
  }

  ngOnInit() {
    this._infoFatherURL$
      .pipe(filter<string>(Boolean))
      .subscribe((result: string) => (this.infoFatherURL = result));

    if (!this.executionId()) {
      this.returnPanelTask(true);
      return false;
    }

    this.loadingServiceService.activateLoading(true);
    this.validateChangeLogAlfaMain();

    this.validateChangeLog$
      .pipe(filter<ChangeControl>(Boolean))
      .subscribe((result: ChangeControl) => {
        if (!result || result?.changeLogId === 0) {
          this.createAlfaMainOperations();
          return;
        }
        this.getAlfaMain();
      });

    this.createChangeLog$
      .pipe(filter<ChangeControl>(Boolean))
      .subscribe((result: ChangeControl) => {
        if (!result || result?.changeLogId === 0) {
          this.returnPanelTask(true);
          return;
        }
        this.getAlfaMain();
      });

    this.refreshData$
      .pipe(filter<boolean>(Boolean))
      .subscribe((result: boolean) => {
        if (result) {
          this.getAlfaMain();
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.infoFatherURL) {
        this.returnURLPrevious(`${environment.myWork_cadastralSearch}`);
        return;
      }

      if (!this.executionId()) {
        this.returnPanelTask(true);
        return false;
      }
    }, 300);
  }

  validateChangeLogAlfaMain() {
    this.alfaMainService
      .validateAlfaMainOperations(
        this.executionId(),
        `${environment.schemas.temp}`
      )
      .subscribe({
        next: (result: ChangeControl) => {
          if (!result) {
            this._validateChangeLog$.next(new ChangeControl());
            return;
          }
          this._validateChangeLog$.next(result);
        }
      });
  }

  createAlfaMainOperations() {
    this.alfaMainService
      .createAlfaMainOperations(this.executionId(), `${environment.schemas.temp}`)
      .subscribe({
        next: (result: ChangeControl) => this._createChangeLog$.next(result)
      });
  }

  getAlfaMain() {
    this.alfaMainService
      .getListAlfaMainOperations(this.generateObjectPageSearchData())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) => {
          this.captureInformationSubscribe(result);
        }
      });
  }

  captureInformationSubscribeError(): void {
    this.contentInformations = new InformationPegeable();
    this.listOperationContentInformation = [];
    this.loadingServiceService.activateLoading();
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.listOperationContentInformation = [];
    this.orderByInformationSubscribe();
    this.loadingServiceService.activateLoading();
  }

  orderByInformationSubscribe() {
    let data: Operation[];
    this.listOperationContentInformation = [];
    if (
      !this.contentInformations?.content ||
      this.contentInformations.content.length > 0
    ) {
      data = this.contentInformations.content;
      data = data.map((row: Operation) => new Operation(row));
      const indexOperation = this.indexArraylist(data);
      const result = Object.keys(indexOperation).map((key) => [
        key,
        indexOperation[key]
      ]);
      if (result && result.length > 0) {
        for (const npm in indexOperation) {
          if (npm) {
            const listOperation = indexOperation[npm] as Operation[];
            this.listOperationContentInformation.push(
              new OperationContentInformation(
                npm,
                new InformationPegeable(
                  listOperation.length / PAGE_OPTION_UNIQUE,
                  listOperation.length,
                  false,
                  listOperation.length,
                  listOperation.length,
                  true,
                  listOperation.length > 0,
                  listOperation,
                  new Pegeable(0, listOperation.length / PAGE_OPTION_UNIQUE)
                )
              )
            );
          }
        }
        return;
      }
      this.listOperationContentInformation = [];
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'No se puede continuar porque no se encuentra información que validar.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  indexArraylist(listObj: Operation[]) {
    if (listObj && listObj.length > 0) {
      return listObj.reduce((acc, el) => {
        acc[el.npnlike!] = acc[el.npnlike!] || [];
        acc[el.npnlike!].push(el);
        return acc;
      }, Object.create(null));
    }
  }

  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(
      PAGE,
      MAX_PAGE_SIZE_TABLE_UNIQUE,
      this.executionId()
    );
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }

  clearInformationAlfaMain() {
    this.isResetLoading.set(true);
    this.dialog
      .open(ClearInformationDataComponent, {
        width: '25%',
        disableClose: true,
        data: {
          message: CONSTANT_MSG_KEYWORD_DELETE_ALFA_MAIN,
          keyWord: CONSTANT_KEYWORD_DELETE_ALFA_MAIN
        }
      })
      .afterClosed()
      .subscribe((keyWord) => {
        if (!keyWord) {
          this.isResetLoading.set(false);
          return;
        }
        this.executeClearInformationAlfaMain(keyWord);
      });
  }

  executeClearInformationAlfaMain(keyWord: string) {
    this.alfaMainService
      .clearInformationAlfaMain(this.executionId(), keyWord)
      .subscribe({
        next: () => {
          this.contentInformations = new InformationPegeable();
          this.listOperationContentInformation = [];
          this.validateChangeLogAlfaMain();
          this.loadingServiceService.activateLoading();
          this.isResetLoading.set(false);
        },
        error: () => {
          this.isResetLoading.set(false);
        }
      });
  }

  analyzeChangesOperationAlfaMain() {
    this.dialog
      .open(ViewChangeAlphaMainRecordComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: [this.executionId()]
      })
      .afterClosed()
      .subscribe();
  }

  executeCrudAlfaMain(type: TypeOperationAlfaMain) {
    let config = {};
    if (type === TYPE_OPERATION_ADD) {
      config = {
        width: '30%',
        minHeight: '30%',
        disableClose: true,
        data: new DataAlfaMain(this.executionId(), type)
      };
    } else {
      config = {
        width: '70%',
        height: '90%',
        disableClose: true,
        data: new DataAlfaMain(this.executionId(), type)
      };
    }
    this.dialog
      .open(CrudAlfaMainComponent, config)
      .afterClosed()
      .subscribe(() => {
        this.validateChangeLogAlfaMain();
      });
  }

  executeCreateAlfaGeo(type: TypeOperationGeoMain) {
    const executionId = this.executionId();
    if (type === TYPE_OPERATION_CREATE_GEO && executionId) {
      this.geographicService
        .createGeographicChangesTemp(executionId)
        .subscribe({
          next: (result: ChangeControl) => {
            if (result && result.changeLogId && result.changeLogId > 0) {
              this.getAlertSuccess(
                `Se ha logrado crear el cambio geo con el logId: ${result.changeLogId}`
              );
              return;
            }

            return;
          }
        });
    }
  }

  executeDeletedAlfaGeo(type: TypeOperationGeoMain) {
    if (type === TYPE_OPERATION_DELETE_GEO && this.executionId()) {
      Swal.fire({
        titleText: CONSTANT_MSG_KEYWORD_DELETE_GEO_MAIN,
        input: 'text',
        inputPlaceholder: CONSTANT_MSG_PLACEHOLDER_DELETE_GEO_MAIN,
        inputAttributes: { autocapitalize: 'off' },
        showCancelButton: true,
        confirmButtonText: CONSTANT_TEXT_DELETE_GEO_MAIN,
        showLoaderOnConfirm: true,
        preConfirm: async (text: string) => {
          try {
            return !text || text.length <= 0
              ? Swal.showValidationMessage(CONSTANT_TEXT_DELETE_GEO_MAIN_EMPTY)
              : text;
          } catch {
            // Handle the error appropriately, e.g., log it to an external service or remove this line in production.
            Swal.showValidationMessage(CONSTANT_TEXT_DELETE_GEO_MAIN_FAIL);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (
          result.isConfirmed &&
          result.value === CONSTANT_KEYWORD_DELETE_GEO_MAIN
        ) {
          this.geographicService
            .deleteGeographicChangesTemp(this.executionId())
            .subscribe({
              next: () =>
                this.getAlertSuccess('Se ha logrado eliminar el cambio geo')
            });
        }
      });
    }
  }

  executeCalculateBoundaries(type: TypeOperationGeoMain) {
    if (type === TYPE_OPERATION_CALCULATE_BOUNDARIES && this.executionId()) {
      this.getAlertSuccess('Calculo linderos inicia ejecucion a ejecutarse');
    }
  }

  buttonsClass(btn: TypeButtonAlfaMain | null): string {
    let color = '!bg-slate-400 !text-gray-100 opacity-60';

    switch (btn) {
      case 'AGR':
      case 'CAL_BOU':
        if (!this.disabledButton(btn)) {
          color = '!text-white !bg-primary-600';
        }
        break;

      case 'CRE':
      case 'CRE_GEO':
        if (!this.disabledButton(btn)) {
          color = '!text-white !bg-green-600';
        }
        break;

      case 'BRR':
      case 'DEL_GEO':
        if (!this.disabledButton(btn)) {
          color = '!text-white !bg-red-600';
        }
        break;

      case 'VIGEN':
        if (!this.disabledButton(btn)) {
          color = '!bg-teal-500 !text-slate-100';
        }
        break;
      case 'RESET':
        if (!this.disabledButton(btn)) {
          color = '';
        }
        break;
      case 'CHANGES':
        if (!this.disabledButton(btn)) {
          color = '!bg-green-700/80 !text-white';
        }
        break;
    }

    return `rounded-full py-2 px-6 title ${color}`;
  }

  getAlertSuccess(text: string) {
    Swal.fire({
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    }).then();
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }

  disabledButton(btn: TypeButtonAlfaMain | null): boolean {
    if (!btn) {
      return true;
    }
    return !this.resources().includes(btn);
  }

  buttonRemovers(btn: TypeButtonAlfaMain): boolean {
    return !this.resourcesRemovers().includes(btn);
  }

  validityProcedure() {
    let validateChangeLog: ChangeControl = new ChangeControl();
    this.validateChangeLog$.pipe(take(1)).subscribe({
      next: (result: ChangeControl) => {
        validateChangeLog = result;
      }
    });

    this.dialog
      .open(TableProceduresComponent, {
        ...MODAL_SMALL_XS,
        data: {
          executionId: this.executionId(),
          validateChangeLog
        }
      })
      .afterClosed()
      .subscribe({
        next: (result: boolean) => {
          if (result) {
            this.validateChangeLogAlfaMain();
            this.successValidityProcedure().fire();
          }

          if (result === false) {
            this.errorValidityProcedure().fire();
          }
        }
      });
  }

  viewChanges() {
    this.dialog.open(ViewChangesComponent, {
      ...MODAL_MEDIUM,
      data: {
        executionId: this.executionId()
      }
    });
  }

  protected readonly TYPE_OPERATION_CREATE = TYPE_OPERATION_CREATE;
  protected readonly TYPE_OPERATION_DELETE = TYPE_OPERATION_DELETE;
  protected readonly TYPE_OPERATION_ADD = TYPE_OPERATION_ADD;
  protected readonly TYPE_BUTTON_ONE = TYPE_BUTTON_ONE;
  protected readonly TYPE_BUTTON_TWO = TYPE_BUTTON_TWO;
  protected readonly TYPE_BUTTON_TREE = TYPE_BUTTON_TREE;
  protected readonly TYPE_BUTTON_FOUR = TYPE_BUTTON_FOUR;
  protected readonly TYPE_BUTTON_FIVE = TYPE_BUTTON_FIVE;
  protected readonly TYPE_BUTTON_SIX = TYPE_BUTTON_SIX;
  protected readonly TYPE_BUTTON_VALIDITY = TYPE_BUTTON_NINE;
  protected readonly TYPE_BUTTON_RESET = TYPE_BUTTON_TEN;
  protected readonly TYPE_BUTTON_CHANGES = TYPE_BUTTON_ELEVEN;
  protected readonly TYPE_OPERATION_DELETE_GEO = TYPE_OPERATION_DELETE_GEO;
  protected readonly TYPE_OPERATION_CREATE_GEO = TYPE_OPERATION_CREATE_GEO;
  protected readonly TYPE_OPERATION_CALCULATE_BOUNDARIES =
    TYPE_OPERATION_CALCULATE_BOUNDARIES;
}
