import { Injectable, Injector } from '@angular/core';
import { AlfaMainComponent } from '../../../pages/pages/bpm/core/cadastral/alf/main/alfa-main.component';
import { AlfaValidateComponent } from '../../../pages/pages/bpm/core/cadastral/alf/validate/alfa-validate.component';
import { EcoComiteComponent } from '../../../pages/pages/bpm/core/cadastral/eco/comite/eco-comite.component';
import { GeoMainComponent } from '../../../pages/pages/bpm/core/cadastral/geo/main/geo-main.component';
import { GeoValidateComponent } from '../../../pages/pages/bpm/core/cadastral/geo/validate/geo-validate.component';
import { ResMainComponent } from '../../../pages/pages/bpm/core/cadastral/res/main/res-main.component';
import { ResValidateComponent } from '../../../pages/pages/bpm/core/cadastral/res/validate/res-validate.component';
import { SynMainComponent } from '../../../pages/pages/bpm/core/cadastral/syn/main/syn-main.component';
import { VisitaComponent } from '../../../pages/pages/bpm/core/cadastral/visita/visita.component';
import { DocumentMainComponent } from '../../../pages/pages/bpm/core/document/main/document-main.component';
import { DocumentValidateComponent } from '../../../pages/pages/bpm/core/document/validate/document-validate.component';
import { ComponentTemplate } from '../../interfaces/bpm/render-template.types';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentsService {

  constructor() {
  }

  _listMap: ComponentTemplate[] = [
    {
      nameComponent: 'cadAlfaMainComponent',
      component:AlfaMainComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/alf/main/alfa-main.component').then(
        (m) => m.AlfaMainComponent
      ),
    },
    {
      nameComponent: 'cadAlfaValidateComponent',
      component:AlfaValidateComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/alf/validate/alfa-validate.component').then(
        (m) => m.AlfaValidateComponent
      ),
    },
    {
      nameComponent: 'cadEcoCommitteeComponent',
      component:EcoComiteComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/eco/comite/eco-comite.component').then(
        (m) => m.EcoComiteComponent
      ),
    },
    {
      nameComponent: 'cadGeoMainComponent',
      component:GeoMainComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/geo/main/geo-main.component').then(
        (m) => m.GeoMainComponent
      ),
    },
    {
      nameComponent: 'cadGeoValidateComponent',
      component:GeoValidateComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/geo/validate/geo-validate.component').then(
        (m) => m.GeoValidateComponent
      ),
    },
    {
      nameComponent: 'cadResMainComponent',
      component:ResMainComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/res/main/res-main.component').then(
        (m) => m.ResMainComponent
      ),
    },
    {
      nameComponent: 'cadResValidateComponent',
      component:ResValidateComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/res/validate/res-validate.component').then(
        (m) => m.ResValidateComponent
      ),
    },
    {
      nameComponent: 'cadSynMainComponent',
      component:SynMainComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/syn/main/syn-main.component').then(
        (m) => m.SynMainComponent
      ),
    },
    {
      nameComponent: 'cadVisitComponent',
      component:VisitaComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/cadastral/visita/visita.component').then(
        (m) => m.VisitaComponent
      ),
    },
    {
      nameComponent: 'docuMainComponent',
      component:DocumentMainComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/document/main/document-main.component').then(
        (m) => m.DocumentMainComponent
      ),
    },
    {
      nameComponent: 'docuValidateComponent',
      component:DocumentValidateComponent,
      loadComponent: () => import('../../../pages/pages/bpm/core/document/validate/document-validate.component').then(
        (m) => m.DocumentValidateComponent
      ),
    }
  ];

  getDynamicComponents() {
    return this._listMap;
  }
}
