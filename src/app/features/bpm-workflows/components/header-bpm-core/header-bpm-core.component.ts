import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Observable, ReplaySubject } from 'rxjs';
import { BpmCoreService } from '@shared/services';
import {
  CONSTANT_NAME_RETURN,
  NAME_FILED,
  NAME_VERSION
} from '@shared/constants';
import {
  LIST_COMPONENT_ACTIVE_MASIVE_EXCEL,
  MODAL_MEDIUM,
  MODAL_SMALL,
  MODAL_SMALL_XS,
  TYPE_BUTTON_EIGHT,
  TYPE_BUTTON_SEVEN
} from '@shared/constants';
import { ProTaskE } from '@shared/interfaces';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DocumentTableComponent } from 'src/app/features/bpm-workflows/components/document-table/document-table.component';
import { CommentsComponent } from '@features/bpm-workflows/components/comments/comments.component';
import { ComponentTemplate } from '@shared/interfaces';
import { TypeButtonAlfaMain } from '@shared/interfaces';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main.service';import { AttachmentExcelMassiveComponent } from '@features/bpm-workflows/components/alfa-main/attachment-excel-massive/attachment-excel-massive.component';
import { TasksPanelService } from '@features/bpm-workflows/services/tasks-panel.service';
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { LoaderComponent } from '@shared/ui/loader/loader.component';
@Component({
  selector: 'vex-header-bpm-core',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    VexBreadcrumbsComponent,
    AsyncPipe,
    MatButtonModule,
    LoaderComponent
  ],
  templateUrl: './header-bpm-core.component.html',
  styleUrl: './header-bpm-core.component.scss'
})
export class HeaderBpmCoreComponent implements OnInit, OnDestroy, OnChanges {
  crumbs: string[] = [];
  actions: Record<string, () => void> = {};
  existButtonAlfaMain = false;

  isExcelDownloadLoading = signal<boolean>(false);

  @Input() public icon = '';
  @Input({ required: true }) executionId = '';
  @Input({ required: true }) proTaskE: ProTaskE | null = null;
  @Input({ required: true }) components: ComponentTemplate[] | null = [];
  @Input({ required: true }) public resources: string[] = [];
  @Input({ required: false }) public mode = 1;
  @Output() returnPanelTask = new EventEmitter<boolean>();

  _countComment$: ReplaySubject<number> = new ReplaySubject<number>(0);
  _countAttachment$: ReplaySubject<number> = new ReplaySubject<number>(0);
  _components$: ReplaySubject<ComponentTemplate[]> = new ReplaySubject<
    ComponentTemplate[]
  >(1);

  countComment$: Observable<number> = this._countComment$.asObservable();
  countAttachment$: Observable<number> = this._countAttachment$.asObservable();
  _crumbs$: ReplaySubject<ProTaskE> = new ReplaySubject<ProTaskE>(0);
  crumbs$: Observable<ProTaskE> = this._crumbs$.asObservable();
  components$: Observable<ComponentTemplate[]> =
    this._components$.asObservable();

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private alfaMainService: AlfaMainService,
    private bpmCoreService: BpmCoreService,
    private tasksPanelService: TasksPanelService,
    private dialog: MatDialog
  ) {
    this.destroyRef.onDestroy(() => {
      // Component cleanup logic if needed
    });
  }

  ngOnInit(): void {
    if (!this.executionId || this.executionId?.length <= 0 || !this.proTaskE) {
      return;
    }

    this.getInformationProTaskCountComment();
    this.getInformationProTaskCountAttachment();

    this.crumbs$
      .pipe(filter<ProTaskE>(Boolean))
      .subscribe((result: ProTaskE) => {
        this.chargerCrumbs(result);
      });

    this.components$
      .pipe(filter<ComponentTemplate[]>(Boolean))
      .subscribe((components: ComponentTemplate[] | null) => {
        if (!components || components?.length > 0) {
          this.validateComponents(components);
          return;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['proTaskE'] && this.proTaskE) {
      this._crumbs$.next(this.proTaskE);
      this.chargerCrumbs(this.proTaskE);
    }

    if (
      changes['components'] &&
      this.components &&
      this.components.length > 0
    ) {
      this._components$.next(this.components);
    }
  }

  chargerCrumbs(proTaskE: ProTaskE) {
    this.crumbs = [];
    if (proTaskE.proTask?.flowDetail && proTaskE?.proTask?.flowName) {
      const flowDetailTtitle = `${NAME_FILED}: ${proTaskE.proTask?.flowDetail}`;
      this.crumbs.push(flowDetailTtitle);
      this.actions[flowDetailTtitle] = () =>
        this.openDialogDetailProcedure(proTaskE.executionId!);
    }
    if (proTaskE?.executionId) {
      const executionIdTtitle = `${NAME_VERSION}: ${proTaskE?.executionId}`;
      this.crumbs.push(executionIdTtitle);
    }
    if (proTaskE?.proTask?.flowName) {
      this.crumbs.push(proTaskE?.proTask?.flowName);
    }
  }

  openDialogDetailProcedure(taskId: number) {
    this.tasksPanelService.viewTaskId(`${taskId}`).subscribe({
      next: (result) => {
        this.dialog.open(DetailInformationTasksComponent, {
          ...MODAL_SMALL,
          data: {
            taskId,
            value: result
          }
        });
      }
    });
  }

  validateComponents(components: ComponentTemplate[] | null) {
    if (components != null && components?.length > 0) {
      //validate Component in alfaMain
      const listTmp: ComponentTemplate[] = components.filter(
        (x: ComponentTemplate) =>
          x.pathForm != null &&
          LIST_COMPONENT_ACTIVE_MASIVE_EXCEL.includes(x.pathForm)
      );
      this.existButtonAlfaMain = listTmp !== null && listTmp?.length > 0;
    }
  }

  getInformationProTaskCountComment() {
    this.bpmCoreService
      .getProTaskCountComment(this.executionId)
      .subscribe((result: number) => this._countComment$.next(result));
  }

  getInformationProTaskCountAttachment() {
    this.bpmCoreService
      .getProTaskCountAttachment(this.executionId)
      .subscribe((result: number) => this._countAttachment$.next(result));
  }

  openDialog(type: string): void {
    if (type === 'documents') {
      this.dialog.open(DocumentTableComponent, {
        ...MODAL_MEDIUM,
        data: {
          executionId: this.proTaskE!.executionId
        }
      });
    } else if (type === 'comments') {
      this.dialog.open(CommentsComponent, {
        ...MODAL_SMALL,
        data: {
          executionId: this.proTaskE?.executionId
        }
      });
    }
  }

  openDialogExcel(type: TypeButtonAlfaMain): void {
    if (type === 'EXD') {
      this.getInformationExcelDownload();
    } else if (type === 'EXL') {
      this.chargerInformationExcelMassive();
    }
  }

  getInformationExcelDownload() {
    this.isExcelDownloadLoading.set(true);
    this.alfaMainService.getGenerateExcelMassive(this.executionId);
    // Simular un tiempo de descarga para el feedback visual
    setTimeout(() => {
      this.isExcelDownloadLoading.set(false);
    }, 2000);
  }

  chargerInformationExcelMassive() {
    this.dialog
      .open(AttachmentExcelMassiveComponent, {
        ...MODAL_SMALL_XS,
        disableClose: true,
        data: this.proTaskE?.executionId
      })
      .afterClosed()
      .subscribe((res: boolean) => {
        if (res) {
          this.alfaMainService.refresh();
        }
      });
  }

  get downLoadExcelButton(): boolean {
    return (
      !this.resources.includes(TYPE_BUTTON_SEVEN) && this.existButtonAlfaMain
    );
  }

  get addExcelButton(): boolean {
    return (
      !this.resources.includes(TYPE_BUTTON_EIGHT) && this.existButtonAlfaMain
    );
  }

  ngOnDestroy(): void {
    if (this._countComment$) {
      this._countComment$.unsubscribe();
    }
    if (this._countAttachment$) {
      this._countAttachment$.unsubscribe();
    }
    if (this._crumbs$) {
      this._crumbs$.unsubscribe();
    }
    if (this._components$) {
      this._components$.unsubscribe();
    }
  }

  protected readonly CONSTANT_NAME_RETURN = CONSTANT_NAME_RETURN;
  protected readonly TYPE_BUTTON_SEVEN = TYPE_BUTTON_SEVEN;
  protected readonly TYPE_BUTTON_EIGHT = TYPE_BUTTON_EIGHT;
}
