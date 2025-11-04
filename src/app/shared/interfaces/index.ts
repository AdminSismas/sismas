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
export * from '../../apps/interfaces/general/pegeable.model';
export * from '../../apps/interfaces/general/page-search-data.model';
export * from '../../apps/interfaces/general/search-data.model';
export * from '../../apps/interfaces/general/out-format.model';
export * from '../../apps/interfaces/general/content-info-procedures.model';
export * from '../../apps/interfaces/general/page-procedures-data.model';
export * from '../../apps/interfaces/tables/procedures-progress.model';
export * from '../../apps/interfaces/tables/procedures-progress-process.model';

// Document management interfaces
export * from '../../apps/interfaces/document-management/attachment.model';

// Forms interfaces
export * from '../../apps/interfaces/forms/dynamic-forms';

// User interfaces
export { Pageable as DigitalizedPageable, Sort as DigitalizedSort, UsersSignatures } from '../../apps/interfaces/users/digitalized-signatures';
// User from user.model moved to line 71 to avoid duplication
// Information property interfaces
export * from '../../apps/interfaces/information-property/baunit-head.model';
export * from '../../apps/interfaces/information-property/baunit-head-percentage.model';
export * from '../../apps/interfaces/information-property/basic-information-property';
export { InfoPerson } from '../../apps/interfaces/information-property/info-person';
export * from '../../apps/interfaces/information-property/basic-information-address';
export * from '../../apps/interfaces/information-property/detail-basic-information-address';
export * from '../../apps/interfaces/information-property/information-adjacent';
export * from '../../apps/interfaces/information-property/cc-calificacion-ub';
export * from '../../apps/interfaces/information-property/content-information-construction';
export * from '../../apps/interfaces/information-property/info-appraisal';
export * from '../../apps/interfaces/information-property/zone-baunit';
export * from '../../apps/interfaces/information-property/national-predial-number';

// Baunit ICA interfaces
export * from './property-management/ica/baunit-ica.interface';
export * from './property-management/ica/ica-table';
export * from './property-management/ica/ica-details';

// Owner interfaces
export * from './property-management/owner/info-owner-row-t.interface';

// BPM interfaces - Updated to use new @features path
export * from '@features/bpm-workflows/models';
export * from '../../apps/interfaces/general/content-info-workflow.model';
export * from '../../apps/interfaces/general/modal-size.interface';
export * from '../../apps/interfaces/tables/procedures-progress.model';
export * from '../../apps/interfaces/tables/procedures-progress-process.model';
export * from '../../apps/interfaces/information-property/snr-folio-info';
export * from '../../apps/interfaces/information-property/snr-source-info';
export * from '../../apps/interfaces/information-property/administrative-source';
export * from '../../apps/interfaces/information-property/alerts.interface';
export { InformationPageableUser, User, Individual, Role, Authority, CreateUserParams, CreateOutput } from '../../apps/interfaces/users/user';
export { Authority as UserAuthority, DecodeJwt, UserDetails } from '../../shared/models/user.model';
export * from '../../apps/interfaces/information-property/snr-person-info';
export * from '../../apps/interfaces/information-property/basic-detail-group';
export * from '../../apps/interfaces/information-property/info-contact';
export { GeoEconomicZone } from '../../apps/interfaces/information-property/geo-economic-zone';
export * from '../../apps/interfaces/information-property/basic-master-group';
export * from '../../apps/interfaces/comments/comments.model';
export * from '../../apps/interfaces/general/content-info-domainLadmCol.model';
export * from '../../apps/interfaces/general/simple-response.interface';
export * from '../../apps/interfaces/information-property/baunit-npnlike';
export * from '../../apps/interfaces/information-property/rural-physical-zone';
export * from '../../apps/interfaces/information-property/urban-physical-zone';
export * from '../../apps/interfaces/information-property/types-qualification-ub';
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
