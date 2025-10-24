// Shared constants barrel exports
// Export constants from apps/constants for backward compatibility

// General constants (main source for PAGE, PAGE_SIZE, etc.)
export * from '../../apps/constants/general/constants';
export * from '../../apps/constants/general/constantLabels';
export * from '../../apps/constants/general/constantsAlertLabel';
// Skipping conflicting files temporarily to focus on working exports
// export * from '../../apps/constants/general/attachment.constant';
// export * from '../../apps/constants/general/digitalized-signatures.constants';
// export * from '../../apps/constants/general/photos.constant';
// export * from '../../apps/constants/general/procedures.constant';
// export * from '../../apps/constants/general/users.constants';

// BMP constants (commented out due to missing file)
// export * from '../../apps/constants/bpmworkflow.constant';

// Economic mod land constants (commented temporarily)
// export { DOMAIN_LADM_COL_COLUMNS } from '../../apps/constants/economic-mod-land/domain-ladm-col.constant';
// Note: zone-constants and zone.constants have duplicate exports, avoiding conflicting exports
export {
  CADASTRE_CHANGE_LOG_PARAMS,
  NO_DETAILS_DATA
} from '../../apps/constants/economic-mod-land/zone-constants';
// Skipping zone.constants to avoid duplicates with zone-constants

// Information property constants
export * from '../../apps/constants/information-property/administrative-source.constants';
export * from '../../apps/constants/information-property/alerts.constants';
export * from '../../apps/constants/information-property/appraisal.constants';
export * from '../../apps/constants/information-property/basic-property-information.constants';
export * from '../../apps/constants/information-property/cadastral-recognition.constants';
export * from '../../apps/constants/information-property/information-property-owners.constants';
export * from '../../apps/constants/information-property/modification-property-units.constants';

// Procedures constants
export * from '../../apps/constants/procedures/procedures.constants';

// Public services constants
export * from '../../apps/constants/public-services/ticket-office/generate-services.constants';
