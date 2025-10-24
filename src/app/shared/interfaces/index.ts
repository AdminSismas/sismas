// Shared interfaces barrel exports - TEMPORAL ROLLBACK
// Comentando todas las exportaciones problemáticas hasta identificar rutas correctas

// Interfaces verificadas que existen
export * from '../../apps/interfaces/general/information-pegeable.model';
export * from '../../apps/interfaces/general/page-comments-data.model';
export * from '../../apps/interfaces/general/content-info-comments.model';
export * from '../../apps/interfaces/general/content-info-attachment.model';
export * from '../../apps/interfaces/general/page-sortBy-data.model';
export * from '../../apps/interfaces/general/domain-name.model';
export * from '../../apps/interfaces/general/content-info';
export * from '../../apps/interfaces/general/content-info-schema';
export * from '../../apps/interfaces/general/pegeable.model';
export * from '../../apps/interfaces/general/page-search-data.model';
export * from '../../apps/interfaces/general/search-data.model';
export * from '../../apps/interfaces/general/out-format.model';
export * from '../../apps/interfaces/general/content-info-procedures.model';
export * from '../../apps/interfaces/general/page-procedures-data.model';
export * from '../../apps/interfaces/tables/procedures-progress.model';

// Document management interfaces
export * from '../../apps/interfaces/document-management/attachment.model';

// Forms interfaces
export * from '../../apps/interfaces/forms/dynamic-forms';

// User interfaces
export * from '../../apps/interfaces/users/digitalized-signatures';
export * from '../../shared/models/user.model';
// Information property interfaces
export * from '../../apps/interfaces/information-property/baunit-head.model';
export * from '../../apps/interfaces/information-property/baunit-head-percentage.model';
export * from '../../apps/interfaces/information-property/basic-information-property';
export * from '../../apps/interfaces/information-property/info-person';
export * from '../../apps/interfaces/information-property/info-owners';
export * from '../../apps/interfaces/information-property/basic-information-address';
export * from '../../apps/interfaces/information-property/detail-basic-information-address';
export * from '../../apps/interfaces/information-property/information-adjacent';
export * from '../../apps/interfaces/information-property/cc-calificacion-ub';
export * from '../../apps/interfaces/information-property/content-information-construction';
export * from '../../apps/interfaces/information-property/info-appraisal';
export * from '../../apps/interfaces/information-property/zone-baunit';
export * from '../../apps/interfaces/information-property/national-predial-number';

// Baunit ICA interfaces
export * from '../../apps/components/information-property/baunit-ica/interfaces/baunit-ica.interface';
export * from '../../apps/components/information-property/baunit-ica/interfaces/ica-table';

// BMP interfaces
export * from '../../apps/interfaces/bpm/citation-and-notice/info-participants.interface';
export * from '../../apps/interfaces/bpm/difference-changes';
export * from '../../apps/interfaces/bpm/pro-task';
export * from '../../apps/interfaces/bpm/pro-task-e';
export * from '../../apps/interfaces/bpm/pro-flow';
export * from '../../apps/interfaces/bpm/pre-form';
export * from '../../apps/interfaces/bpm/recognitionProperty.interface';
export * from '../../apps/interfaces/bpm/task-response.model';
export * from '../../apps/interfaces/bpm/workflow.model';
export * from '../../apps/interfaces/general/content-info-workflow.model';
export * from '../../apps/interfaces/bpm/render-template.types';
export * from '../../apps/interfaces/bpm/operation';
export * from '../../apps/interfaces/general/modal-size.interface';
export * from '../../apps/interfaces/information-property/snr-folio-info';
export * from '../../apps/interfaces/information-property/snr-source-info';
export * from '../../apps/interfaces/information-property/administrative-source';
export * from '../../apps/interfaces/information-property/alerts.interface';
export * from '../../apps/interfaces/users/user';
export * from '../../apps/interfaces/bpm/pro-execution-e';
export * from '../../apps/interfaces/bpm/metadata-bpm';
export * from '../../apps/interfaces/bpm/governmental-channel';
export * from '../../apps/interfaces/bpm/data-alfa-main.model';
export * from '../../apps/interfaces/bpm/process-participant';
export * from '../../apps/interfaces/information-property/snr-person-info';
export * from '../../apps/interfaces/information-property/basic-detail-group';
export * from '../../apps/interfaces/information-property/info-contact';
export * from '../../apps/interfaces/information-property/geo-economic-zone';
export * from '../../apps/interfaces/bpm/change-control';
export * from '../../apps/interfaces/bpm/table-procedure-response.model';
export * from '../../apps/interfaces/bpm/bpm-type-process';
export * from '../../apps/interfaces/information-property/basic-master-group';
export * from '../../apps/interfaces/bpm/changes-property-owner';
export * from '../../apps/interfaces/comments/comments.model';
export * from '../../apps/interfaces/economic-mod-land/zone-description';
export * from '../../apps/interfaces/general/content-info-domainLadmCol.model';
export * from '../../apps/interfaces/general/simple-response.interface';
export * from '../../apps/interfaces/information-property/baunit-npnlike';
export * from '../../apps/interfaces/information-property/rural-physical-zone';
export * from '../../apps/interfaces/information-property/urban-physical-zone';
export * from '../../apps/interfaces/information-property/types-qualification-ub';
// Exportación específica para evitar conflicto ProcessModel
export { TaskRetailExecuteResponseModel } from '../../apps/interfaces/bpm/task-retail-execute-response.model';
// Process participant interface - temporarily commented due to circular dependency
// export * from '../../apps/interfaces/bpmprocess-participant';

// Territorial organization interfaces
export { Zone as TerritorialZone } from '../../apps/interfaces/territorial-organization/zone.model';
export * from '../../apps/interfaces/territorial-organization/department.model';
export * from '../../apps/interfaces/territorial-organization/sector.model';
export * from '../../apps/interfaces/territorial-organization/municipality.model';
export * from '../../apps/interfaces/territorial-organization/block.model';
export * from '../../apps/interfaces/territorial-organization/neighborhood.model';
export * from '../../apps/interfaces/territorial-organization/sidewalk.model';
export * from '../../apps/interfaces/territorial-organization/commune.model';
export * from '../../apps/interfaces/territorial-organization/township.model';

// Operation support interfaces
export * from '../../apps/interfaces/operation-support/reports/report-category.interface';
export * from '../../apps/interfaces/operation-support/reports/report.interface';

// Geographic interfaces
export * from '../../apps/interfaces/geographics/query-parameters-geographic-vie';

// Paginator interface que existe
export * from '../../apps/interfaces/paginator/PaginatorIntlEs';

// People interface
export * from '../../apps/interfaces/users/people.model';

// TODO: Verificar y corregir estas rutas
// export * from '../../apps/interfaces/bpmprotask.interface';
// export * from '../../apps/interfaces/bpmproFlow.interface';
// export * from '../../apps/interfaces/bpmcontent-info.interface';
// export * from '../../apps/interfaces/general/collection-domain.interface';
// export * from '../../apps/interfaces/general/info-person.interface';
// export * from '../../apps/interfaces/general/input-type.interface';
// export * from '../../apps/interfaces/general/pegeable.interface';
// export * from '../../apps/interfaces/general/page-sort-by-data.interface';
// export * from '../../apps/interfaces/forms/json-input.interface';
// export * from '../../apps/interfaces/general/component-template.interface';
// export * from '../../apps/interfaces/general/type-button-alfa-main.interface';
