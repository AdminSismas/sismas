// Shared components barrel exports
// Componentes organizados por ubicación: apps/components (legacy) + features (nueva arquitectura)

// === NUEVA ARQUITECTURA (features) ===
// BMP Workflow components (migrados)
export { DocumentTableComponent } from '../../features/bmp-workflows/components/document-table/document-table.component';
export { ClearInformationDataComponent } from '../../features/bmp-workflows/components/clear-information-data/clear-information-data.component';
export { CreateWorkflowComponent } from '../../apps/components/tables/table-workflow/components/create-workflow/create-workflow.component';
export { TaskListComponent } from '../../apps/components/tables/table-workflow/components/task-list/task-list.component';
export { EditTaskComponent } from '../../apps/components/tables/table-workflow/components/edit-task/edit-task.component';
export { LaneNamesPipe } from '../../apps/components/tables/table-workflow/pipe/lane-names.pipe';
export { taskListColumns } from '../../apps/components/tables/table-workflow/constants/task-list.constants';
export { editTaskInputs } from '../../apps/components/tables/table-workflow/constants/edit-task.constants';
export type { InfoOwnerRowT } from '../../apps/components/information-property/information-property-owners/information-property-owners.component';
export { TableDomainLadmColComponent } from '../../apps/components/economic-mod-land/table-domain-ladm-col/table-domain-ladm-col.component';

// === ARQUITECTURA LEGACY (apps/components) ===
// General components que existen y funcionan
export { LoaderComponent } from '../../apps/components/general-components/loader/loader.component';
export { InputComponent } from '../../apps/components/general-components/input/input.component';
export { TableThirdPartyAffectedComponent } from '../../apps/components/general-components/table-third-party-affected/table-third-party-affected.component';
export { ComboboxCollectionComponent } from '../../apps/components/general-components/combobox-collection/combobox-collection.component';
export { TextAreaComponent } from '../../apps/components/general-components/text-area/text-area.component';
export { LoadingAppComponent } from '../../apps/components/general-components/loading-app/loading-app.component';

// Forms components
export { DynamicFormsComponent } from '../../apps/components/forms/dynamic-forms/dynamic-forms.component';

// Configuration components
export { CreateSignatureComponent } from '../../apps/components/configuration/digitalized-signatures/create-signature/create-signature.component';
export { CreateZoneComponent } from '../../apps/components/configuration/economic-mod-land/create-zone/create-zone.component';
export { EconomicZoneComponent } from '../../apps/components/configuration/economic-mod-land/economic-zone/economic-zone.component';
export { ZoneManagerComponent } from '../../apps/components/configuration/economic-mod-land/zone-manager/zone-manager.component';

// Document management
export { ViewFileDocumentManagementComponent } from '../../apps/components/general-components/view-file-document-management/view-file-document-management.component';

// Additional general components
export { ComboboxComponent } from '../../apps/components/general-components/combobox/combobox.component';
export { InConstructionComponent } from '../../apps/components/general-components/in-construction/in-construction.component';
export { ParticipantTableComponent } from '../../apps/components/general-components/participant-table/participant-table.component';
export { ComboboxCollectionFormComponent } from '../../apps/components/general-components/combobox-collection-form/combobox-collection-form.component';
export { ModalWindowComponent } from '../../apps/components/general-components/modal-window/modal-window.component';
export { ModalResponse } from '../../apps/components/general-components/modal-window/modal-window.component';
export { CustomSelectorComponent } from '../../apps/components/general-components/custom-selector/custom-selector.component';
export { CarouselComponent } from '../../apps/components/general-components/carousel/carousel.component';
export { PaymentValidationComponent } from '../../apps/components/general-components/payment-validation/payment-validation.component';
export { ReassignProcedureComponent } from '../../apps/components/procedures/reassign-procedure/reassign-procedure.component';

// Geographic components
export { GeographicViewerEmbeddedComponent } from '../../apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';
export { GeographicViewerComponent } from '../../apps/components/geographics/geographic-viewer/geographic-viewer.component';

// Information property components
export { CadastralInformationPropertyComponent } from '../../apps/components/information-property/cadastral-information-property/cadastral-information-property.component';
export { InformationAddressesPropertyComponent } from '../../apps/components/information-property/information-addresses-property/information-addresses-property.component';
export { DetailInformationAddressComponent } from '../../apps/components/information-property/information-addresses-property/detail-information-address/detail-information-address.component';
export { AddEditInformationAddressComponent } from '../../apps/components/information-property/information-addresses-property/add-edit-information-address/add-edit-information-address.component';
export { BasicPropertyInformationComponent } from '../../apps/components/information-property/basic-property-information/basic-property-information.component';
export { EditBasicPropertyInformationComponent } from '../../apps/components/information-property/basic-property-information/edit-basic-property-information/edit-basic-property-information.component';
export { HeaderCadastralInformationPropertyComponent } from '../../apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';
export { InformationPropertyOwnersComponent } from '../../apps/components/information-property/information-property-owners/information-property-owners.component';
export { DetailInformationPropertyOwnerComponent } from '../../apps/components/information-property/information-property-owners/detail-information-property-owner/detail-information-property-owner.component';
export { AddPropertyOwnerComponent } from '../../apps/components/information-property/information-property-owners/add-property-owner/add-property-owner.component';
export { EditingPropertyOwnerComponent } from '../../apps/components/information-property/information-property-owners/editing-property-owner/editing-property-owner.component';
export { InformationConstructionsPropertyComponent } from '../../apps/components/information-property/information-constructions-property/information-constructions-property.component';
export { CrudInformationConstructionsPropertyComponent } from '../../apps/components/information-property/information-constructions-property/crud-information-constructions-property/crud-information-constructions-property.component';
export { DetailInformationConstructionsPropertyComponent } from '../../apps/components/information-property/information-constructions-property/detail-information-constructions-property/detail-information-constructions-property.component';
export { EditConstructionsComponent } from '../../apps/components/information-property/information-constructions-property/edit-constructions/edit-constructions.component';
export { TableConstructionsComponent } from '../../apps/components/information-property/information-constructions-property/table-constructions/table-constructions.component';
export { InformationUnitPropertyComponent } from '../../apps/components/information-property/information-unit-property/information-unit-property.component';
export { InformationZonesPropertyComponent } from '../../apps/components/information-property/information-zones-property/information-zones-property.component';
export { GeoEconomicZonesPropertyComponent } from '../../apps/components/information-property/information-zones-property/components-child/geo-economic-zones-property/geo-economic-zones-property.component';
export { PhysicalZonesPropertyComponent } from '../../apps/components/information-property/information-zones-property/components-child/physical-zones-property/physical-zones-property.component';
export { DetailInformationPropertyZonesComponent } from '../../apps/components/information-property/information-zones-property/detail-information-property-zones/detail-information-property-zones.component';
export { AddEditInformatizonZonesPropertyComponent } from '../../apps/components/information-property/information-zones-property/add-edit-informatizon-zones-property/add-edit-informatizon-zones-property.component';
export { LayoutCardCadastralInformationPropertyComponentComponent } from '../../apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
export { AdministrativeSourcesComponent } from '../../apps/components/information-property/administrative-sources/administrative-sources.component';
export { CreateAdministrativeSourceComponent } from '../../apps/components/information-property/administrative-sources/create-administrative-source/create-administrative-source.component';
export { AlertsComponent } from '../../apps/components/information-property/alerts/alerts.component';
export { DetailAlertsComponent } from '../../apps/components/information-property/alerts/detail-alerts/detail-alerts.component';
export { CreateAlertComponent } from '../../apps/components/information-property/alerts/create-alert/create-alert.component';
export { UpdateAlertComponent } from '../../apps/components/information-property/alerts/update-alert/update-alert.component';
export { PhotosComponent } from '../../apps/components/information-property/photos/photos.component';
export { AddPhotoComponent } from '../../apps/components/information-property/photos/add-photo/add-photo.component';
export { PropertyAppraisalInformationComponent } from '../../apps/components/information-property/property-appraisal-information/property-appraisal-information.component';
export { HistoricAppraisalComponent } from '../../apps/components/information-property/property-appraisal-information/historic-appraisal/historic-appraisal.component';
export { AutoAppraisalComponent } from '../../apps/components/information-property/property-appraisal-information/auto-appraisal/auto-appraisal.component';
export { AppraisalDetailsComponent } from '../../apps/components/information-property/property-appraisal-information/appraisal-details/appraisal-details.component';
export { AppraisalLabelPipe } from '../../apps/components/information-property/property-appraisal-information/appraisal-details/appraisal-label.pipe';
export { InformationAdjacentPropertyComponent } from '../../apps/components/information-property/information-adjacent-property/information-adjacent-property.component';
export { CrudInformationAdjacentPropertyComponent } from '../../apps/components/information-property/information-adjacent-property/crud-information-adjacent-property/crud-information-adjacent-property.component';
export { MasiveDeleteAdjacentComponent } from '../../apps/components/information-property/information-adjacent-property/masive-delete-adjacent/masive-delete-adjacent.component';
export { HistoricalActiveProceduresPropertyComponent } from '../../apps/components/information-property/historical-active-procedures/historical-active-procedures.component';
export { BaunitIcaComponent } from '../../apps/components/information-property/baunit-ica/baunit-ica.component';
export { IcaDetailsComponent } from '../../apps/components/information-property/baunit-ica/components/ica-details/ica-details.component';
export { SuperNotariadoPropertyComponent } from '../../apps/components/information-property/super-notariado-property/super-notariado-property.component';
export { InformationSourcePropertyComponent } from '../../apps/components/information-property/information-source-property/information-source-property.component';
export { InformationPersonPropertyComponent } from '../../apps/components/information-property/information-person-property/information-person-property.component';

// Tables components
export { TableProceduresComponent } from '../../apps/components/tables/table-procedures/table-procedures.component';
export { ProcedureStatusPipe } from '../../apps/components/tables/table-procedures/pipe/procedure-status.pipe';
export { TableCertificateSearchComponent } from '../../apps/components/tables/table-certificate-search/table-certificate-search.component';
export { FilterCertificateSearchComponent } from '../../apps/components/tables/table-certificate-search/filter-certificate-search/filter-certificate-search.component';
export { TableCertificateSearchAppraisalsComponent } from '../../apps/components/tables/table-certificate-search-appraisals/table-certificate-search-appraisals.component';
export { FilterCertificateSearchAppraisalsComponent } from '../../apps/components/tables/table-certificate-search-appraisals/filter-certificate-search-appraisals/filter-certificate-search-appraisals.component';
export { TableWorkflowComponent } from '../../apps/components/tables/table-workflow/table-workflow.component';
export { TableCadastralSearchComponent } from '../../apps/components/tables/table-cadastral-search/table-cadastral-search.component';
export { FilterCadastralSearchComponent } from '../../apps/components/tables/table-cadastral-search/filter-cadastral-search/filter-cadastral-search.component';

// BMP components
export { ParticipantTableDialogComponent } from '../../apps/components/bpm/participant-table-dialog/participant-table-dialog.component';
export { ViewChangesBpmOperationComponent } from '../../apps/components/bpm/view-changes-bpm-operation/view-changes-bpm-operation.component';
export { ShowErrorValidateAlfaMainComponent } from '../../apps/components/bpm/show-error-validate-alfa-main/show-error-validate-alfa-main.component';
export { ViewChangeAlphaMainRecordComponent } from '../../apps/components/bpm/view-change-alpha-main-record/view-change-alpha-main-record.component';
export { ViewChangesComponent } from '../../apps/components/bpm/alfa-main/alfa-main-information/view-changes/view-changes.component';
export { HeaderBpmCoreComponent } from '../../apps/components/bpm/header-bpm-core/header-bpm-core.component';
export { CommentsComponent } from '../../apps/components/bpm/comments/comments.component';
export { AttachmentExcelMassiveComponent } from '../../apps/components/bpm/alfa-main/attachment-excel-massive/attachment-excel-massive.component';
export { AlfaMainInformationComponent } from '../../apps/components/bpm/alfa-main/alfa-main-information/alfa-main-information.component';
export { CrudAlfaMainComponent } from '../../apps/components/bpm/alfa-main/crud-alfa-main/crud-alfa-main.component';
export { TableAlfaMainComponent } from '../../apps/components/bpm/table-alfa-main/table-alfa-main.component';
export { ModificationPropertyUnitsComponent } from '../../apps/components/bpm/modification-property-units/modification-property-units.component';
export { CreateMatrixFromNphComponent } from '../../apps/components/bpm/table-alfa-main/create-matrix-from-nph/create-matrix-from-nph.component';
export { CrudPropertyUnitsComponent } from '../../apps/components/bpm/modification-property-units/crud-property-units/crud-property-units.component';

// BMP components - comentados porque las rutas no son accesibles durante compilación
// export { CommentsComponent } from '../../apps/components/bpmcomments/comments.component';

// TODO: Componentes por verificar/migrar
// export { AttachmentExcelMassiveComponent } from '../../apps/components/bmpattachment-excel-massive/attachment-excel-massive.component';

// ICA interfaces and constants (temporarily here due to component dependencies)
export * from '../../apps/components/information-property/baunit-ica/interfaces/baunit-ica.interface';
export * from '../../apps/components/information-property/baunit-ica/interfaces/ica-table';
export * from '../../apps/components/information-property/baunit-ica/interfaces/ica-details';
export * from '../../apps/components/information-property/baunit-ica/baunit-ica.constant';
