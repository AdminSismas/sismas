import { EditBasicPropertyInputs } from '../../interfaces/general/content-info';

export const FORM_INPUT_BASIC_PROPERTY: EditBasicPropertyInputs[] = [
  // GRUPO "Identificación del predio"
  {
    groupName: 'Identificación del predio',
    fields: [
      {
        name: 'propertyRegistryOffice',
        label: 'Oficina de registro',
        collection: false,
        type: 'text',
        placeholder: 'Oficina de registro',
        group: [],
        groupName: 'Identificación del predio'
      },
      {
        name: 'propertyRegistryNumber',
        label: 'Número de registro',
        collection: false,
        type: 'text',
        placeholder: 'Número de registro',
        group: [],
        groupName: 'Identificación del predio'
      },
      {
        name: 'cadastralNumber',
        label: 'Número predial',
        collection: false,
        type: 'text',
        placeholder: 'Número predial',
        group: [],
        groupName: 'Identificación del predio'
      },
      {
        name: 'cadastralLastNumber',
        label: 'Número predial anterior',
        collection: false,
        type: 'number',
        placeholder: 'Número predial anterior',
        group: [],
        groupName: 'Identificación del predio'
      },
      // *********** estos dos campo contituyen matricula inmobiliaria**********
      // *********** estos dos campo contituyen matricula inmobiliaria**********
      {
        name: 'baunitIdOrigin',
        label: 'Nupre',
        collection: false,
        type: 'text',
        placeholder: 'Nupre',
        group: [],
        groupName: 'Identificación del predio'
      }
    ]
  },
  {
    groupName: 'Propiedad y uso',
    fields: [
      // *****GRUPO "Propiedad y uso" ****
      {
        // DEBE SER LISTA TIPO
        name: 'domBaunitEconoDesti',
        label: 'Destino económico',
        collection: true,
        type: 'BaunitEconoDesti',
        placeholder: 'Destino económico',
        group: [],
        groupName: 'Propiedad y uso'
      },
      // DEBE SER LISTA TIPO
      {
        name: 'domBaunitType',
        label: 'Tipo',
        collection: true,
        type: 'BaunitType',
        placeholder: 'Tipo',
        group: [],
        groupName: 'Propiedad y uso'
      },
      {
        // DEBE SER LISTA TIPO
        name: 'domBaunitCondition',
        label: 'Condición propiedad',
        collection: true,
        type: 'BaunitCondition',
        placeholder: 'Condición propiedad',
        group: ['matriz', 'unidad predial'],
        groupName: 'Propiedad y uso'
      },
      {
        name: 'cadastralCreatedAt',
        label: 'Inscripción catastral',
        collection: false,
        type: 'date',
        placeholder: 'Inscripción catastral',
        group: [],
        groupName: 'Propiedad y uso'
      },
      {
        name: 'cadastralRegistryNumberTemp',
        label: 'Código homologado',
        collection: false,
        type: 'text',
        placeholder: 'Código homologado',
        group: [],
        groupName: 'Propiedad y uso'
      }
    ]
  },
  {
    groupName: 'Tamaños y áreas',
    fields: [
      // *****GRUPO "Tamaños y áreas" ****

      {
        name: 'propertyRegistryArea',
        label: 'Área registral',
        collection: false,
        type: 'text',
        placeholder: 'Área registral',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: '(espacio vacio)',
        label: '',
        collection: false,
        type: '',
        placeholder: '',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: 'cadAreaPrivate',
        label: 'Área catastral privada',
        collection: false,
        type: 'text',
        placeholder: 'Área catastral privada',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: 'cadAreaCommon',
        label: 'Área catastral común',
        collection: false,
        type: 'text',
        placeholder: 'Área catastral común',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: 'cadastralArea',
        label: 'Área catastral',
        collection: false,
        type: 'text',
        placeholder: 'Área catastral',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: 'cadAreaUnitbuiltPrivate',
        label: 'Área catastral construida Privada',
        collection: false,
        type: 'text',
        placeholder: 'Área catastral construida Privada',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: 'cadAreaUnitbuiltCommon',
        label: 'Área catastral construida común',
        collection: false,
        type: 'text',
        placeholder: 'Área catastral construida común',
        group: [],
        groupName: 'Tamaños y áreas'
      },
      {
        name: 'cadastralAreaUnitbuilt',
        label: 'Área catastral construida',
        collection: false,
        type: 'text',
        placeholder: 'Área catastral construida',
        group: [],
        groupName: 'Tamaños y áreas'
      }
    ]
  }
];
