import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommentsComponent } from 'src/app/apps/components/bpm/comments/comments.component';
import { DocumentTableComponent } from 'src/app/apps/components/bpm/document-table/document-table.component';
import {
  MODAL_MEDIUM,
  NAME_NO_DISPONIBLE
} from 'src/app/apps/constants/general/constants';
import { BpmCoreService } from 'src/app/apps/services/bpm/bpm-core.service';
import { DetailInformationData } from '../detail-information-tasks/detail-information-tasks.component';

@Component({
  selector: 'details-header',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './details-header.component.html'
})
export class DetailsHeaderComponent implements OnInit {
  /* ---- Properties ---- */
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  /* ---- Injects ---- */
  dialog = inject(MatDialog);
  bpmCoreService = inject(BpmCoreService);

  /* ---- Inputs ---- */
  assignedSee = input.required<string>();
  detailInformationData = input.required<DetailInformationData>();

  /* ---- Signals ---- */
  countComment = signal<number>(0);
  countAttachment = signal<number>(0);
  executionId = signal<string | null>(null);

  /* ---- LifeCycle ---- */
  ngOnInit(): void {
    this.executionId.set(`${this.detailInformationData()?.taskId}` || null);
    this.getInformationProTaskCountComment();
    this.getInformationProTaskCountAttachment();
  }

  /* ---- Methods ---- */
  openDialog(type: string): void {
    if (!this.executionId())
      return;
    if (type === 'documents') {
      this.dialog.open(DocumentTableComponent, {
        ...MODAL_MEDIUM,
        data: {
          executionId: this.executionId()!
        }
      });
    } else if (type === 'comments') {
      this.dialog.open(CommentsComponent, {
        ...MODAL_MEDIUM,
        data: {
          executionId: this.executionId()!
        }
      });
    }
  }

  getInformationProTaskCountComment() {
    if (!this.executionId()) {
      this.countComment.set(0);
      return;
    }

    this.bpmCoreService
      .getProTaskCountComment(this.executionId()!)
      .subscribe((result: number) => this.countComment.set(result));
  }

  getInformationProTaskCountAttachment() {
    if (!this.executionId()) {
      this.countAttachment.set(0);
      return;
    }

    this.bpmCoreService
      .getProTaskCountAttachment(this.executionId()!)
      .subscribe((result: number) => this.countAttachment.set(result));
  }
}
