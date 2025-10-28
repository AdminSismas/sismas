import { Injectable, signal } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { BpmTaskService } from '@features/bpm-workflows/interfaces';
import { BpmFlowService } from '@features/bpm-workflows/interfaces';
import { ProTaskE } from '@features/bpm-workflows/interfaces';
import { ProFlow } from '@features/bpm-workflows/interfaces';

export interface WorkflowSummary {
  task: ProTaskE;
  flow: ProFlow;
  commentCount: number;
  attachmentCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BpmWorkflowFacadeService {
  private proTaskSubject = signal<ProTaskE | null>(null);
  proTask$ = toObservable(this.proTaskSubject);

  constructor(
    private taskService: BpmTaskService,
    private flowService: BpmFlowService
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
        this.proTaskSubject.set(task);
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
    this.proTaskSubject.set(task);
  }
}
