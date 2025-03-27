import { BaunitHead } from '../../interfaces/information-property/baunit-head.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { BasicInformationAddress } from '../../interfaces/information-property/basic-information-address';
import { ContentInformationConstruction } from '../../interfaces/information-property/content-information-construction';
import { InfoAppraisal } from '../../interfaces/information-property/info-appraisal';
import { BasicComponentTemplate } from '../../interfaces/bpm/render-template.types';
import { ProcessParticipant } from '../../interfaces/bpm/process-participant';
import { Operation } from '../../interfaces/bpm/operation';
import { environment } from '../../../../environments/environments';
import {
  CheckTypeQualificationMode,
  TypeButtonAlfaMain,
  TypeInformation, TypeOperation,
  TypeOperationAlfaMain,
  TypeOperationGeoMain, TypeQualificationMode, ValidateQualificationByDomBuiltType
} from '../../interfaces/general/content-info';
import { CadastralChangeLog } from '../../interfaces/bpm/cadastral-change-log';
import { OutFormatModel } from '../../interfaces/general/out-format.model';
import { TaskRetailExecuteResponseModel } from '../../interfaces/bpm/task-retail-execute-response.model';
import { DataFolio } from '../../interfaces/information-property/snr-folio-info';
import { DataSource } from '../../interfaces/information-property/snr-source-info';
import { DataPerson } from '../../interfaces/information-property/snr-person-info';
import { InformationAdjacent } from '../../interfaces/information-property/information-adjacent';
import { ZoneBAUnitFisica } from '../../interfaces/information-property/zone-baunit';
import {
  CreateBasicInformationAddress,
  DetailBasicInformationAddress
} from '../../interfaces/information-property/detail-basic-information-address';

export const GUION: string = '-';
export const SPACE: string = ' ';
export const TWO_POINT_: string = ': ';
export const NAME_NA: string = 'N/A';
export const NAME_NO: string = 'NO';
export const NAME_DATE: string = 'date';
export const NAME_SI: string = 'SI';
export const NAME_NO_DISPONIBLE: string = 'N/D';
export const NAME_NO_DISPONIBLE_CERO: string = '0';

export const INDIVIDUAL_TYPE_NUMBER: string = 'NIT';
export const PAGE = 0;
export const PAGE_SIZE = 10;
export const PAGE_SIZE_TABLE_CADASTRAL = 10;
export const TITULO_PAGE_CADASTRAL: string = 'Búsqueda catastral';
export const TITULO_PAGE_AVANZADA: string = 'Búsqueda avanzada';
export const URL_PAGE_CADASTRAL: string = 'Búsqueda catastral';
export const RULE_PAGE_CADASTRAL_DA: string = 'cadastralSearchDA';
export const TITULO_PAGE_CADASTRAL_DA: string = 'Búsqueda catastral DA';
export const RULE_PAGE_HISTORICAL: string = 'historicalInformation';
export const INFORMATION_HISTORICAL: string = 'Información histórica';


export const MAX_PAGE_SIZE_TABLE_UNIQUE = 1000;
export const PAGE_SIZE_TABLE_UNIQUE = 10;
export const PAGE_SIZE_SORT = 5;
export const NAME_CODENAME: string = 'codeName';
export const DIVPOLLVL_CODE: string = 'divpolLvl1Code';
export const DIVPOLLVL2_CODE: string = 'divpolLvl2Code';
export const FORMAT_CURRENCY_COP: string = 'COP';
export const FORMAT_CURRENCY_SIMBOL: string = 'symbol';
export const STRING_INFORMATION_NOT_FOUND: string = 'Información no disponible';

export const PAGE_OPTION_1_5_10: number[] = [1, 5, 10];
export const PAGE_OPTION_5_7_10: number[] = [5, 7, 10];
export const PAGE_OPTION_10_20_50_100: number[] = [10, 20, 50, 100];

export const PAGE_OPTION_UNIQUE_7 = 7;
export const PAGE_OPTION_UNIQUE = 10;
export const PAGE_SIZE_OPTION: number[] = [PAGE_OPTION_UNIQUE, 20, 50, 100];
export const PAGE_SIZE_OPTION_UNIQUE: number[] = [PAGE_OPTION_UNIQUE];
export const PAGE_SIZE_OPTION_ADDRESS: number[] = [5, PAGE_OPTION_UNIQUE];
export const PAGE_SIZE_OPTION_ADJACENT: number[] = [5, PAGE_OPTION_UNIQUE];
export const PAGE_SIZE_SORT_FOLIO = 1;
export const PAGE_SIZE_OPTION_FOLIO: number[] = [2, 5];

export const STRUCTURE_HTML_HEADER =
  `<html>
  <head>
     {style}
  </head>
  <body>`;

export const STRUCTURE_HTML_FOOTER = `</body></html>`;

/**
 * DOMAIN NAME
 * **/
export const DOMAIN_NAME_BUILT_USE: string = 'BuiltUse';
export const PANEL_ASSIGNED_TASKS: string = 'assignedTasks';
export const PANEL_DEVOLUTION_TASKS: string = 'returnedTasks';
export const PANEL_PRIORITIZED_TASKS: string = 'prioritizedTasks';
export const PROCESO_CREAR_DIRECCION: string = 'Nueva dirección';
export const PROCESO_ACTUALIZAR_DIRECCION: string = 'Editar dirección';

export const CONSTANT_VALIDATE_CHECK: string = 'checkStatusBpmOperation';
export const CONSTANT_VALIDATE_OTHER: string = 'OTHER_CHECK';
export const LIMPIAR_CAMPOS_SELECCION_MUNICIPAL: string = 'Selección municipal';
export const LIMPIAR_CAMPOS_MULTIPLES_CAMPOS: string = 'Múltiples campos';
export const NUMERO_PREDIAL_NACIONAL: string = 'Número Predial Nacional';

export const TYPE_INFORMATION_EDITION: TypeInformation = 'edition';
export const TYPE_INFORMATION_VISUAL: TypeInformation = 'visualization';
export const EVIRONMENT_CC_DIRECCION: string = '/ccDireccion';
export const ROL_GUEST: string = 'GUEST';
export const ROL_USER_READ: string = 'USER_READ';

export const ENVIRONMENT_RETIRO_IMG: string = 'assets/img/logo/logo_El_retiro.png';
export const NAME_LOGO_IMG_SAN_VICENTE: string = 'logo_san_vicente.png';

export const TYPE_OPERATION_ADD: TypeOperationAlfaMain = 'ADD';
export const TYPE_OPERATION_CREATE: TypeOperationAlfaMain = 'CREATE';
export const TYPE_OPERATION_DELETE: TypeOperationAlfaMain = 'DELETE';

export const TYPE_OPERATION_CREATE_GEO: TypeOperationGeoMain = 'CREATE';
export const TYPE_OPERATION_DELETE_GEO: TypeOperationGeoMain = 'DELETE';
export const TYPE_OPERATION_CALCULATE_BOUNDARIES: TypeOperationGeoMain = 'CAL_BOUND';
export const BASIC_USERS_ROLE_LIST: string[] = ['ADMIN', 'USER_LEAD', 'USER_SERV', 'USER', 'USER_READ', 'GUEST'];
export const NOT_GUEST_USERS_ROLE_LIST: string[] = ['ADMIN', 'USER_LEAD', 'USER_SERV', 'USER', 'USER_READ'];
export const CERTIFICATE_USERS_ROLE_LIST: string[] = ['ADMIN', 'USER_LEAD', 'USER_SERV'];
export const ADMIN_ROLE_LIST: string[] = ['ADMIN'];


export const TABLE_COLUMN_PROPERTIES: TableColumn<BaunitHead>[] = [
  {
    label: 'Ver acciones',
    property: 'viewMap',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Matrícula inmobiliaria',
    property: 'registration',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Número predial',
    property: 'cadastralNumber',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Área terreno',
    property: 'cadastralArea',
    type: 'operationType',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Condición',
    property: 'domBaunitCondition',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Destino económico',
    property: 'domBaunitEconoDesti',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: '',
    property: 'empty-row',
    type: 'empty-row',
    visible: false,
    cssClasses: ['text-secondary', 'font-medium']
  }
  // { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];
export const TABLE_COLUMN_INFORMATION_PROPERTIES: TableColumn<BaunitHead>[] = [
  {
    label: 'Ver acciones',
    property: 'viewMap',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Matrícula inmobiliaria',
    property: 'registration',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Número predial',
    property: 'cadastralNumber',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Área terreno',
    property: 'cadastralAreaE',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Condición',
    property: 'domBaunitCondition',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Destino económico',
    property: 'domBaunitEconoDesti',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: '',
    property: 'empty-row',
    type: 'empty-row',
    visible: false,
    cssClasses: ['text-secondary', 'font-medium']
  }
  // { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];
export const TABLE_COLUMN_DOCUMENT_ASSOCIATION: TableColumn<OutFormatModel>[] = [
  {
    label: 'ID',
    property: 'outTemplateId',
    type: 'text',
    visible: true
  },

  {
    label: 'Codigo Template',
    property: 'templateCode',
    type: 'text',
    visible: true
  },
  {
    label: 'Header',
    property: 'headerTemplate',
    type: 'operationType',
    visible: true
  },
  {
    label: 'Footer',
    property: 'footerTemplate',
    type: 'operationType',
    visible: true
  },
  {
    label: 'Firmado',
    property: 'isSinged',
    type: 'text',
    visible: true
  },


  {
    label: 'Acciones',
    property: 'actions',
    type: 'button',
    visible: true
  }
];
export const TABLE_COLUMN_PROPERTIES_CRUD_ALFA_MAIN: TableColumn<BaunitHead>[] = [
  {
    label: 'Matrícula inmobiliaria',
    property: 'registration',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Número predial',
    property: 'cadastralNumber',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Área terreno',
    property: 'cadastralAreaE',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Condición',
    property: 'domBaunitCondition',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];

export const TABLE_COLUMN_PROPERTIES_ADDRESS_GENERAL: TableColumn<BasicInformationAddress>[] = [
  {
    label: 'Detalle',
    property: 'detailDirection',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Es principal',
    property: 'isMainAddress',
    type: 'text',
    visible: true
  },
  {
    label: 'Dirección',
    property: 'nombrePredio',
    type: 'text',
    visible: true
  }
];
export const TABLE_COLUMN_PROPERTIES_ADDRESS: TableColumn<BasicInformationAddress>[] = TABLE_COLUMN_PROPERTIES_ADDRESS_GENERAL;
export const TABLE_COLUMN_PROPERTIES_ADDRESS_EDITION: TableColumn<BasicInformationAddress>[] = [
  ...TABLE_COLUMN_PROPERTIES_ADDRESS_GENERAL,
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];

export const TABLE_COLUMN_PROPERTIES_CONSTRUCTION_GENERAL: TableColumn<ContentInformationConstruction>[] = [
  {
    label: 'Detalle',
    property: 'viewDetail',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'ID',
    property: 'unitBuiltLabel',
    type: 'text',
    visible: true
  },
  {
    label: 'Tipo',
    property: 'domBuiltType',
    type: 'text',
    visible: true
  },
  {
    label: 'Uso',
    property: 'domBuiltUse',
    type: 'text',
    visible: true
  },
  {
    label: 'Área (mts2)',
    property: 'unitBuiltArea',
    type: 'text',
    visible: true
  },
  {
    label: 'Tipología',
    property: 'domTipologiaTipo',
    type: 'text',
    visible: true
  }
];

export const TABLE_COLUMN_PROPERTIES_PHYSICAL: TableColumn<ZoneBAUnitFisica>[] = [
  {
    label: 'Detalle',
    property: 'details',
    type: 'image',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Código',
    property: 'zonaHomoCode',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Area',
    property: 'baUnitZonaAreaE',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Vigencia',
    property: 'vigencia',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Común',
    property: 'esComun',
    type: 'operationType',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  }
];

export const TABLE_COLUMN_PROPERTIES_GEO_ECONOMIC: TableColumn<ContentInformationConstruction>[] = [
  {
    label: 'Detalle',
    property: 'viewDetailEcono',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Código',
    property: 'zonaHomoGeoEconomicaCode',
    type: 'text',
    visible: true
  },
  {
    label: 'Área',
    property: 'baUnitZonaAreaE',
    type: 'text',
    visible: true
  },
  {
    label: 'Vigencia',
    property: 'getZonevalidity',
    type: 'progress',
    visible: true
  },
  {
    label: 'Común',
    property: 'esComun',
    type: 'operationType',
    visible: true
  }
];

export const TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL: TableColumn<InformationAdjacent>[] = [
  // {
  //   label: 'Ficha',
  //   property: 'ccColindanteBaunitId',
  //   type: 'text',
  //   visible: true
  // },
  {
    label: 'Punto cardinal',
    property: 'domPuntoCardinal',
    type: 'text',
    visible: true
  },
  {
    label: 'Colindante',
    property: 'colindante',
    type: 'text',
    visible: true
  }
];

export const TABLE_COLUMN_PROPERTIES_ADJACENT_EDITION: TableColumn<InformationAdjacent>[] = [
  ...TABLE_COLUMN_PROPERTIES_ADJACENT_GENERAL,
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];


export const TABLE_COLUMN_PROPERTIES_EXECUTED: TableColumn<TaskRetailExecuteResponseModel>[] = [
  {
    label: 'Detalle',
    property: 'viewDetail',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },

  {
    label: 'Nombre del trámite',
    property: 'processName',
    type: 'text',
    visible: true
  },
  {
    label: 'Nombre de la tarea',
    property: 'flowName',
    type: 'text',
    visible: true
  },
  {
    label: 'Fecha de inicio',
    property: 'beginAt',
    type: 'date',
    visible: true
  },
  {
    label: 'Días de retraso',
    property: 'daysFinish',
    type: 'currency',
    visible: true
  }


];
export const TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION: TableColumn<ContentInformationConstruction>[] = [
  ...TABLE_COLUMN_PROPERTIES_CONSTRUCTION_GENERAL,
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];
export const TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS: TableColumn<ContentInformationConstruction>[] = TABLE_COLUMN_PROPERTIES_CONSTRUCTION_GENERAL;

export const COMPONENT_ALFA_MAIN:string = 'cadAlfaMainComponent';
export const COMPONENT_ALFA_VALIDATE:string = 'cadAlfaValidateComponent';

export const LISTO_FORM_BPM_CORE: BasicComponentTemplate[] = [
  {
    name: COMPONENT_ALFA_MAIN,
    pathForm: '/core/cadastral/alf/main.html',
    serviceValidation: 'checkStatusBpmOperation',
    mode: 1
  },
  {
    name: COMPONENT_ALFA_VALIDATE,
    pathForm: '/core/cadastral/alf/validate.html',
    serviceValidation: 'checkStatusBpmOperation',
    mode: 2
  },
  {
    name: 'cadEcoCommitteeComponent',
    pathForm: '/core/cadastral/eco/comite.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadGeoMainComponent',
    pathForm: '/core/cadastral/geo/main.html',
    serviceValidation: '',
    mode: 3
  },
  {
    name: 'cadGeoValidateComponent',
    pathForm: '/core/cadastral/geo/validate.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadResMainComponent',
    pathForm: '/core/cadastral/res/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadResValidateComponent',
    pathForm: '/core/cadastral/res/validate.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadSynMainComponent',
    pathForm: '/core/cadastral/syn/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadVisitComponent',
    pathForm: '/core/cadastral/visita.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'docuMainComponent',
    pathForm: '/core/document/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'docuValidateComponent',
    pathForm: '/core/document/validate.html',
    serviceValidation: '',
    mode: 1
  }
];

export const TABLE_COLUMN_CHANGES_BPM_OPERATION: TableColumn<CadastralChangeLog>[] = [
  {
    label: 'Cambio',
    property: 'detail',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Antes',
    property: 'valueBefore',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Después',
    property: 'valueAfter',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  }
];


export const NAME_VALIDITY_VALUATION: string = 'validityValuation';
export const NAME_CADASTRAL_VALUATION_AT: string = 'cadastralValuationAt';
export const NAME_CADASTRAL_VALUATION: string = 'cadastralValuation';
export const NAME_CADASTRAL_VALUATION_LAND: string = 'cadastralValuationLand';
export const NAME_CADASTRAL_VALUATION_UNITS: string = 'cadastralValuationUnits';
export const NAME_COMMERCIAL_VALUATION: string = 'commercialValuation';
export const NAME_COMMERCIAL_VALUATION_LAND: string = 'commercialValuationLand';
export const NAME_COMMERCIAL_VALUATION_UNITS: string = 'commercialValuationUnits';
export const NAME_SELF_VALUATION_VALUE: string = 'selfValuationValue';
export const DOMAIN_COLLECTION_BPM_PROCESS_CATEGORY: string = 'BpmProcessCategory';


export const LIST_GRID_APPRAISAL_1: string[] = [
  'validityValuation', 'cadastralValuationAt'
];

export const LIST_GRID_APPRAISAL_2: string[] = [
  'cadastralValuation', 'cadastralValuationLand', 'cadastralValuationUnits'
];

export const LIST_GRID_APPRAISAL_3: string[] = [
  'commercialValuation', 'commercialValuationLand', 'commercialValuationUnits'
];

export const TABLE_COLUMN_PROPERTIES_APPRAISALS: TableColumn<InfoAppraisal>[] = [
  {
    label: 'Vigencia',
    property: 'validityValuation',
    type: 'text',
    visible: true,
    cssClassesHead: ['pr-1'],
    cssClasses: ['font-medium', 'pr-1']
  },
  {
    label: 'Desde',
    property: 'cadastralValuationAt',
    type: 'date',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Total',
    property: 'cadastralValuation',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Terreno',
    property: 'cadastralValuationLand',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Construcciones',
    property: 'cadastralValuationUnits',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Total',
    property: 'commercialValuation',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Terreno',
    property: 'commercialValuationLand',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Construcciones',
    property: 'commercialValuationUnits',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium', 'pl-1 pr-1']
  },
  {
    label: 'Total',
    property: 'selfValuationValue',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1'],
    cssClasses: ['font-medium', 'pl-1']
  }
];

export const LIST_SCHEMAS_CONTROL_MAIN: string[] = [`${environment.schemas.main}`];
export const LIST_SCHEMAS_CONTROL_TEMP: string[] = [`${environment.schemas.temp}`];
export const LIST_SCHEMAS_CONTROL_HISTORY: string[] = [`${environment.schemas.hist}`];
export const LIST_SCHEMAS_CONTROL_CHANGES: string[] = [`${environment.schemas.temp}`, `${environment.schemas.main}`];
export const LIST_SCHEMAS_CONTROL_HISTORY_PRIME: string[] = [`${environment.schemas.hist}`, `${environment.schemas.main}`];


export const LIST_ZONES_RURAL: string[] = ['00'];
export const LIST_FORM_CADASTRAL_0: string[] = [
  'municipality', 'zone', 'sector', 'community', 'neighborhood', 'block', 'sidewalk'
];

export const LIST_FORM_CADASTRAL_1: string[] = [
  'zone', 'sector', 'community', 'neighborhood', 'block', 'sidewalk'
];

export const LIST_FORM_CADASTRAL_2: string[] = [
  'sector', 'community', 'neighborhood', 'block', 'sidewalk'
];

export const LIST_FORM_CADASTRAL_3: string[] = [
  'community', 'neighborhood', 'block', 'sidewalk'
];

export const LIST_FORM_CADASTRAL_4: string[] = [
  'neighborhood', 'block', 'sidewalk'
];

export const LIST_FORM_CADASTRAL_5: string[] = [
  'block', 'sidewalk'
];

export const LIST_EXTRA_COLUMNS_APPRAISAL: string[] = [
  'header-row-first-group', 'header-row-second-group', 'header-row-third-group', 'header-row-quartet-group'
];

export const FRAGMENT_INFORMATION_PROPERTY_OWNERS: string = 'informationPropertyOwnersComponent';
export const FRAGMENT_PHOTOS: string = 'photosComponent';
export const FRAGMENT_ALERTS: string = 'alertsComponent';
export const FRAGMENT_SUPER_NOTARIADO_PROPERTY: string = 'superNotariadoPropertyComponent';
export const FRAGMENT_BASIC_PROPERTY_INFORMATION: string = 'basicPropertyInformationComponent';
export const FRAGMENT_HISTORICAL_PROCEDURES_PROPERTY: string = 'historicalProceduresPropertyComponent';
export const FRAGMENT_ACTIVE_PROCEDURES_PROPERTY: string = 'activeProceduresPropertyComponent';
export const FRAGMENT_INFORMATION_UNIT_PROPERTY: string = 'informationUnitPropertyComponent';


export const LIST_FRAGMENT_COMPONENTS_RULE_PAGE: string[] = [
  FRAGMENT_PHOTOS, FRAGMENT_ALERTS, FRAGMENT_SUPER_NOTARIADO_PROPERTY,
  FRAGMENT_INFORMATION_PROPERTY_OWNERS
];

export const NAVIGATION_ITEMS_INFORMATION_PROPERTIES: { label: string; fragment: string }[] = [
  {
    label: 'Aspectos generales',
    fragment: FRAGMENT_BASIC_PROPERTY_INFORMATION
  },
  {
    label: 'Información de unidad predial',
    fragment: FRAGMENT_INFORMATION_UNIT_PROPERTY
  },
  {
    label: 'Fuentes administrativas',
    fragment: 'administrativeSourcesComponent'
  },
  {
    label: 'Propietarios',
    fragment: FRAGMENT_INFORMATION_PROPERTY_OWNERS
  },
  {
    label: 'Super notariado',
    fragment: FRAGMENT_SUPER_NOTARIADO_PROPERTY
  },
  {
    label: 'Direcciones',
    fragment: 'informationAddressesPropertyComponent'
  },
  {
    label: 'Construcciones',
    fragment: 'informationConstructionsPropertyComponent'
  },
  {
    label: 'Colindantes',
    fragment: 'informationAdjacentPropertyComponent'
  },
  {
    label: 'Avalúos',
    fragment: 'propertyAppraisalInformationComponent'
  },
  {
    label: 'Zonas',
    fragment: 'informationZonesPropertyComponent'
  },
  {
    label: 'Trámites Históricos',
    fragment: FRAGMENT_HISTORICAL_PROCEDURES_PROPERTY
  },
  {
    label: 'Trámites Activos',
    fragment: FRAGMENT_ACTIVE_PROCEDURES_PROPERTY
  },
  {
    label: 'Fotos',
    fragment: FRAGMENT_PHOTOS
  },
  {
    label: 'Alertas',
    fragment: FRAGMENT_ALERTS
  }
];

export const TABLE_COLUMN_BASIC_PRINCIPALS: TableColumn<ProcessParticipant>[] = [
  {
    label: 'Documento',
    property: 'individualNumber',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Nombre participante',
    property: 'fullName',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Participación',
    property: 'bpmParticipation',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];

export const TABLE_ALFA_MAIN_OPERATION_COLUMN: TableColumn<Operation>[] = [
  {
    label: '',
    property: 'operationType',
    type: 'operationType',
    visible: true,
    cssClasses: []
  },
  {
    label: 'Consultar',
    property: 'infoProperties',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Matrícula inmobiliaria',
    property: 'registration',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Número predial',
    property: 'cadastralNumber',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Área terreno',
    property: 'cadastralArea',
    type: 'operationType',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Condición',
    property: 'domBaunitCondition',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Destino económico',
    property: 'domBaunitEconoDesti',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: '',
    property: 'empty-row',
    type: 'empty-row',
    visible: false,
    cssClasses: ['text-secondary', 'font-medium']
  },
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];
export const TABLE_COLUMN_PROPERTIES_FOLIO: TableColumn<DataFolio>[] = [
  {
    label: 'Matricula de matriz',
    property: 'matriculaMatriz',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Matricula de segregados',
    property: 'matriculaSegregados',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Zona',
    property: 'zona',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Dirección',
    property: 'direccion',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Fecha de apertura',
    property: 'fechaApertura',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Estado',
    property: 'estado',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  }
];

export const TABLE_COLUMN_PROPERTIES_SOURCE: TableColumn<DataSource>[] = [
  {
    label: 'Anotación',
    property: 'anotacion',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Tipo',
    property: 'fuenteAdminTipo',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Número Documento',
    property: 'fuenteAdminDocNumero',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Ente Emisor',
    property: 'enteEmisor',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Oficina',
    property: 'oficinaOrigen',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Ciudad',
    property: 'ciudadOrigen',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Código',
    property: 'codigoNatuJuridica',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Naturaleza Jurídica',
    property: 'naturalezaJuridica',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Valor Transacción',
    property: 'valorTransaccion',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Fecha',
    property: 'fuenteAdminDocFecha',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  }
  // {
  //   label: 'Fecha',
  //   property: 'fecha',
  //   type: 'text',
  //   visible: true,
  //   cssClasses: ['font-medium']
  // }
];
export const TABLE_COLUMN_PROPERTIES_PERSON: TableColumn<DataPerson>[] = [
  {
    label: 'Anotación',
    property: 'anotacion',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Tipo de Persona',
    property: 'tipoPersona',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Número de Documento',
    property: 'nroDocumento',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Nombre Completo',
    property: 'nombreCompleto',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Información Complementaria',
    property: 'infoComplementaria',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  }
];

export const CONSTANT_ENABLE_TAB_GEOGRAFIC: TypeButtonAlfaMain = 'TAB_GEO';

export const TYPE_BUTTON_ONE: TypeButtonAlfaMain = 'AGR';
export const TYPE_BUTTON_TWO: TypeButtonAlfaMain = 'CRE';
export const TYPE_BUTTON_TREE: TypeButtonAlfaMain = 'BRR';
export const TYPE_BUTTON_FOUR: TypeButtonAlfaMain = 'CRE_GEO';
export const TYPE_BUTTON_FIVE: TypeButtonAlfaMain = 'DEL_GEO';
export const TYPE_BUTTON_SIX: TypeButtonAlfaMain = 'CAL_BOU';

export const LIST_BUTTON_GEO_MAIN: TypeButtonAlfaMain[] = ['CRE_GEO', 'DEL_GEO', 'CAL_BOU'];

export const REFERENCE_COMPONENTS: string[] = ['GNR', 'FNA', 'PRO', 'CNS', 'DIR', 'ZON', 'CLN'];

export const MODAL_LARGE = { maxWidth: '100%', width: '98%', minHeight: '100%', height: '98%' };
export const MODAL_MEDIUM = { maxWidth: '100%', width: '80%', minHeight: '80%', height: '80%' };
export const MODAL_MEDIUM_SMALL = { maxWidth: '100%', width: '60%', minHeight: '80%', height: '80%' };
export const MODAL_SMALL = { maxWidth: '100%', width: '60%', minHeight: '60%', height: '60%' };
export const MODAL_SMALL_LARGE = { minWidth: '30%', minHeight: '30%' };
export const MODAL_DINAMIC_HEIGHT = { maxWidth: '100%', minWidth: '60%', minHeight: '40%' };
export const IDLE_TIME_MINUTES = 10;
export const TIMEOUT_TIME_MINUTES = 15;

export const TYPE_TYPOLOGY: TypeQualificationMode = 'TYPOLOGY';
export const TYPE_TRADITIONAL: TypeQualificationMode = 'TRADITIONAL';

export const TYPE_CREATE: TypeOperation = 'CREATE';
export const TYPE_READ_ONLY: TypeOperation = 'READ_ONLY';

export const CHECK_TYPE_QUALIFICATION_TRADITIONAL: CheckTypeQualificationMode = {
  label: 'Tradicional',
  type: TYPE_TRADITIONAL
};

export const CHECK_TYPE_QUALIFICATION_MODE: CheckTypeQualificationMode[] = [
  {
    label: 'Tradicional',
    type: TYPE_TRADITIONAL
  },
  {
    label: 'Tipología',
    type: TYPE_TYPOLOGY
  }
];

export const QUALIFICATIONS_DISABLE_BATH_KITCHEN_BY_DOMBUILTTYPE: ValidateQualificationByDomBuiltType[] = [
  {
    domBuiltType: 'Institucional',
    list: ['kitchenConservation', 'kitchenEnchapes', 'kitchenSize', 'bathConservation', 'bathEnchapes', 'bathSize'],
    shouldDisable: true
  },
  {
    domBuiltType: 'Comercial',
    list: ['kitchenConservation', 'kitchenEnchapes', 'kitchenSize', 'bathConservation', 'bathEnchapes', 'bathSize'],
    shouldDisable: true
  },
  {
    domBuiltType: 'Industrial',
    list: ['kitchenConservation', 'kitchenEnchapes', 'kitchenSize', 'bathConservation', 'bathEnchapes', 'bathSize'],
    shouldDisable: false
  },
  {
    domBuiltType: 'Anexo',
    list: ['kitchenConservation', 'kitchenEnchapes', 'kitchenSize', 'bathConservation', 'bathEnchapes', 'bathSize'],
    shouldDisable: false
  },
  {
    domBuiltType: 'Residencial',
    list: ['kitchenConservation', 'kitchenEnchapes', 'kitchenSize', 'bathConservation', 'bathEnchapes', 'bathSize'],
    shouldDisable: false
  }
];

export const DETAIL_BASIC_MODEL_ADDRESS: DetailBasicInformationAddress = {
  // campos BASE
  domTipoDireccion: '',
  esDireccionPrincipal: false,
  codigoPostal: '',
  nombrePredio: '',
  direccionTexto: '',
  // PRINCIPAL
  domClaseViaPrincipal: '',
  letraViaPrincipal: '',
  valorViaPrincipal: '',
  domSectorCiudad: '',
  // GENERADORA
  letraViaGeneradora: '',
  valorViaGeneradora: '',
  complemento: '',
  domSectorPredio: '',
  numeroPredio: ''
};

export const CREATE_BASIC_MODEL_ADDRESS: CreateBasicInformationAddress = {
  // campos BASE
  domTipoDireccion: '',
  esDireccionPrincipal: false,
  codigoPostal: '',
  numeroPredio: '',
  direccionTexto: '',
  // PRINCIPAL
  domClaseViaPrincipal: '',
  letraViaPrincipal: '',
  valorViaPrincipal: '',
  domSectorCiudad: '',
  // GENERADORA
  letraViaGeneradora: '',
  valorViaGeneradora: '',
  complemento: '',
  nombrePredio: '',
  domSectorPredio: ''
};


