import { Observable } from 'rxjs';
import { ProExecutionE } from '@features/bpm-workflows/models/pro-execution-e';
import { ProTaskE, MetadataBpm } from '@features/tasks/models';
import { ProFlow } from '@features/bpm-workflows/models/pro-flow';
import { DifferenceChanges } from '@features/bpm-workflows/models/difference-changes';

/**
 * Interface for BPM Task operations
 */
export interface IBpmTaskService {
  getProTaskCountComment(id: string): Observable<number>;
  getProTaskCountAttachment(id: string): Observable<number>;
  getNextOperation(executionId: string, answer: boolean): Observable<ProTaskE>;
  getPreviewOperation(executionId: string): Observable<ProTaskE>;
}

/**
 * Interface for BPM Flow operations
 */
export interface IBpmFlowService {
  getProFlow(flowId: string): Observable<ProFlow>;
  getProFlowProExecution(executionId: string): Observable<ProFlow>;
}

/**
 * Interface for BPM Execution operations
 */
export interface IBmpExecutionService {
  getProExecution(executionId: string): Observable<ProExecutionE>;
  getDifferenceChanges(executionId: string): Observable<DifferenceChanges[]>;
}

/**
 * Interface for BPM Metadata operations
 */
export interface IBmpMetadataService {
  getMetadata(executionId: string): Observable<MetadataBpm>;
  updateMetadata(executionId: string, metadata: MetadataBpm): Observable<void>;
}
