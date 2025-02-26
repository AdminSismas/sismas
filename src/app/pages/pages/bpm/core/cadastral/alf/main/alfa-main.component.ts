/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { FluidMinHeightDirective } from '../../../../../../../apps/directives/fluid-min-height.directive';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAX_PAGE_SIZE_TABLE_UNIQUE,
  MODAL_SMALL,
  PAGE,
  PAGE_OPTION_UNIQUE, TYPE_BOTTON_FIVE,
  TYPE_BOTTON_FOUR,
  TYPE_BOTTON_ONE,
  TYPE_BOTTON_TREE,
  TYPE_BOTTON_TWO,
  TYPEOPERATION_ADD,
  TYPEOPERATION_CREATE, TYPEOPERATION_CREATE_GEO,
  TYPEOPERATION_DELETE, TYPEOPERATION_DELETE_GEO
} from '../../../../../../../apps/constants/general/constant';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProFlow } from '../../../../../../../apps/interfaces/bpm/pro-flow';
import { InformationPegeable } from '../../../../../../../apps/interfaces/general/information-pegeable.model';
import { AlfaMainService } from '../../../../../../../apps/services/bpm/core/alfa-main.service';
import { PageSearchData } from '../../../../../../../apps/interfaces/general/page-search-data.model';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  LoadingAppComponent
} from '../../../../../../../apps/components/general-components/loading-app/loading-app.component';
import { Operation } from '../../../../../../../apps/interfaces/bpm/operation';
import { SendInfoGeneralService } from '../../../../../../../apps/services/general/send-info-general.service';
import { environment } from '../../../../../../../../environments/environments';
import { Router } from '@angular/router';
import { ChangeControl } from '../../../../../../../apps/interfaces/bpm/change-control';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {
  TableAlfaMainComponent
} from '../../../../../../../apps/components/bpm/table-alfa-main/table-alfa-main.component';
import {
  ClearInformationDataComponent
} from '../../../../../../../apps/components/bpm/clear-information-data/clear-information-data.component';
import {
  CONSTANT_KEYWORD_DELETE_ALFA_MAIN, CONSTANT_KEYWORD_DELETE_GEO_MAIN,
  CONSTANT_MSG_KEYWORD_DELETE_ALFA_MAIN,
  CONSTANT_MSG_KEYWORD_DELETE_GEO_MAIN, CONSTANT_MSG_PLACEHOLDER_DELETE_GEO_MAIN,
  CONSTANT_TEXT_DELETE_GEO_MAIN,
  CONSTANT_TEXT_DELETE_GEO_MAIN_EMPTY, CONSTANT_TEXT_DELETE_GEO_MAIN_FAIL
} from '../../../../../../../apps/constants/general/constantLabels';
import { OperationContentInformation } from '../../../../../../../apps/interfaces/bpm/operation-content-information';
import { Pegeable } from '../../../../../../../apps/interfaces/general/pegeable.model';
import {
  ViewChangeAlphaMainRecordComponent
} from '../../../../../../../apps/components/bpm/view-change-alpha-main-record/view-change-alpha-main-record.component';
import {
  TypeButtonAlfaMain,
  TypeOperationAlfaMain,
  TypeOperationGeoMain
} from '../../../../../../../apps/interfaces/general/content-info';
import {
  CrudAlfaMainComponent
} from '../../../../../../../apps/components/bpm/crud-alfa-main/crud-alfa-main.component';
import { DataAlfaMain } from 'src/app/apps/interfaces/bpm/data-alfa-main.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import {
  InformationGeographicService
} from '../../../../../../../apps/services/geographics/information-geographic.service';

@Component({
  selector: 'vex-alfa-main',
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
    NgIf,
    NgClass,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    FluidMinHeightDirective,
    MatStepperModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    AsyncPipe,
    LoadingAppComponent,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TableAlfaMainComponent
  ],
  templateUrl: './alfa-main.component.html',
  styleUrl: './alfa-main.component.scss'
})
export class AlfaMainComponent implements OnInit, AfterViewInit {
  public id: string = this.getRandomInt(1234).toString();

  @Input({ required: true }) public executionId = '';
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public mode: number = 1;

  isExistDataInformations$: Observable<boolean> = of(false);
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  _validateChangeLog$: ReplaySubject<ChangeControl> = new ReplaySubject<ChangeControl>(1);
  _createChangeLog$: ReplaySubject<ChangeControl> = new ReplaySubject<ChangeControl>(1);

  validateChangeLog$: Observable<ChangeControl> = this._validateChangeLog$.asObservable();
  createChangeLog$: Observable<ChangeControl> = this._createChangeLog$.asObservable();

  infoFatherURL!: string;
  contentInformations!: InformationPegeable;
  changeGeoControl!: ChangeControl;
  listOperationContentInformation: OperationContentInformation[] = [];

  constructor(
    proFlow: ProFlow,
    private alfaMainService: AlfaMainService,
    private infoGeneralService: SendInfoGeneralService,
    private geographicService: InformationGeographicService,
    private router: Router,
    private dialog: MatDialog
  ) {
    if (proFlow?.flowId) {
      this.id += proFlow?.flowId;
    }
    if (proFlow?.mode) {
      this.mode = proFlow?.mode;
    }
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

    this._infoFatherURL$
      .pipe(filter<string>(Boolean))
      .subscribe((result: string) => this.infoFatherURL = result);

    if (!this.executionId) {
      this.returnPanelTask(true);
      return false;
    }

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
  }

  ngAfterViewInit() {
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
  }

  validateChangeLogAlfaMain() {
    this.alfaMainService
      .validateAlfaMainOperations(
        this.executionId,
        `${environment.schemas.temp}`
      )
      .subscribe({
        error: () => this.captureInformationChangeLogAlfaMainError(),
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
      .createAlfaMainOperations(this.executionId, `${environment.schemas.temp}`)
      .subscribe({
        error: () => this.captureInformationChangeLogAlfaMainError(),
        next: (result: ChangeControl) => this._createChangeLog$.next(result)
      });
  }

  getAlfaMain() {
    console.log('Actualizando ...');
    this.alfaMainService
      .getListAlfaMainOperations(this.generateObjectPageSearchData())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this.captureInformationSubscribe(result)
      });
  }

  captureInformationSubscribeError(): void {
    this.contentInformations = new InformationPegeable();
    this.listOperationContentInformation = [];
    this.activateLoading(true);
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.listOperationContentInformation = [];
    this.orderByInformationSubscribe();
    this.activateLoading(true);
  }

  captureInformationChangeLogAlfaMainError() {
    Swal.fire({
      text: 'No se puede continuar la actividad error en la validación alfanumérica.',
      icon: 'error',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
    });
  }

  orderByInformationSubscribe() {
    let data: Operation[];
    this.listOperationContentInformation = [];
    if (this.contentInformations?.content != null) {
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
    }
  }

  indexArraylist(listObj: Operation[]) {
    if (listObj && listObj.length > 0) {
      return listObj.reduce((acc, el: any) => {
        acc[el.npnlike] = acc[el.npnlike] || [];
        acc[el.npnlike].push(el);
        return acc;
      }, Object.create(null));
    }
  }



  generateObjectPageSearchData(): PageSearchData {
    return new PageSearchData(
      PAGE,
      MAX_PAGE_SIZE_TABLE_UNIQUE,
      this.executionId
    );
  }

  activateLoading(value = false) {
    const valid = of(value);
    this.isExistDataInformations$ = valid.pipe(take(3));
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }

  clearInformationAlfaMain() {
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
          return;
        }
        this.executeClearInformationAlfaMain(keyWord);
      });
  }

  executeClearInformationAlfaMain(keyWord: string) {
    this.alfaMainService.clearInformationAlfaMain(this.executionId, keyWord)
      .subscribe({
        next: () => {
          this.contentInformations = new InformationPegeable();
          this.listOperationContentInformation = [];
          this.validateChangeLogAlfaMain();
          this.activateLoading();
        },
        error: (error: HttpErrorResponse) => {
          Swal.fire({
            text: 'Error al eliminar la unidad predial.',
            icon: 'error',
            showConfirmButton: false,
            timer: 100
          }).then(() => {
          });
          throw error;
        }
      });
  }

  analyzeChangesOperationAlfaMain() {
    this.dialog
      .open(ViewChangeAlphaMainRecordComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: [this.executionId]
      })
      .afterClosed()
      .subscribe();
  }

  executeCrudAlfaMain(type: TypeOperationAlfaMain) {
    let config = {};
    if (type === TYPEOPERATION_ADD) {
      config = {
        width: '30%',
        minHeight: '30%',
        disableClose: true,
        data: new DataAlfaMain(this.executionId, type)
      };
    } else {
      config = {
        width: '70%',
        height: '90%',
        disableClose: true,
        data: new DataAlfaMain(this.executionId, type)
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
    if (type === TYPEOPERATION_CREATE_GEO && this.executionId) {
      this.geographicService.createGeographicChangesTemp(this.executionId)
        .subscribe({
          next: (result: ChangeControl) => {
            if(result && result.changeLogId && result.changeLogId > 0) {
              this.getAlertSuccess(
                `Se ha logrado crear el cambio geo con el logId: ${result.changeLogId}`
              )
              return;
            }
            this.getAlertError('No se ha logrado eliminar el cambio geo');
            return;
          },
          error: () => this.getAlertError('No se ha logrado eliminar el cambio geo')
        });
    }
  }

  executeDeletedAlfaGeo(type: TypeOperationGeoMain) {
    if (type === TYPEOPERATION_DELETE_GEO && this.executionId) {
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
            return !text || text.length <= 0 ?
              Swal.showValidationMessage(CONSTANT_TEXT_DELETE_GEO_MAIN_EMPTY) :
              text;
          } catch (error) {
            Swal.showValidationMessage(CONSTANT_TEXT_DELETE_GEO_MAIN_FAIL);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed && result.value === CONSTANT_KEYWORD_DELETE_GEO_MAIN) {
          this.geographicService.deleteGeographicChangesTemp(this.executionId)
            .subscribe({
              next: () => this.getAlertSuccess('Se ha logrado eliminar el cambio geo'),
              error: () => this.getAlertError('No se ha logrado eliminar el cambio geo')
            });
        }
      });
    }
  }

  buttonsClass(btn: TypeButtonAlfaMain): string {
    let color = '!bg-slate-400 !text-gray-100 opacity-60';
    if (btn === 'AGR' && !this.disabledButton(btn)) {
      color = '!text-white !bg-primary-600';
    } else if ((btn === 'CRE' || btn === 'CRE_GEO') && !this.disabledButton(btn)) {
      color = '!text-white !bg-green-600';
    } else if ((btn === 'BRR' || btn === 'DEL_GEO') && !this.disabledButton(btn)) {
      color = '!text-white !bg-red-600';
    }
    return `rounded-full py-2 px-6 title ${color}`;
  }

  getAlertSuccess(text: string) {
    Swal.fire({
      text: text,
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
    });
  }

  getAlertError(text: string) {
    Swal.fire({
      title: '¡Error!',
      text: text,
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
    });
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }

  disabledButton(btn: TypeButtonAlfaMain): boolean {
    return this.resources.includes(btn);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly TYPEOPERATION_CREATE = TYPEOPERATION_CREATE;
  protected readonly TYPEOPERATION_DELETE = TYPEOPERATION_DELETE;
  protected readonly TYPEOPERATION_ADD = TYPEOPERATION_ADD;
  protected readonly TYPE_BOTTON_TWO = TYPE_BOTTON_TWO;
  protected readonly TYPE_BOTTON_TREE = TYPE_BOTTON_TREE;
  protected readonly TYPE_BOTTON_FOUR = TYPE_BOTTON_FOUR;
  protected readonly TYPE_BOTTON_ONE = TYPE_BOTTON_ONE;
  protected readonly TYPE_BOTTON_FIVE = TYPE_BOTTON_FIVE;
  protected readonly TYPEOPERATION_DELETE_GEO = TYPEOPERATION_DELETE_GEO;
  protected readonly TYPEOPERATION_CREATE_GEO = TYPEOPERATION_CREATE_GEO;
}
