import { Component, inject, Injector, OnInit } from '@angular/core';
import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
  NgFor,
  NgIf
} from '@angular/common';
import { LoadingAppComponent } from '../../../../apps/components/general-components/loading-app/loading-app.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { firstValueFrom, Observable, of, ReplaySubject } from 'rxjs';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, take } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';
import { FluidHeightDirective } from '../../../../apps/directives/fluid-height.directive';
import { HeaderBpmCoreComponent } from '../../../../apps/components/bpm/header-bpm-core/header-bpm-core.component';
import {
  CONSTANT_VALIDATE_CHECK,
  CONSTANT_VALIDATE_OTHER,
  LISTO_FORM_BPM_CORE,
  MODAL_SMALL
} from '../../../../apps/constants/general/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralValidationsService } from '../../../../apps/services/validations/general-validations.service';
import {
  BasicComponentTemplate,
  ComponentTemplate
} from '../../../../apps/interfaces/bpm/render-template.types';
import { ProFlow } from '../../../../apps/interfaces/bpm/pro-flow';
import { BpmCoreService } from '../../../../apps/services/bpm/bpm-core.service';
import { ProTaskE } from '../../../../apps/interfaces/bpm/pro-task-e';
import { MatOptionModule } from '@angular/material/core';
import { DynamicComponentsService } from '../../../../apps/services/bpm/dynamic-components.service';
import { CONSTANT_NAME_ID } from '../../../../apps/constants/general/constantLabels';
import { environment } from '../../../../../environments/environments';
import { SendInfoGeneralService } from '../../../../apps/services/general/send-info-general.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ShowErrorValidateAlfaMainComponent
} from '../../../../apps/components/bpm/show-error-validate-alfa-main/show-error-validate-alfa-main.component';
import { HttpErrorResponse } from '@angular/common/http';
import { BpmProcessService, PermissionVailable } from 'src/app/apps/services/bpm/bpm-process.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

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
    NgFor,
    NgIf,
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
    LoadingAppComponent
  ],
  templateUrl: './bmp-core.component.html',
  styleUrl: './bmp-core.component.scss'
})
export class BmpCoreComponent implements OnInit {
  private listComponents = inject(
    DynamicComponentsService
  ).getDynamicComponents();
  private readonly injector = inject(Injector);

  _infoProTaskE$: Observable<ProTaskE> = this.infoGeneralService.infoProTaskE$;
  _infoFatherURL$: Observable<string> = this.infoGeneralService.infoFatherURL$;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  isExistDataInformations$: Observable<boolean> = of(false);
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


  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private validations: GeneralValidationsService,
    private router: Router,
    private readonly layoutService: VexLayoutService,
    private snackbar: MatSnackBar,
    private bpmCoreService: BpmCoreService,
    private infoGeneralService: SendInfoGeneralService,
    private bpmProcessService: BpmProcessService
  ) {
  }

  async ngOnInit() {
    this.activateLoading();
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
    this.activateLoading(true);
  }

  confirmAction(action: () => void, message: string, errors: string[]): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: errors.length > 0 ? '40%' : '400px',
      data: { message, errors },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        action();
      }
    });
  }


  onAccept(): void {
    const message = '¿Está seguro que desea continuar a la siguiente tarea?';

    this.bpmCoreService.checkStatusBpmOperation(this.executionId)
      .subscribe((result) => {
        if (result.length > 0) {
          this.confirmAction(() => this.nextBpmCore(), message, result);
          return;
        }

        this.confirmAction(() => this.nextBpmCore(), message, []);
        return;
      });
  }

  onReject(): void {
    this.confirmAction(() => this.previewBpmCore(), '¿Está seguro que desea rechazar la tarea?', []);
  }

  refreshComponentsDynamic(proFlow: ProFlow) {
    if (!proFlow || !proFlow.preform || !proFlow.preform.pathForm) {
      this.activateSnapError(
        'Error valor inválido, no es posible continuar',
        3000
      );
      return;
    }
    const pathForm = proFlow.preform.pathForm;
    const components: BasicComponentTemplate[] = LISTO_FORM_BPM_CORE.filter(
      (x) => x.pathForm.includes(pathForm)
    );
    const listComponents: ComponentTemplate[] = [];
    if (components?.length > 0) {
      components.forEach((component: BasicComponentTemplate) => {
        const listTmp: ComponentTemplate[] = this.listComponents
          .filter((x: ComponentTemplate) =>
            x.nameComponent.includes(component.name)
          );

        if (listTmp?.length > 0) {
          listTmp.forEach((x) => this.createObjectComponent(x, component));
          listComponents.push(...listTmp);
        }

      });
      this._components$.next(listComponents);
      this.activateLoading(true);
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
      this.activateSnapError('Error valor inválido, no es posible continuar');
      return false;
    }
    return true;
  }

  returnPanelTask(isReturn: boolean) {
    if (isReturn) {
      this.router
        .navigate([`${environment.myWork_tasksPanel}${this.infoFatherURL}`])
        .then();
    }
  }

  nextBpmCore() {
    this.activateLoading();
    if (this.proFlow) {
      const pathForm = this.proFlow?.preform?.pathForm;
      if (!pathForm) {
        return;
      }
      const components: BasicComponentTemplate[] = LISTO_FORM_BPM_CORE.filter(
        (x) => x.pathForm.includes(pathForm)
      );

      let serviceValidation = '';
      if (components.length >= 1) {
        serviceValidation = components[0].serviceValidation;
      }

      if (!serviceValidation) {
        this.executeBpmNextBpmCore();
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

  checkStatusBpmOperation() {
    this.bpmCoreService.checkStatusBpmOperation(this.executionId).subscribe({
      error: () => {
        this.activateLoading(true);
        this.activateSnapError(
          'Error ejecutando servicio validación de alfa main o validate main, no es posible continuar',
          3000
        );
      },
      next: (result: string[]) => {
        if (!result || result.length <= 0) {
          this.executeBpmNextBpmCore();
          return;
        }

        this.dialog.open(ShowErrorValidateAlfaMainComponent, {
          ...MODAL_SMALL,
          data: result
        });
        this.activateLoading(true);
      }
    });
  }

  executeBpmNextBpmCore() {
    this.bpmCoreService.getNextOperation(this.executionId).subscribe({
      error: (error: HttpErrorResponse) => this.captureInformationSubscribeError(error),
      next: (result: ProTaskE) => this.captureInformationBpmCore(result)
    });
  }

  previewBpmCore() {
    this.activateLoading();
    this.bpmCoreService.getPreviewOperation(this.executionId).subscribe({
      error: (error: HttpErrorResponse) => this.captureInformationSubscribeError(error),
      next: (result: ProTaskE) => this.captureInformationBpmCore(result)
    });
  }

  captureInformationBpmCore(result: ProTaskE) {
    if (result?.proTask) {
      if (result.proTask.taskId! < 0) {
        const vailablePermission: PermissionVailable = {
          executionId: result.executionId?.toString() || '',
          message: result?.proTask?.flowName || ''
        };
        this.router.navigate([environment.myWork_tasksPanel], {
          queryParams: { executionId: result.executionId }
        });
        this.snackbar.open(result.proTask!.flowName!, 'Aceptar', { duration: 10000 });
        this.bpmProcessService.setPermissions(vailablePermission);
        return;
      }
    }


    this.proTaskE_Bpm = result;
    this.executionId = result.executionId?.toString() || '';
    this.getNewProFlow(result.flowId!.toString());
    this.infoGeneralService.setInfoProTaskE(result);
    this.activateLoading(true);
  }

  getNewProFlow(flowId: string) {
    this.bpmCoreService.getProFlow(flowId).subscribe((result: ProFlow) => {
      const isValid: boolean = this.validateInformationComponent(result);
      if (isValid) {
        this.refreshComponentsDynamic(result);
      }
    });
  }

  captureInformationSubscribeError(error: HttpErrorResponse): void {
    if (error.status === 400) {
      this.activateLoading(true);
      this.snackbar.open(error.error, 'Aceptar', { duration: 10000 });
      this.router.navigate([environment.myWork_tasksPanel]);
    }
    this.activateLoading(true);
    this.activateSnapError(
      'Error ejecutando servicio de continuar flujo Bpm o retroceder, no es posible continuar',
      3000
    );
    return;
  }

  createObjectComponent(
    obj: ComponentTemplate,
    component: BasicComponentTemplate
  ) {
    obj.nameComponent = component.name;
    obj.inputs = { executionId: this.executionId, resources: this.resources };
    this.proFlow.mode = component.mode;
    obj.componentData = Injector.create({
      providers: [{ provide: ProFlow, useValue: this.proFlow }],
      parent: this.injector
    });
    return obj;
  }

  activateLoading(value = false) {
    const valid = of(value);
    this.isExistDataInformations$ = valid.pipe(take(3));
  }

  activateSnapError(msg: string, timer = 1000) {
    this.snackbar.open(msg, '', { duration: timer });
    this.activateLoading(true);
  }

  private returnURLPrevious(url: string) {
    this.router.navigate([`${url}`]).then();
  }
}
