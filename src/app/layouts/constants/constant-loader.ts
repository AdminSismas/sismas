import { NavigationDropdown, NavigationLink } from '../../core/navigation/navigation-item.interface';

export const NAVIGATION_LOADER_MY_WORK_1: Array<NavigationLink | NavigationDropdown> = [
  {
    type: 'link',
    label: 'Búsqueda catastral',
    route: '/myWork/cadastralSearch',
    icon: 'mat:search'
  },
  {
    type: 'link',
    label: 'Radicar Trámite',
    route: '/myWork/fileProcedure',
    icon: 'mat:app_registration'
  },
];

export const NAVIGATION_LOADER_MY_WORK_2: Array<NavigationLink | NavigationDropdown> = [
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
  },
];
export const NAVIGATION_LOADER_MY_WORK_3: Array<NavigationLink | NavigationDropdown> = [
  {
    type: 'link',
    label: 'Búsqueda catastral',
    route: '/myWork/cadastralSearch',
    icon: 'mat:search'
  },
  {
    type: 'link',
    label: 'Radicar Trámite',
    route: '/myWork/fileProcedure',
    icon: 'mat:app_registration'
  },
];
export const NAVIGATION_LOADER_MY_WORK: Array<NavigationLink | NavigationDropdown> = [
  ...NAVIGATION_LOADER_MY_WORK_1,
  ...NAVIGATION_LOADER_MY_WORK_2,
  ...NAVIGATION_LOADER_MY_WORK_3,
];

export const NAVIGATION_LOADER_OPERATION_SUPPORT: Array<NavigationLink | NavigationDropdown> = [
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
        label: 'Priorizar Trabajo',
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
      }
    ]
  },
  {
    type: 'link',
    label: 'Información histórica',
    route: '/operationSupport/historicalInformation',
    icon: 'mat:app_registration'
  },
  {
    type: 'link',
    label: 'Asignación de trabajo',
    route: '/operationSupport/workAssignment',
    icon: 'mat:assignment_turned_in'
  },
  {
    type: 'link',
    label: 'Analítica de la Operación',
    route: '/operationSupport/operationalAnalytics',
    icon: 'mat:task_alt'
  }
];

export const NAVIGATION_LOADER_OPEN_DATA: Array<NavigationLink | NavigationDropdown> = [
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
    ]
  }
];

export const NAVIGATION_LOADER_PUBLIC_SERVICE: Array<NavigationLink | NavigationDropdown> = [
  {
    type: 'dropdown',
    label: 'Ciudadanos',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Validar Actos administrativos',
        route: '/publicService/citizens/validateAdministrativeActs',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Validar Certificados',
        route: '/publicService/citizens/validateCertificates',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Generar Servicios',
        route: '/publicService/citizens/generateServices',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Histórico de Servicios',
        route: '/publicService/citizens/serviceHistory',
        routerLinkActiveOptions: { exact: true }
      }
    ]
  },
  {
    type: 'dropdown',
    label: 'Taquilla',
    icon: 'mat:pending',
    children: [
      {
        type: 'link',
        label: 'Generar Servicios',
        route: '/publicService/ticketOffice/generateServices',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Histórico de Servicios',
        route: '/publicService/ticketOffice/serviceHistory',
        routerLinkActiveOptions: { exact: true }
      }
    ]
  }
];

export const NAVIGATION_LOADER_CONFIGURATION: Array<NavigationLink | NavigationDropdown> = [
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
        label: 'Servicios y Tarifas',
        route: '/configuration/cadastral/servicesRates',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Mod Económico Terreno',
        route: '/configuration/cadastral/economicModLand',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Mod Económico Construcción',
        route: '/configuration/cadastral/economicModConstruction',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Mod Económico Integral',
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
        route: '/configuration/cadastralProcedures/documentsAssociatedProcedures',
        routerLinkActiveOptions: { exact: true }
      },
      {
        type: 'link',
        label: 'Formatos de Salida',
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

export const NAVIGATION_LOADER_AUDIT: Array<NavigationLink | NavigationDropdown> = [
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
