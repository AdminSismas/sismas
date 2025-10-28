// Shared services barrel exports
// Export services that exist with correct paths

// Loading service
export { LoadingServiceService } from '../../apps/services/general/loading-service.service';

// Title service
export { TitleService } from '../../apps/services/general/tittle.service';

// Alert services
export { AlertsService as AlertesService } from '../../apps/services/alerts/alertes.service';

// Re-export with common naming patterns for backward compatibility
export { AlertsService } from '../../apps/services/alerts/alertes.service';

// Splash screen service
export { SplashScreenService } from '../../apps/services/core/splash-screen.service';

// TODO: BMP Core services - verificar rutas exactas
// export { AlfaMainService } from '@features/bpm-workflows/services/alfa-main.service';
// export { AttachmentService } from '@features/bpm-workflows/services/attachment.service';

// Collection service
export { CollectionServices } from '../../apps/services/general/collection.service';
export { SendInfoGeneralService } from '../../apps/services/general/send-info-general.service';
export { OutFormatService } from '../../apps/services/general/out-format.service';
export { InfoTableService } from '../../apps/services/general/info-table.service';
export { ValidateInformationBaunitService } from '../../apps/services/general/validate-information-baunit.service';
export { SendInformationRegisterService } from '../../apps/services/register-procedure/send-information-register.service';
export { ProceduresService } from '../../apps/services/general/procedures.service';

// BMP services - temporarily commented due to path issues
// export { ParticipantsService } from '@features/bpm-workflows/services/participants-service.service';

// Territorial organization service
export { TerritorialOrganizationService } from '../../apps/services/territorial-organization/territorial-organization.service';
export { InformationPropertyService } from '../../apps/services/territorial-organization/information-property.service';
export { UnitPropertyInformationService } from '../../apps/services/territorial-organization/baunit-children-information.service';

// Geographic service
export { InformationGeographicService } from '../../apps/services/geographics/information-geographic.service';

// BMP Core services
export { ParticipantsService } from '@features/bpm-workflows/services/participants-service.service';
export { InformationPersonService } from '@features/bpm-workflows/services/information-person.service';
export { BpmCoreService } from '@features/bpm-workflows/services/bpm-core.service';
export { TasksPanelService } from '@features/bpm-workflows/services/tasks-panel.service';
export { BpmProcessService, PermissionVailable } from '@features/bpm-workflows/services/bpm-process.service';
export { WorkflowService } from '@features/bpm-workflows/services/workflow.service';
export { DomainLadmColService } from '../../apps/services/economic-mod-land/domain-ladm-col.service';
export { SearchService } from '../../apps/services/general/search.service';
export { DynamicComponentsService } from '@features/bpm-workflows/services/dynamic-components.service';
export { RecognitionPropertyService } from '@features/bpm-workflows/services/recognition-property.service';
export { ParticipantsProcessService } from '@features/bpm-workflows/services/participants-process.service';
// export { AttachmentService as BmpAttachmentService } from '@features/bpm-workflows/services/attachment.service';

// Operation support services
export { DownloadReportsService } from '../../apps/services/operation-support/reports/download-reports.service';

// Information property services
export { BaunitIcaService } from 'src/app/apps/components/information-property/baunit-ica/services/baunit-ica.service';
export { InformationAdjacentPropertyService } from '../../apps/services/information-property/information-adjacent-property/information-adjacent-property.service';
export { InformationConstructionsService } from '../../apps/services/information-property/information-constructions-property/information-constructions.service';

// People services
export * from '../../apps/services/users/people.service';

// Validation services
export { GeneralValidationsService } from '../../apps/services/validations/general-validations.service';
export { CommonGeneralValidationsService } from '../../apps/services/general/common-general-validations.service';

// export { TitleService } from '../../apps/services/title/title.service';
