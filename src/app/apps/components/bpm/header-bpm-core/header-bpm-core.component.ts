import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GeneralValidationsService } from '../../../services/validations/general-validations.service';
import { Observable, ReplaySubject } from 'rxjs';
import { BpmCoreService } from '../../../services/bpm/bpm-core.service';
import { CONSTANT_NAME_RETURN } from '../../../constants/constantLabels';
import { ProTaskE } from '../../../interfaces/pro-task-e';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DocumentTableComponent } from '../document-table/document-table.component';

@Component({
  selector: 'vex-header-bpm-core',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    VexBreadcrumbsComponent,
    AsyncPipe,
    MatButtonModule,
  ],
  templateUrl: './header-bpm-core.component.html',
  styleUrl: './header-bpm-core.component.scss'
})
export class HeaderBpmCoreComponent implements OnInit, OnChanges {
  crumbs: string[] = [];

  @Input() public idHeader: string = '';
  @Input() public icon: string = '';
  @Input({ required: true }) id: string = '';
  @Input({ required: true }) proTaskE: ProTaskE | null = null;
  @Output() returnPanelTask = new EventEmitter<boolean>();

  _countComment$: ReplaySubject<number> = new ReplaySubject<number>(0);
  _countAttachment$: ReplaySubject<number> = new ReplaySubject<number>(0);
  countComment$: Observable<number> = this._countComment$.asObservable();
  countAttachment$: Observable<number> = this._countAttachment$.asObservable();
  _crumbs$: ReplaySubject<ProTaskE> = new ReplaySubject<ProTaskE>(0);
  crumbs$: Observable<ProTaskE> = this._crumbs$.asObservable();

  constructor(
    private validations: GeneralValidationsService,
    private bpmCoreService: BpmCoreService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    if (!this.id || this.id?.length <= 0 || !this.proTaskE) {
      return;
    }

    if (this.idHeader?.length > 0) {
      this.idHeader = this.idHeader + this.getRandomInt(10000);
    } else {
      this.idHeader = this.getRandomInt(10000) + `${this.proTaskE?.executionId}` + `${this.proTaskE?.flowId}`;
    }

    this.getInformationProTaskCountComment();
    this.getInformationProTaskCountAttachment();

    this.crumbs$
      .pipe(filter<ProTaskE>(Boolean))
      .subscribe((result: ProTaskE) => {
        this.chargerCrumbs(result);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["proTaskE"] && this.proTaskE) {
      this._crumbs$.next(this.proTaskE);
    }
  }

  chargerCrumbs(proTaskE: ProTaskE){
    this.crumbs = [];
    if(proTaskE.proTask?.flowDetail && proTaskE?.proTask?.flowName){
      this.crumbs.push(proTaskE.proTask?.flowDetail)
    }
    if(proTaskE?.proTask?.flowName){
      this.crumbs.push(proTaskE?.proTask?.flowName)
    }
  }

  getInformationProTaskCountComment() {
    this.bpmCoreService.getProTaskCountComment(this.id)
      .subscribe((result: number) => this._countComment$.next(result));
  }

  getInformationProTaskCountAttachment() {
    this.bpmCoreService.getProTaskCountAttachment(this.id)
      .subscribe((result: number) => this._countAttachment$.next(result));
  }


  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  protected readonly CONSTANT_NAME_RETURN = CONSTANT_NAME_RETURN;

  openDialog(type: string): void {
    if (type === 'documents') {
      this.dialog.open(DocumentTableComponent, {
        width: '60%',
        data: {
          executionId: this.proTaskE?.executionId
        }
      })
    }
  }
}
