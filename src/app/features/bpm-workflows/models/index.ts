// Barrel export for BPM Workflows models
// This file exports all interfaces and models for easy importing
// Note: Some exports are explicit to avoid naming conflicts

export * from './bpm-document';
export * from './bpm-type-process';
export * from './cadastral-change-log';
export * from './change-control';
export * from './changes-property-owner';
export * from './citation-and-notice/info-participants.interface';
export * from './data-alfa-main.model';
export * from './difference-changes';
export * from './governmental-channel';
export * from './granted-authority';
export * from './individual';
export * from './metadata-bpm';
export * from './operation';
export * from './operation-content-information';
export * from './pre-form';
export * from './pro-execution-e';
export * from './pro-flow';
export * from './pro-task';
export * from './pro-task-e';
export * from './process-participant';

// Explicit export to avoid GrantedAuthority conflict
export type { ProcessUser } from './process-user';

export * from './recognitionProperty.interface';
export * from './render-template.types';
export * from './table-procedure-response.model';

// Explicit exports to avoid ProcessModel conflict
export { TaskResponseModel, ProcessModel } from './task-response.model';
export { TaskRetailExecuteResponseModel } from './task-retail-execute-response.model';

export * from './workflow.model';