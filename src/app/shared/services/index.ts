// Shared services barrel exports
// Export services that exist with correct paths

// Loading service
export { LoadingServiceService } from '../../apps/services/general/loading-service.service';

// Title service
export { TitleService } from '../../apps/services/general/tittle.service';

// Comments service
export { CommentsService } from '../../apps/services/comments/comments.service';

// Alert services
export { AlertsService as AlertesService } from '../../apps/services/alerts/alertes.service';

// Re-export with common naming patterns for backward compatibility
export { AlertsService } from '../../apps/services/alerts/alertes.service';

// Splash screen service
export { SplashScreenService } from '../../apps/services/core/splash-screen.service';

// TODO: BMP Core services - verificar rutas exactas
// export { AlfaMainService } from '../../apps/services/bpmcore/alfa-main.service';
// export { AttachmentService } from '../../apps/services/bpmcore/document/main/attachment.service';

// Collection service
export { CollectionServices } from '../../apps/services/general/collection.service';
export { SendInfoGeneralService } from '../../apps/services/general/send-info-general.service';
export { SendGeneralRequestsService } from '../../apps/services/general/send-general-requests.service';
export { OutFormatService } from '../../apps/services/general/out-format.service';
export { InfoTableService } from '../../apps/services/general/info-table.service';
export { ValidateInformationBaunitService } from '../../apps/services/general/validate-information-baunit.service';
export { SendInformationRegisterService } from '../../apps/services/register-procedure/send-information-register.service';
export { ProceduresService } from '../../apps/services/general/procedures.service';

// BMP services - temporarily commented due to path issues
// export { ParticipantsService } from '../../apps/services/bpmparticipants-service.service';

// Territorial organization service
export { TerritorialOrganizationService } from '../../apps/services/territorial-organization/territorial-organization.service';
export { InformationPropertyService } from '../../apps/services/territorial-organization/information-property.service';
export { UnitPropertyInformationService } from '../../apps/services/territorial-organization/baunit-children-information.service';

// Document management service
export { AttachmentService } from '../../apps/services/document-management/document-management.service';

// Geographic service
export { InformationGeographicService } from '../../apps/services/geographics/information-geographic.service';

// BMP Core services
export { AlfaMainService } from '../../apps/services/bpm/core/alfa-main.service';
export { ParticipantsService } from '../../apps/services/bpm/participants-service.service';
export { InformationPersonService } from '../../apps/services/bpm/information-person.service';
export { BpmCoreService } from '../../apps/services/bpm/bpm-core.service';
export { TasksPanelService } from '../../apps/services/bpm/tasks-panel.service';
export { BpmProcessService, PermissionVailable } from '../../apps/services/bpm/bpm-process.service';
export { WorkflowService } from '../../apps/services/bpm/workflow.service';
export { DomainLadmColService } from '../../apps/services/economic-mod-land/domain-ladm-col.service';
export { SearchService } from '../../apps/services/general/search.service';
export { DynamicComponentsService } from '../../apps/services/bpm/dynamic-components.service';
export { RecognitionPropertyService } from '../../apps/services/bpm/recognition-property.service';
export { ParticipantsProcessService } from '../../apps/services/bpm/core/participants-process.service';
// export { AttachmentService as BmpAttachmentService } from '../../apps/services/bmp/core/document/main/attachment.service';

// Operation support services
export { DownloadReportsService } from '../../apps/services/operation-support/reports/download-reports.service';

// Information property services
export { BaunitIcaService } from '../../apps/components/information-property/baunit-ica/services/baunit-ica.service';
export { InformationAdjacentPropertyService } from '../../apps/services/information-property/information-adjacent-property/information-adjacent-property.service';
export { InformationConstructionsService } from '../../apps/services/information-property/information-constructions-property/information-constructions.service';

// People services
export * from '../../apps/services/users/people.service';

// Validation services
export { GeneralValidationsService } from '../../apps/services/validations/general-validations.service';
export { CommonGeneralValidationsService } from '../../apps/services/general/common-general-validations.service';

// export { TitleService } from '../../apps/services/title/title.service';
