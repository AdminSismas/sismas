import {
  CERTIFICATE_USERS_ROLE_LIST,
  EXECUTIONERS_ROLE_LIST_WITHOUT_USER_TRAM,
  NOT_USER_SERV_AND_USER_TRAM,
  TOP_ROLE_LIST
} from 'src/app/apps/constants/general/constants';
import {
  NavigationDropdown,
  NavigationLink
} from '../../core/navigation/navigation-item.interface';

export const NAVIGATION_LOADER_MY_WORK_1: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  {
    type: 'link',
    label: 'Búsqueda catastral',
    route: '/myWork/cadastralSearch',
    icon: 'mat:search'
  },
  {
    type: 'link',
    label: 'Radicar trámite',
    route: '/myWork/fileProcedure',
    icon: 'mat:app_registration'
  },
  {
    type: 'link',
    label: 'Asistentes virtuales',
    route: '/myWork/assistants',
    icon: 'mat:insights'
  },
  {
    type: 'link',
    label: 'Soporte',
    route: '/myWork/support',
    icon: 'mat:contact_support'
  }
];

export const NAVIGATION_LOADER_MY_WORK_2: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  {
    type: 'dropdown',
    label: 'Tareas',
    icon: 'mat:task_alt',
    badge: {
      value: '0',
      bgClass: 'bg-green-600',
      textClass: 'text-white'
    },
    children: [
      {
        type: 'link',
        label: 'Activas',
        route: '/myWork/tasks/tasksPanel/assignedTasks',
        routerLinkActiveOptions: { exact: true },
        badge: {
          value: '0',
          bgClass: 'bg-teal-600',
          textClass: 'text-white'
        }
      },
      {
        type: 'link',
        label: 'Priorizadas',
        route: '/myWork/tasks/tasksPanel/prioritizedTasks',
        routerLinkActiveOptions: { exact: true },
        badge: {
          value: '0',
          bgClass: 'bg-purple-600',
          textClass: 'text-white'
        }
      },
      {
        type: 'link',
        label: 'Devueltas',
        route: '/myWork/tasks/tasksPanel/returnedTasks',
        routerLinkActiveOptions: { exact: true },
        badge: {
          value: '0',
          bgClass: 'bg-cyan-600',
          textClass: 'text-white'
        }
      }
    ]
  }
];
export const NAVIGATION_LOADER_MY_WORK_3: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  //   {
  //     type: 'link',
  //     label: 'Búsqueda catastral',
  //     route: '/myWork/cadastralSearch',
  //     icon: 'mat:search'
  //   },
  //   {
  //     type: 'link',
  //     label: 'Radicar trámite',
  //     route: '/myWork/fileProcedure',
  //     icon: 'mat:app_registration'
  //   },
];
export const NAVIGATION_LOADER_MY_WORK: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  ...NAVIGATION_LOADER_MY_WORK_1,
  ...NAVIGATION_LOADER_MY_WORK_2,
  ...NAVIGATION_LOADER_MY_WORK_3
];

export const NAVIGATION_LOADER_OPERATION_SUPPORT: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  {
    type: 'link',
    label: 'Personas',
    route: '/operationSupport/people',
    icon: 'mat:search'
  },
  {
    type: 'dropdown',
    label: 'Trámites',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Priorizar trabajo',
        route: '/operationSupport/procedures/prioritizeWork',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Trabajo en ejecución',
        route: '/operationSupport/procedures/workProgress',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Trabajo finalizado',
        route: '/operationSupport/procedures/workFinished',
        routerLinkActiveOptions: { exact: true }
      },
      // {
      //   type: 'link',
      //   label: 'Trabajo histórico',
      //   route: '/operationSupport/procedures/workHistorical',
      //   routerLinkActiveOptions: { exact: true }
      // }
    ]
  },
  {
    type: 'link',
    label: 'Asignación de trabajo',
    route: '/operationSupport/workAssignment',
    icon: 'mat:assignment_turned_in'
  },
  {
    type: 'dropdown',
    label: 'Reportes',
    icon: 'mat:insert_drive_file',
    children: [
      {
        type: 'link',
        label: 'Analítica de la operación',
        route: '/operationSupport/reports/operationalAnalytics',
        icon: 'mat:task_alt',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Descarga de reportes',
        route: '/operationSupport/reports/downloadReports',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Descarga de XTF',
        route: '/operationSupport/reports/downloadXTF',
        routerLinkActiveOptions: { exact: true }
      }
    ],
    roles: EXECUTIONERS_ROLE_LIST_WITHOUT_USER_TRAM
  }
];

export const NAVIGATION_LOADER_OPEN_DATA: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  {
    type: 'link',
    label: 'Mapas generales',
    route: '/openData/generalMaps',
    icon: 'mat:search'
  },
  {
    type: 'link',
    label: 'Búsqueda catastral (DA)',
    route: '/openData/cadastralSearchDA',
    icon: 'mat:app_registration'
  },
  {
    type: 'dropdown',
    label: 'Descargas',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Geodatabase',
        route: '/openData/downloads/geodatabase',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Alfanuméricas',
        route: '/openData/downloads/alphanumeric',
        routerLinkActiveOptions: { exact: true }
      }
    ],
    roles: TOP_ROLE_LIST
  }
];

export const NAVIGATION_LOADER_PUBLIC_SERVICE: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  {
    type: 'dropdown',
    label: 'Ciudadanos',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Validar actos administrativos',
        route: '/publicService/citizens/validateAdministrativeActs',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Validar certificados',
        route: '/publicService/citizens/validateCertificates',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Generar servicios',
        route: '/publicService/citizens/generateServices',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Histórico de servicios',
        route: '/publicService/citizens/serviceHistory',
        routerLinkActiveOptions: { exact: true }
      }
    ],
    roles: NOT_USER_SERV_AND_USER_TRAM
  },
  {
    type: 'dropdown',
    label: 'Taquilla',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Generar servicios',
        route: '/publicService/ticketOffice/generateServices',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Histórico de servicios',
        route: '/publicService/ticketOffice/serviceHistory',
        routerLinkActiveOptions: { exact: true }
      }
    ],
    roles: CERTIFICATE_USERS_ROLE_LIST
  }
];

export const NAVIGATION_LOADER_CONFIGURATION: (
  | NavigationLink
  | NavigationDropdown
)[] = [
  {
    type: 'dropdown',
    label: 'Catastral',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Dominio LADM_COL',
        route: '/configuration/cadastral/domainLADM_COL',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Secuencias',
        route: '/configuration/cadastral/sequences',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Servicios y tarifas',
        route: '/configuration/cadastral/servicesRates',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Mod económico terreno',
        route: '/configuration/cadastral/economicModLand',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Mod económico construcción',
        route: '/configuration/cadastral/economicModConstruction',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Mod económico integral',
        route: '/configuration/cadastral/integralEconomicMod',
        routerLinkActiveOptions: { exact: true }
      }
    ]
  },
  {
    type: 'dropdown',
    label: 'General',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Usuarios',
        route: '/configuration/general/users',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Calendario',
        route: '/configuration/general/calendar',
        routerLinkActiveOptions: { exact: true }
      }
    ]
  },
  {
    type: 'dropdown',
    label: 'Trámites catastrales',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Documentos entrada',
        route: '/configuration/cadastralProcedures/entryDocuments',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Flujo de trabajo',
        route: '/configuration/cadastralProcedures/workflowProcedures',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Grupos de trabajo',
        route: '/configuration/cadastralProcedures/workgroups',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Documentos asociados a trámites',
        route:
          '/configuration/cadastralProcedures/documentsAssociatedProcedures',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Formatos de salida',
        route: '/configuration/cadastralProcedures/outputFormats',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Firmas digitalizadas',
        route: '/configuration/cadastralProcedures/digitalizedSignatures',
        routerLinkActiveOptions: { exact: true }
      }
    ]
  }
];

export const NAVIGATION_LOADER_AUDIT: (NavigationLink | NavigationDropdown)[] =
  [
    {
      type: 'link',
      label: 'Registros de acceso',
      route: '/audit/accessRecords',
      icon: 'mat:search'
    },
    {
      type: 'link',
      label: 'Registros de gestión catastral',
      route: '/audit/cadastralManagementRecords',
      icon: 'mat:app_registration'
    }
  ];

export const NAVIGATION_THEMATIC_MAP: (NavigationLink | NavigationDropdown)[] =
  [
    {
      type: 'link',
      label: 'Mapa',
      route: '/thematicMap/map',
      icon: 'mat:map'
    }
  ];

// export const NAVIGATION_LOADER_IA: Array<NavigationLink | NavigationDropdown> = [
//   {
//     type: 'link',
//     label: 'Asistentes virtuales',
//     route: '/ia/assistants',
//     icon: 'mat:insights'
//   }
// ];
