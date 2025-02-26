import { Modulo } from "../interfaces/module.model";


export const MODULES: Modulo[] = [
  {
    id: 1,
    modulo: 'Mi trabajo',
    vistas: [
      { id: 1, nombre_vista: 'Búsqueda catastral' },
      { id: 2, nombre_vista: 'Rádicar tramite' },
      { id: 3, nombre_vista: 'Asistentes virtuales' },
      { id: 4, nombre_vista: 'Soporte' },
      {
        id: 5,
        nombre_vista: 'Tareas',
        subvistas: [
          { id: 1, nombre_subvista: 'Activas' },
          { id: 2, nombre_subvista: 'Priorizadas' },
          { id: 3, nombre_subvista: 'Devueltas' }
        ]
      }
    ]
  },
  {
    id: 2,
    modulo: 'Apoyo operación',
    vistas: [
      { id: 6, nombre_vista: 'Personas' },
      {
        id: 7,
        nombre_vista: 'Trámites',
        subvistas: [
          { id: 1, nombre_subvista: 'Priorizar trabajo' },
          { id: 2, nombre_subvista: 'Trabajo en ejecución' },
          { id: 3, nombre_subvista: 'Trabajo finalizado' }
        ]
      },
      { id: 8, nombre_vista: 'Información histórica' },
      { id: 9, nombre_vista: 'Asignación de trabajo' },
      { id: 10, nombre_vista: 'Analítica de la operación' }
    ]
  },
  {
    id: 3,
    modulo: 'Datos abiertos',
    vistas: [
      { id: 11, nombre_vista: 'Mapas generales' },
      { id: 12, nombre_vista: 'Búsqueda catastral (DA)' },
      {
        id: 13,
        nombre_vista: 'Descargas',
        subvistas: [
          { id: 4, nombre_subvista: 'Geodatabase' },
          { id: 5, nombre_subvista: 'Alfanuméricas' }
        ]
      }
    ]
  },
  {
    id: 4,
    modulo: 'Servicio público',
    vistas: [
      {
        id: 14,
        nombre_vista: 'Ciudadanos',
        subvistas: [
          { id: 6, nombre_subvista: 'Validar actos administrativos' },
          { id: 7, nombre_subvista: 'Validar certificados' },
          { id: 8, nombre_subvista: 'Generar servicios' },
          { id: 9, nombre_subvista: 'Histórico de servicios' }
        ]
      },
      {
        id: 15,
        nombre_vista: 'Taquilla',
        subvistas: [
          { id: 10, nombre_subvista: 'Generar servicios' },
          { id: 11, nombre_subvista: 'Histórico de servicios' }
        ]
      }
    ]
  },
  {
    id: 5,
    modulo: 'Configuración',
    vistas: [
      {
        id: 16,
        nombre_vista: 'Catastral',
        subvistas: [
          { id: 12, nombre_subvista: 'Dominio LADM_COL' },
          { id: 13, nombre_subvista: 'Secuencias' },
          { id: 14, nombre_subvista: 'Servicios y tarifas' },
          { id: 15, nombre_subvista: 'Mod económico terreno' },
          { id: 16, nombre_subvista: 'Mod económico construcción' },
          { id: 17, nombre_subvista: 'Mod económico integral' }
        ]
      },
      {
        id: 17,
        nombre_vista: 'General',
        subvistas: [
          { id: 18, nombre_subvista: 'Usuarios' },
          { id: 19, nombre_subvista: 'Calendario' }
        ]
      },
      {
        id: 18,
        nombre_vista: 'Trámites catastrales',
        subvistas: [
          { id: 20, nombre_subvista: 'Documentos entrada' },
          { id: 21, nombre_subvista: 'Flujo de trabajo' },
          { id: 22, nombre_subvista: 'Grupos de trabajo' },
          { id: 23, nombre_subvista: 'Documentos asociados a trámites' },
          { id: 24, nombre_subvista: 'Formatos de salida' },
          { id: 25, nombre_subvista: 'Firmas digitalizadas' }
        ]
      }
    ]
  },
  {
    id: 6,
    modulo: 'Auditoría',
    vistas: [
      { id: 19, nombre_vista: 'Registros de acceso' },
      { id: 20, nombre_vista: 'Registros de gestión catastral' }
    ]
  }
];
