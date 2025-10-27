import { Component, inject, Injector, OnInit, signal } from '@angular/core';
import { AsyncPipe, NgClass, NgComponentOutlet } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { firstValueFrom, Observable, ReplaySubject } from 'rxjs';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';

import { HeaderBpmCoreComponent } from '../../../../apps/components/bpm/header-bpm-core/header-bpm-core.component';
import {
  COMPONENT_PATH_FORM_ALFA_MAIN,
  CONSTANT_VALIDATE_CHECK,
  CONSTANT_VALIDATE_OTHER,
  LISTO_FORM_BPM_CORE,
  MODAL_SMALL
} from '../../../../apps/constants/general/constants';
import { GeneralValidationsService } from '@shared/services';
import {
  BasicComponentTemplate,
  ComponentTemplate
} from '@shared/interfaces';
import { ProFlow } from '@shared/interfaces';
import { BpmCoreService } from '@shared/services';
import { ProTaskE } from '@shared/interfaces';
import { MatOptionModule } from '@angular/material/core';
import { DynamicComponentsService } from '@shared/services';
import { CONSTANT_NAME_ID } from '../../../../apps/constants/general/constantLabels';
import { environment } from '../../../../../environments/environments';
import { SendInfoGeneralService } from '@shared/services';
import { MatDialog } from '@angular/material/dialog';
import { ShowErrorValidateAlfaMainComponent } from 'src/app/apps/components/bpm/show-error-validate-alfa-main/show-error-validate-alfa-main.component';
import {
  BpmProcessService,
  PermissionVailable
} from 'src/app/apps/services/bpm/bpm-process.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { LoadingServiceService } from '@shared/services';
import { InformationPropertyService } from '@shared/services';
import { LoaderComponent } from '@shared/ui/loader/loader.component';
import { FluidHeightDirective } from 'src/app/apps/directives/fluid-height.directive';

@Component({
  selector: 'vex-bmp-core',
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
    NgClass,
    NgComponentOutlet,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
    FluidHeightDirective,
    HeaderBpmCoreComponent,
    LoaderComponent
  ],
  templateUrl: './bmp-core.component.html',
  styleUrl: './bmp-core.component.scss'
})
export class BmpCoreComponent implements OnInit {
  private listComponents = inject(
    DynamicComponentsService
  ).getDynamicComponents();

  private readonly injector = inject(Injector);
  private loadingServiceService: LoadingServiceService = inject(
    LoadingServiceService
  );

  _infoProTaskE$: Observable<ProTaskE> = this.infoGeneralService.infoProTaskE$;
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  _components$: ReplaySubject<ComponentTemplate[]> = new ReplaySubject<
    ComponentTemplate[]
  >(1);
  _proFlow$ = this.route.data.pipe(map(({ proFlow }) => proFlow));
  _resources$ = this.route.data.pipe(map(({ resources }) => resources));

  components$: Observable<ComponentTemplate[]> =
    this._components$.asObservable();
  executionId$ = this.route.params.pipe(
    map((params) => params[CONSTANT_NAME_ID])
  );

  proTaskE_Bpm: ProTaskE | null = null;
  executionId = '';
  proFlow!: ProFlow;
  infoFatherURL!: string;
  resources: string[] = [];

  isAcceptLoading = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private validations: GeneralValidationsService,
    private router: Router,
    private readonly layoutService: VexLayoutService,
    private bpmCoreService: BpmCoreService,
    private infoGeneralService: SendInfoGeneralService,
    private informationProperty: InformationPropertyService,
    private bpmProcessService: BpmProcessService
  ) {}

  async ngOnInit() {
    this.loadingServiceService.activateLoading(true);
    this.executionId = await firstValueFrom(this.executionId$);
    this.proFlow = await firstValueFrom(this._proFlow$);
    this.infoFatherURL = await firstValueFrom(this._infoFatherURL$);
    this.resources = await firstValueFrom(this._resources$);

    if (!this.infoFatherURL) {
      this.returnURLPrevious(`${environment.myWork_cadastralSearch}`);
      return;
    }

    this._infoProTaskE$.subscribe((result: ProTaskE) => {
      if (!result) {
        this.returnPanelTask(true);
        return;
      }
    });

    const isValid: boolean = this.validateInformationComponent(this.proFlow);
    if (isValid) {
      this.refreshComponentsDynamic(this.proFlow);
      return;
    }
    this.loadingServiceService.activateLoading(false);
  }

  confirmAction(
    action: () => void,
    message: string,
    icon: SweetAlertIcon | undefined
  ): void {
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

  onReject(): void {
    this.confirmAction(
      () => this.previewBpmCore(),
      '¿Está seguro que desea rechazar la tarea?',
      'warning'
    );
  }

  onAccept(): void {
    this.isAcceptLoading.set(true);

    this.nextBpmCore();
    this.isAcceptLoading.set(false);
    return;
  }

  checkStatusBpmOperation() {
    this.bpmCoreService.checkStatusBpmOperation(this.executionId).subscribe({
      error: () => {
        this.isAcceptLoading.set(false);
        this.getAlertError(
          'Error ejecutando servicio validación de alfa main o validate main, no es posible continuar',
          3000
        );
      },
      next: (result: string[]) => {
        if (!result || result.length <= 0) {
          this.executeAppraise();
          this.confirmAction(
            () => this.executeBpmNextBpmCore(),
            '¿Está seguro que desea continuar a la siguiente tarea?',
            'info'
          );
          this.loadingServiceService.activateLoading(false);
          this.isAcceptLoading.set(false);
          return;
        }

        this.dialog.open(ShowErrorValidateAlfaMainComponent, {
          ...MODAL_SMALL,
          data: {
            errors: result,
            executionId: this.executionId
          }
        });
        this.loadingServiceService.activateLoading(false);
        this.isAcceptLoading.set(false);
      }
    });
  }

  // bpmOperationNextWithValidation() {
  //   this.bpmCoreService.checkStatusBpmOperation(this.executionId).subscribe({
  //     next: (result) => {
  //       if (result.length > 0) {
  //         this.dialog.open(ShowErrorValidateAlfaMainComponent, {
  //           ...MODAL_SMALL,
  //           data: {
  //             errors: result,
  //             executionId: this.executionId
  //           }
  //         });
  //         this.loadingServiceService.activateLoading(false);
  //         this.isAcceptLoading.set(false);
  //         return;
  //       }

  //       this.executeAppraise();
  //       this.confirmAction(
  //         () => this.executeBpmNextBpmCore(),
  //         '¿Está seguro que desea continuar a la siguiente tarea?',
  //         'info'
  //       );
  //       this.loadingServiceService.activateLoading(false);
  //       this.isAcceptLoading.set(false);
  //       return;
  //     },
  //     error: () => {
  //       this.loadingServiceService.activateLoading(false);
  //       this.isAcceptLoading.set(false);
  //     }
  //   });
  // }

  refreshComponentsDynamic(proFlow: ProFlow) {
    if (!proFlow || !proFlow.preform || !proFlow.preform.pathForm) {
      this.getAlertError('Error valor inválido, no es posible continuar', 3000);
      return;
    }
    const pathForm = proFlow.preform.pathForm;
    const components: BasicComponentTemplate[] = LISTO_FORM_BPM_CORE.filter(
      (x) => x.pathForm.includes(pathForm)
    );
    const listComponents: ComponentTemplate[] = [];
    if (components?.length > 0) {
      components.forEach((component: BasicComponentTemplate) => {
        const listTmp: ComponentTemplate[] = this.listComponents.filter(
          (x: ComponentTemplate) => x.nameComponent.includes(component.name)
        );

        if (listTmp?.length > 0) {
          listTmp.forEach((x) => this.createObjectComponent(x, component));
          listComponents.push(...listTmp);
        }
      });
      this._components$.next(listComponents);
      this.loadingServiceService.activateLoading(false);
    }
  }

  validateInformationComponent(proFlow: ProFlow) {
    if (!this.validations.isValueField(this.executionId)) {
      this.returnPanelTask(true);
      return false;
    }

    if (
      (!this.validations.isValueField(proFlow) &&
        !this.validations.isNotValueFieldZero(proFlow.flowId)) ||
      !this.validations.isValueField(proFlow.preform?.pathForm)
    ) {
      this.getAlertError('Error valor inválido, no es posible continuar');
      return false;
    }
    return true;
  }

  async returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      const isCollapse: boolean = await firstValueFrom(this.sidenavCollapsed$);
      if (isCollapse) {
        this.layoutService.expandSidenav();
      }
      this.router.navigate([
        `${environment.myWork_tasksPanel}${this.infoFatherURL}`
      ]);
    }
  }

  nextBpmCore() {
    this.isAcceptLoading.set(true);
    this.loadingServiceService.activateLoading(true);
    if (this.proFlow) {
      const pathForm = this.proFlow?.preform?.pathForm;
      if (!pathForm) {
        this.isAcceptLoading.set(false);
        return;
      }
      const components: BasicComponentTemplate[] = LISTO_FORM_BPM_CORE.filter(
        (component) => component.pathForm.includes(pathForm)
      );

      let serviceValidation = '';
      if (components.length >= 1) {
        serviceValidation = components[0].serviceValidation;
      }

      if (!serviceValidation) {
        this.loadingServiceService.activateLoading(false);
        this.confirmAction(
          () => this.executeBpmNextBpmCore(),
          '¿Está seguro que desea continuar a la siguiente tarea?',
          'info'
        );
        return;
      }

      switch (serviceValidation) {
        case CONSTANT_VALIDATE_CHECK:
          this.checkStatusBpmOperation();
          return;
        case CONSTANT_VALIDATE_OTHER:
          break;
        default:
          this.executeBpmNextBpmCore();
          return;
      }
    }
  }

  executeAppraise() {
    if (!this.proFlow.preform || !this.proFlow.preform.pathForm) return;

    const pathForm = this.proFlow.preform.pathForm;
    if (pathForm !== COMPONENT_PATH_FORM_ALFA_MAIN) return;

    this.informationProperty
      .executeAppraisalProcess(this.executionId)
      .subscribe({
        next: (response) => {
          console.log('Realizado el avalúo con respuesta: ', response);
        },
        error: (error) => {
          console.error('Error al realizar el avalúo: ', error);
        }
      });
  }

  executeBpmNextBpmCore() {
    if (this.proFlow.question && this.proFlow.questionFlow) {
      this.loadingServiceService.activateLoading(false);
      Swal.fire({
        text: this.proFlow.question,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Sí',
        denyButtonText: 'No',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#3085d6',
        allowEscapeKey: false,
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeBpmNextService(true);
        } else if (result.isDenied) {
          this.executeBpmNextService(false);
        } else {
          this.loadingServiceService.activateLoading(false);
          this.isAcceptLoading.set(false);
        }
      });
    } else {
      this.executeBpmNextService(true);
    }
  }

  executeBpmNextService(answer: boolean) {
    this.bpmCoreService
      .getNextOperation(this.executionId, answer)
      .subscribe({
        next: (result: ProTaskE) => this.captureInformationBpmCore(result),
        error: () => this.loadingServiceService.activateLoading(false)
      });
  }

  previewBpmCore() {
    this.loadingServiceService.activateLoading(true);
    this.bpmCoreService
      .getPreviewOperation(this.executionId)
      .subscribe({
        next: (result: ProTaskE) => this.captureInformationBpmCore(result),
        error: () => this.loadingServiceService.activateLoading(false)
      });
  }

  captureInformationBpmCore(result: ProTaskE) {
    if (result?.proTask) {
      if (result.proTask.taskId! < 0) {
        const vailablePermission: PermissionVailable = {
          executionId: result.executionId?.toString() ?? '',
          message: result?.proTask?.flowName ?? ''
        };
        Swal.fire({
          text: result.proTask!.flowName!,
          icon: 'success',
          showConfirmButton: true,
          timer: 10000
        });
        this.bpmProcessService.setPermissions(vailablePermission);
        this.router.navigate([environment.myWork_tasksPanel], {
          queryParams: { executionId: vailablePermission.executionId }
        });
        return;
      }
    }

    this.proTaskE_Bpm = result;
    this.executionId = result.executionId?.toString() || '';
    this.getNewProFlow(result.flowId!.toString());
    this.infoGeneralService.setInfoProTaskE(result);
    this.loadingServiceService.activateLoading(false);
    this.isAcceptLoading.set(false);
  }

  getNewProFlow(flowId: string) {
    this.bpmCoreService.getProFlow(flowId).subscribe((result: ProFlow) => {
      const isValid: boolean = this.validateInformationComponent(result);
      if (isValid) {
        this.proFlow = result;
        this.refreshComponentsDynamic(result);
      }
    });
  }

  createObjectComponent(
    obj: ComponentTemplate,
    component: BasicComponentTemplate
  ) {
    obj.nameComponent = component.name;
    obj.pathForm = component.pathForm;
    obj.inputs = {
      executionId: this.executionId,
      resources: this.resources,
      mode: component.mode
    };
    this.proFlow.mode = component.mode;
    obj.componentData = Injector.create({
      providers: [{ provide: ProFlow, useValue: this.proFlow }],
      parent: this.injector
    });
    return obj;
  }

  getAlertError(msg: string, timer = 1000, showConfirmButton = false) {
    this.loadingServiceService.activateLoading(false);
    Swal.fire({
      title: '¡Error!',
      text: msg,
      icon: 'error',
      showConfirmButton: showConfirmButton,
      timer: timer
    }).then();
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }
}
