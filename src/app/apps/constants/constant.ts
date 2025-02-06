import { BaunitHead } from '../interfaces/information-property/baunit-head.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { BasicInformationAddress } from '../interfaces/information-property/basic-information-address';
import { ContentInformationConstruction } from '../interfaces/information-property/content-information-construction';
import { InfoAppraisal } from '../interfaces/information-property/info-appraisal';
import { BasicComponentTemplate } from '../interfaces/bpm/render-template.types';
import { ProcessParticipant } from '../interfaces/bpm/process-participant';
import { Operation } from '../interfaces/bpm/operation';
import { environment } from '../../../environments/environments';
import { TypeInformation, TypeOperationAlfaMain } from '../interfaces/content-info';
import { CadastralChangeLog } from '../interfaces/bpm/cadastral-change-log';
import { OutFormatModel } from '../interfaces/out-format.model';
import { TaskRetailExecuteResponseModel } from '../interfaces/task-retail-execute-response.model';
import { DataFolio } from '../interfaces/information-property/snr-folio-info';
import { DataSource } from '../interfaces/information-property/snr-source-info';
import { DataPerson } from '../interfaces/information-property/snr-person-info';

export const GUION = '-';
export const SPACE = ' ';
export const TWO_POINT_ = ': ';
export const NAME_NA = 'N/A';
export const NAME_NO = 'NO';
export const NAME_DATE = 'date';
export const NAME_SI = 'SI';
export const NAME_NO_DISPONIBLE = 'N/D';
export const NAME_NO_DISPONIBLE_CERO = '0';

export const INDIVIDUAL_TYPE_NUMBER = 'NIT';
export const PAGE = 0;
export const PAGE_SIZE = 10;
export const PAGE_SIZE_TABLE_CADASTRAL = 10;
export const TITULO_PAGE_CADASTRAL = 'Búsqueda catastral';
export const URL_PAGE_CADASTRAL = 'Búsqueda catastral';

export const RULE_PAGE_CADASTRAL_DA = 'cadastralSearchDA';
export const TITULO_PAGE_CADASTRAL_DA = 'Búsqueda catastral DA';


export const MAX_PAGE_SIZE_TABLE_UNIQUE = 1000;
export const PAGE_SIZE_TABLE_UNIQUE = 10;
export const PAGE_SIZE_SORT = 5;
export const NAME_CODENAME = 'codeName';
export const FORMAT_CURRENCY_COP = 'COP';
export const FORMAT_CURRENCY_SIMBOL = 'symbol';
export const STRING_INFORMATION_NOT_FOUND = 'Información no disponible';

export const PAGE_OPTION__5_7_10: number[] = [5,7,10];
export const PAGE_OPTION__10_20_50_100: number[] = [10,20,50,100];

export const PAGE_OPTION_UNIQUE_7 = 7;
export const PAGE_OPTION_UNIQUE = 10;
export const PAGE_SIZE_OPTION: number[] = [ PAGE_OPTION_UNIQUE, 20, 50, 100];
export const PAGE_SIZE_OPTION_UNIQUE: number[] = [PAGE_OPTION_UNIQUE];
export const PAGE_SIZE_OPTION_ADDRESS: number[] = [5, PAGE_OPTION_UNIQUE];

export const PAGE_SIZE_SORT_FOLIO = 1;
export const PAGE_SIZE_OPTION_FOLIO: number[] = [2, 5];

export const STRUCTURE_HTML_HEADER = 
`<html>
  <head>
     {style}
  </head>
  <body>`;

export const STRUCTURE_HTML_FOOTER = `</body></html>`;



export const PANEL_ASSIGNED_TASKS = "assignedTasks";
export const PANEL_DEVOLUTION_TASKS = "returnedTasks";
export const PANEL_PRIORITIZED_TASKS = "prioritizedTasks";
export const PROCESO_CREAR_DIRECCION = "Nueva dirección";
export const PROCESO_ACTUALIZAR_DIRECCION = "Editar dirección";

export const CONSTANT_VALIDATE_CHECK = "checkStatusBpmOperation";
export const CONSTANT_VALIDATE_OTHER = "OTHER_CHECK";
export const LIMPIAR_CAMPOS_SELECCION_MUNICIPAL = "Seleccion Municipal";
export const LIMPIAR_CAMPOS_MULTIPLES_CAMPOS = "Multiplex Campos";

export const TYPEINFORMATION_EDITION: TypeInformation = 'edition';
export const TYPEINFORMATION_VISUAL: TypeInformation = 'visualization';
export const EVIRONMENT_CC_DIRECCION = '/ccDireccion';
export const ROL_GUEST = 'GUEST';
export const ROL_USER_READ = 'USER_READ';

export const EVIRONMENT_RETIRO_IMG = 'assets/img/logo/logo_El_retiro.png';
export const NAME_LOGO_IMG_SAN_VICENTE = 'logo_san_vicente.png';


export const TYPEOPERATION_ADD: TypeOperationAlfaMain = 'ADD' ;
export const TYPEOPERATION_CREATE: TypeOperationAlfaMain = 'CREATE';
export const TYPEOPERATION_DELETE: TypeOperationAlfaMain = 'DELETE';

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
    property: 'cadastralArea',
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
export const TABLE_COLUMN_DOCUMENT_ASOCIETY: TableColumn<OutFormatModel>[] = [
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
    visible: true,
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
    property: 'cadastralArea',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
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
  },


];
export const TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION: TableColumn<ContentInformationConstruction>[] = [
  ...TABLE_COLUMN_PROPERTIES_CONSTRUCTION_GENERAL,
  { label: 'Acciones', property: 'actions', type: 'button', visible: true }
];
export const TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS: TableColumn<ContentInformationConstruction>[] = TABLE_COLUMN_PROPERTIES_CONSTRUCTION_GENERAL;
export const LISTO_FORM_BPM_CORE: BasicComponentTemplate[] = [
  {
    name: 'cadAlfaMainComponent',
    pathForm : '/core/cadastral/alf/main.html',
    serviceValidation: 'checkStatusBpmOperation',
    mode: 1
  },
  {
    name: 'cadAlfaMainComponent',
    pathForm : '/core/cadastral/alf/validate.html',
    serviceValidation: 'checkStatusBpmOperation',
    mode: 2
  },
  {
    name: 'cadEcoCommitteeComponent',
    pathForm : '/core/cadastral/eco/comite.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadGeoMainComponent',
    pathForm : '/core/cadastral/geo/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadGeoValidateComponent',
    pathForm : '/core/cadastral/geo/validate.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadResMainComponent',
    pathForm : '/core/cadastral/res/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadResValidateComponent',
    pathForm : '/core/cadastral/res/validate.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadSynMainComponent',
    pathForm : '/core/cadastral/syn/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'cadVisitComponent',
    pathForm : '/core/cadastral/visita.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'docuMainComponent',
    pathForm : '/core/document/main.html',
    serviceValidation: '',
    mode: 1
  },
  {
    name: 'docuValidateComponent',
    pathForm : '/core/document/validate.html',
    serviceValidation: '',
    mode: 1
  },
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


export const NAME_VALIDITYVALUATIO =  'validityValuation';
export const NAME_CADASTRALVALUATIONA =  'cadastralValuationAt';
export const NAME_CADASTRALVALUATION =  'cadastralValuation';
export const NAME_CADASTRALVALUATIONLAND =  'cadastralValuationLand';
export const NAME_CADASTRALVALUATIONUNITS =  'cadastralValuationUnits';
export const NAME_COMMERCIALVALUATION =  'commercialValuation';
export const NAME_COMMERCIALVALUATIONLAND =  'commercialValuationLand';
export const NAME_COMMERCIALVALUATIONUNITS = 'commercialValuationUnits';
export const NAME_SELFVALUATIONVALUE =  'selfValuationValue';
export const DOMAIN_COLLETION_BPMPROCESSCATEGORY =  'BpmProcessCategory';


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
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Total',
    property: 'cadastralValuation',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Terreno',
    property: 'cadastralValuationLand',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Construcciones',
    property: 'cadastralValuationUnits',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Total',
    property: 'commercialValuation',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Terreno',
    property: 'commercialValuationLand',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Construcciones',
    property: 'commercialValuationUnits',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1 pr-1'],
    cssClasses: ['font-medium','pl-1 pr-1']
  },
  {
    label: 'Total',
    property: 'selfValuationValue',
    type: 'currency',
    visible: true,
    cssClassesHead: ['pl-1'],
    cssClasses: ['font-medium', 'pl-1']
  },
];

export const LIST_SCHEMAS_CONTROL_MAIN: string[] = [`${environment.schemas.main}`];
export const LIST_SCHEMAS_CONTROL_TEMP: string[] = [`${environment.schemas.temp}`];
export const LIST_SCHEMAS_CONTROL_CHANGES: string[] = [`${environment.schemas.temp}`,`${environment.schemas.main}`];
export const LIST_SCHEMAS_CONTROL_HISTORY: string[] = [`${environment.schemas.main}`,`${environment.schemas.hist}`];

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
  'header-row-first-group', 'header-row-second-group', 'header-row-third-group','header-row-quartet-group'
];

export const NAVIGATION_ITEMS_INFORMACION_PROPERTIY: { label: string; fragment: string }[] = [
  {
    label: 'Aspectos generales',
    fragment: 'basicPropertyInformationComponent'
  },
  {
    label: 'Información de unidad predial',
    fragment: 'informationUnitPropertyComponent'
  },
  {
    label: 'Fuentes administrativas',
    fragment: 'administrativeSourcesComponent'
  },
  {
    label: 'Propietarios',
    fragment: 'informationPropertyOwnersComponent'
  },
  {
    label: 'Super notariado',
    fragment: 'superNotariadoPropertyComponent'
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
    label: 'Avalúos',
    fragment: 'propertyAppraisalInformationComponent'
  },
  {
    label: 'Zonas',
    fragment: 'informationZonesPropertyComponent'
  },
  {
    label: 'Fotos',
    fragment: 'photosComponent'
  },
  {
    label: 'Alertas',
    fragment: 'alertsComponent'
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
  },
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

export const REFERENCE_COMPONENTS: string[] = ['GNR', 'FNA', 'PRO', 'CNS', 'DIR'];

export const MODAL_LARGE ={ maxWidth: '100%', width: '98%', minHeight: '100%', height: '98%' };
export const MODAL_MEDIUM ={ maxWidth: '100%', width: '80%', minHeight: '80%', height: '80%' };
export const MODAL_SMALL ={ maxWidth: '100%', width: '60%', minHeight: '60%', height: '60%' };
