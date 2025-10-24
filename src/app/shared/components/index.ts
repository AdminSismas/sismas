// Shared components barrel exports
// Componentes organizados por ubicación: apps/components (legacy) + features (nueva arquitectura)

// === NUEVA ARQUITECTURA (features) ===
// BMP Workflow components (migrados)
export { DocumentTableComponent } from '../../features/bmp-workflows/components/document-table/document-table.component';
export { ClearInformationDataComponent } from '../../features/bmp-workflows/components/clear-information-data/clear-information-data.component';

// === ARQUITECTURA LEGACY (apps/components) ===
// General components que existen y funcionan
export { LoaderComponent } from '../../apps/components/general-components/loader/loader.component';
export { InputComponent } from '../../apps/components/general-components/input/input.component';
export { ComboboxCollectionComponent } from '../../apps/components/general-components/combobox-collection/combobox-collection.component';
export { TextAreaComponent } from '../../apps/components/general-components/text-area/text-area.component';
export { LoadingAppComponent } from '../../apps/components/general-components/loading-app/loading-app.component';

// Forms components
export { DynamicFormsComponent } from '../../apps/components/forms/dynamic-forms/dynamic-forms.component';

// Configuration components
export { CreateSignatureComponent } from '../../apps/components/configuration/digitalized-signatures/create-signature/create-signature.component';
export { CreateZoneComponent } from '../../apps/components/configuration/economic-mod-land/create-zone/create-zone.component';
export { EconomicZoneComponent } from '../../apps/components/configuration/economic-mod-land/economic-zone/economic-zone.component';

// Document management
export { ViewFileDocumentManagementComponent } from '../../apps/components/general-components/view-file-document-management/view-file-document-management.component';

// Additional general components
export { ComboboxComponent } from '../../apps/components/general-components/combobox/combobox.component';
export { InConstructionComponent } from '../../apps/components/general-components/in-construction/in-construction.component';
export { ParticipantTableComponent } from '../../apps/components/general-components/participant-table/participant-table.component';

// Geographic components
export { GeographicViewerEmbeddedComponent } from '../../apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';
export { GeographicViewerComponent } from '../../apps/components/geographics/geographic-viewer/geographic-viewer.component';

// Information property components
export { CadastralInformationPropertyComponent } from '../../apps/components/information-property/cadastral-information-property/cadastral-information-property.component';
export { InformationAddressesPropertyComponent } from '../../apps/components/information-property/information-addresses-property/information-addresses-property.component';
export { BasicPropertyInformationComponent } from '../../apps/components/information-property/basic-property-information/basic-property-information.component';
export { EditBasicPropertyInformationComponent } from '../../apps/components/information-property/basic-property-information/edit-basic-property-information/edit-basic-property-information.component';
export { HeaderCadastralInformationPropertyComponent } from '../../apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
export { InformationPropertyOwnersComponent } from '../../apps/components/information-property/information-property-owners/information-property-owners.component';
export { InformationConstructionsPropertyComponent } from '../../apps/components/information-property/information-constructions-property/information-constructions-property.component';
export { InformationUnitPropertyComponent } from '../../apps/components/information-property/information-unit-property/information-unit-property.component';
export { InformationZonesPropertyComponent } from '../../apps/components/information-property/information-zones-property/information-zones-property.component';
export { LayoutCardCadastralInformationPropertyComponentComponent } from '../../apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
export { AdministrativeSourcesComponent } from '../../apps/components/information-property/administrative-sources/administrative-sources.component';
export { CreateAdministrativeSourceComponent } from '../../apps/components/information-property/administrative-sources/create-administrative-source/create-administrative-source.component';
export { AlertsComponent } from '../../apps/components/information-property/alerts/alerts.component';
export { DetailAlertsComponent } from '../../apps/components/information-property/alerts/detail-alerts/detail-alerts.component';
export { CreateAlertComponent } from '../../apps/components/information-property/alerts/create-alert/create-alert.component';
export { UpdateAlertComponent } from '../../apps/components/information-property/alerts/update-alert/update-alert.component';
export { PhotosComponent } from '../../apps/components/information-property/photos/photos.component';
export { PropertyAppraisalInformationComponent } from '../../apps/components/information-property/property-appraisal-information/property-appraisal-information.component';

// Tables components
export { TableProceduresComponent } from '../../apps/components/tables/table-procedures/table-procedures.component';

// BMP components
export { ParticipantTableDialogComponent } from '../../apps/components/bpm/participant-table-dialog/participant-table-dialog.component';

// BMP components - comentados porque las rutas no son accesibles durante compilación
// export { CommentsComponent } from '../../apps/components/bpmcomments/comments.component';

// TODO: Componentes por verificar/migrar
// export { AttachmentExcelMassiveComponent } from '../../apps/components/bpmattachment-excel-massive/attachment-excel-massive.component';
