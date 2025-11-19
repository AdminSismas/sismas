// Barrel export for BPM Workflows models
// This file exports all interfaces and models for easy importing
// Note: Some exports are explicit to avoid naming conflicts

export * from './bpm-document';
export * from './bpm-type-process';
export * from './cadastral-change-log';
export * from './change-control';
export * from './citation-and-notice/info-participants.interface';
export * from './data-alfa-main.model';
export * from './difference-changes';
export * from './governmental-channel';
export * from './granted-authority';
export * from './individual';
export * from './operation-content-information';
export * from './pro-execution-e';
export * from './pro-flow';
export * from './process-participant';

// Explicit export to avoid GrantedAuthority conflict
export type { ProcessUser } from './process-user';

export * from './recognitionProperty.interface';
export * from './render-template.types';
export * from './table-procedure-response.model';

export * from './workflow.model';

// Comments and Document Management
export * from './comments/comments.model';
export * from './document-management/attachment.model';
export * from './document-management/view-certificate-management-data.interface';
