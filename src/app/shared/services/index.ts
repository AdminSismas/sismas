// Shared services barrel exports
// Export services that exist with correct paths

// Core services
export { SplashScreenService } from './core/splash-screen.service';

// General services
export { LoadingServiceService } from './general/loading-service.service';
export { TitleService } from './general/tittle.service';
export { CollectionServices } from './general/collection.service';
export { SendInfoGeneralService } from './general/send-info-general.service';
export { OutFormatService } from './general/out-format.service';
export { InfoTableService } from './general/info-table.service';
export { ValidateInformationBaunitService } from './general/validate-information-baunit.service';
export { ProceduresService } from './general/procedures.service';
export { SearchService } from './general/search.service';
export { CommonGeneralValidationsService } from './general/common-general-validations.service';
export { DateFormatService } from './general/date-format.service';
export { ProcedureWorkFinishedService } from './general/procedure-work-finished.service';

// Alert services
export { AlertsService as AlertesService } from '../../apps/services/alerts/alertes.service';
export { AlertsService } from '../../apps/services/alerts/alertes.service';

// Register procedure services
export { SendInformationRegisterService } from '../../apps/services/register-procedure/send-information-register.service';

// BMP services - temporarily commented due to path issues
// export { ParticipantsService } from '@features/bpm-workflows/services/participants-service.service';

// Territorial organization service
export { TerritorialOrganizationService } from '../../apps/services/territorial-organization/territorial-organization.service';
export { InformationPropertyService } from '../../apps/services/territorial-organization/information-property.service';
export { UnitPropertyInformationService } from '../../features/bpm-workflows/services/modification-property-units/procedures/baunit-children-information.service';

// Geographic service
export { InformationGeographicService } from '../../features/bpm-workflows/services/alfa-main/information-geographic.service';

// BMP Core services
export { ParticipantsService } from '@features/bpm-workflows/services/core/participants-service.service';
export { InformationPersonService } from '@features/bpm-workflows/services/core/information-person.service';
export { BpmProcessService, PermissionVailable } from '@features/bpm-workflows/services/core/bpm-process.service';
export { WorkflowService } from '@features/bpm-workflows/services/core/workflow.service';
export { DomainLadmColService } from '../../apps/services/economic-mod-land/domain-ladm-col.service';
export { DynamicComponentsService } from '@features/bpm-workflows/services/core/dynamic-components.service';
export { RecognitionPropertyService } from '@features/bpm-workflows/services/core/recognition-property.service';
export { ParticipantsProcessService } from '@features/bpm-workflows/services/core/participants-process.service';


// Attachment services
export * from './documents/attachment.service';

// Operation support services
export { DownloadReportsService } from '../../apps/services/operation-support/reports/download-reports.service';

// Information property services - migrated to property-management feature
export { InformationAdjacentPropertyService } from '@features/property-management/services';
export { InformationConstructionsService } from '@features/property-management/services';
export { AdministrativeSourcesService } from '@features/property-management/services';
export { InformationZonesService } from '@features/property-management/services';

// People services
export * from '../../apps/services/users/people.service';
export * from './auth/user.service';

// Validation services
export { GeneralValidationsService } from '../../apps/services/validations/general-validations.service';
