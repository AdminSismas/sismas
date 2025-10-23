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

// Geographic components
export { GeographicViewerEmbeddedComponent } from '../../apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';

// Information property components
export { CadastralInformationPropertyComponent } from '../../apps/components/information-property/cadastral-information-property/cadastral-information-property.component';

// BMP components - comentado temporalmente por problemas de acceso al archivo
// export { ParticipantTableDialogComponent } from '../../apps/components/bmp/participant-table-dialog/participant-table-dialog.component';

// BMP components - comentados porque las rutas no son accesibles durante compilación
// export { CommentsComponent } from '../../apps/components/bmp/comments/comments.component';

// TODO: Componentes por verificar/migrar
// export { AttachmentExcelMassiveComponent } from '../../apps/components/bmp/attachment-excel-massive/attachment-excel-massive.component';