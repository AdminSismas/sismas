import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, map } from 'rxjs';
import { IBmpTaskService, IBmpFlowService } from '../interfaces/bmp-workflow.interfaces';
import { BmpTaskService } from './bmp-task.service';
import { BmpFlowService } from './bmp-flow.service';
import { ProTaskE } from '../models/pro-task';
import { ProFlow } from '../models/pro-flow';

export interface WorkflowSummary {
  task: ProTaskE;
  flow: ProFlow;
  commentCount: number;
  attachmentCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BmpWorkflowFacadeService {
  private proTaskSubject = new ReplaySubject<ProTaskE>(1);
  proTask$ = this.proTaskSubject.asObservable();

  constructor(
    private taskService: IBmpTaskService & BmpTaskService,
    private flowService: IBmpFlowService & BmpFlowService
  ) {}

  /**
   * Get complete workflow summary with task, flow and counts
   */
  getWorkflowSummary(executionId: string): Observable<WorkflowSummary> {
    const task$ = this.taskService.getPreviewOperation(executionId);
    const flow$ = this.flowService.getProFlowProExecution(executionId);
    const commentCount$ = this.taskService.getProTaskCountComment(executionId);
    const attachmentCount$ = this.taskService.getProTaskCountAttachment(executionId);

    return combineLatest([task$, flow$, commentCount$, attachmentCount$]).pipe(
      map(([task, flow, commentCount, attachmentCount]) => ({
        task,
        flow,
        commentCount,
        attachmentCount
      }))
    );
  }

  /**
   * Process next operation with validation
   */
  processNextOperation(executionId: string, answer: boolean): Observable<ProTaskE> {
    return this.taskService.getNextOperation(executionId, answer).pipe(
      map(task => {
        this.proTaskSubject.next(task);
        return task;
      })
    );
  }

  /**
   * Get task preview with flow context
   */
  getTaskWithFlow(executionId: string): Observable<{ task: ProTaskE; flow: ProFlow }> {
    const task$ = this.taskService.getPreviewOperation(executionId);
    const flow$ = this.flowService.getProFlowProExecution(executionId);

    return combineLatest([task$, flow$]).pipe(
      map(([task, flow]) => ({ task, flow }))
    );
  }

  /**
   * Get task metrics (comments and attachments)
   */
  getTaskMetrics(taskId: string): Observable<{ comments: number; attachments: number }> {
    const commentCount$ = this.taskService.getProTaskCountComment(taskId);
    const attachmentCount$ = this.taskService.getProTaskCountAttachment(taskId);

    return combineLatest([commentCount$, attachmentCount$]).pipe(
      map(([comments, attachments]) => ({ comments, attachments }))
    );
  }

  /**
   * Update current task in subject
   */
  updateCurrentTask(task: ProTaskE): void {
    this.proTaskSubject.next(task);
  }
}