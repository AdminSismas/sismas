import { Observable } from 'rxjs';
import { ProTaskE, ProFlow, ProExecutionE, DifferenceChanges, MetadataBpm } from '@shared/interfaces';

/**
 * Interface for BPM Task operations
 */
export interface IBmpTaskService {
  getProTaskCountComment(id: string): Observable<number>;
  getProTaskCountAttachment(id: string): Observable<number>;
  getNextOperation(executionId: string, answer: boolean): Observable<ProTaskE>;
  getPreviewOperation(executionId: string): Observable<ProTaskE>;
}

/**
 * Interface for BPM Flow operations
 */
export interface IBmpFlowService {
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