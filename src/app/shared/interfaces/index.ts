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

// Document management interfaces
export * from '../../apps/interfaces/document-management/attachment.model';

// Forms interfaces
export * from '../../apps/interfaces/forms/dynamic-forms';

// User interfaces
export * from '../../apps/interfaces/users/digitalized-signatures';

// Information property interfaces
export * from '../../apps/interfaces/information-property/baunit-head.model';
export * from '../../apps/interfaces/information-property/baunit-head-percentage.model';
export * from '../../apps/interfaces/information-property/basic-information-property';
export * from '../../apps/interfaces/information-property/info-person';
export * from '../../apps/interfaces/information-property/info-owners';
export * from '../../apps/interfaces/information-property/basic-information-address';
export * from '../../apps/interfaces/information-property/detail-basic-information-address';
export * from '../../apps/interfaces/information-property/information-adjacent';

// Baunit ICA interfaces
export * from '../../apps/components/information-property/baunit-ica/interfaces/baunit-ica.interface';
export * from '../../apps/components/information-property/baunit-ica/interfaces/ica-table';

// BMP interfaces
export * from '../../apps/interfaces/bpm/citation-and-notice/info-participants.interface';
export * from '../../apps/interfaces/bpm/difference-changes';
// Process participant interface - temporarily commented due to circular dependency
// export * from '../../apps/interfaces/bpmprocess-participant';

// Territorial organization interfaces
export * from '../../apps/interfaces/territorial-organization';

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
