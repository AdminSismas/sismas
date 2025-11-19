import { Injectable } from '@angular/core';
import { AlfaMainComponent } from '@pages/bpm/core/cadastral/alf/main/alfa-main.component';
import { AlfaValidateComponent } from '@pages/bpm/core/cadastral/alf/validate/alfa-validate.component';
import { EcoComiteComponent } from '@pages/bpm/core/cadastral/eco/comite/eco-comite.component';
import { GeoMainComponent } from '@features/bpm-workflows/components/geo-main/geo-main.component';
import { GeoValidateComponent } from '@pages/bpm/core/cadastral/geo/validate/geo-validate.component';
import { ResMainComponent } from '@pages/bpm/core/cadastral/res/main/res-main.component';
import { ResValidateComponent } from '@pages/bpm/core/cadastral/res/validate/res-validate.component';
import { SynMainComponent } from '@pages/bpm/core/cadastral/syn/main/syn-main.component';
import { DocumentMainComponent } from '@pages/bpm/core/document/main/document-main.component';
import { DocumentValidateComponent } from '@pages/bpm/core/document/validate/document-validate.component';
import { ComponentTemplate } from '@features/bpm-workflows/models/render-template.types';
import {
  COMPONENT_ALFA_MAIN,
  COMPONENT_ALFA_VALIDATE
} from '@shared/constants/constants';
import { CitationAndNoticeComponent } from '@pages/bpm/core/citation-and-notice/citation-and-notice.component';
import { RecognitionPropertyInformationComponent } from '@pages/bpm/core/cadastral/recognition-property-information/recognition-property-information.component';
import { CompleteDocsComponent } from '@pages/bpm/core/cadastral/res/complete/complete-docs.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentsService {
  _listMap: ComponentTemplate[] = [
    {
      nameComponent: COMPONENT_ALFA_MAIN,
      component: AlfaMainComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/alf/main/alfa-main.component'
        ).then((m) => m.AlfaMainComponent)
    },
    {
      nameComponent: COMPONENT_ALFA_VALIDATE,
      component: AlfaValidateComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/alf/validate/alfa-validate.component'
        ).then((m) => m.AlfaValidateComponent)
    },
    {
      nameComponent: 'cadEcoCommitteeComponent',
      component: EcoComiteComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/eco/comite/eco-comite.component'
        ).then((m) => m.EcoComiteComponent)
    },
    {
      nameComponent: 'cadGeoMainComponent',
      component: GeoMainComponent,
      loadComponent: () =>
        import(
          '@features/bpm-workflows/components/geo-main/geo-main.component'
        ).then((m) => m.GeoMainComponent)
    },
    {
      nameComponent: 'cadGeoValidateComponent',
      component: GeoValidateComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/geo/validate/geo-validate.component'
        ).then((m) => m.GeoValidateComponent)
    },
    {
      nameComponent: 'cadResMainComponent',
      component: ResMainComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/res/main/res-main.component'
        ).then((m) => m.ResMainComponent)
    },
    {
      nameComponent: 'cadResValidateComponent',
      component: ResValidateComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/res/validate/res-validate.component'
        ).then((m) => m.ResValidateComponent)
    },
    {
      nameComponent: 'cadSynMainComponent',
      component: SynMainComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/syn/main/syn-main.component'
        ).then((m) => m.SynMainComponent)
    },
    {
      nameComponent: 'cadRecognitionPropertyInformation',
      component: RecognitionPropertyInformationComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/recognition-property-information/recognition-property-information.component'
        ).then((m) => m.RecognitionPropertyInformationComponent)
    },
    {
      nameComponent: 'docuMainComponent',
      component: DocumentMainComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/document/main/document-main.component'
        ).then((m) => m.DocumentMainComponent)
    },
    {
      nameComponent: 'docuValidateComponent',
      component: DocumentValidateComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/document/validate/document-validate.component'
        ).then((m) => m.DocumentValidateComponent)
    },
    {
      nameComponent: 'cadResNoProcedeComponent',
      component: ResValidateComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/res/validate/res-validate.component'
        ).then((m) => m.ResValidateComponent)
    },
    {
      nameComponent: 'cadValidateCompleteDocsComponent',
      component: ResValidateComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/res/validate/res-validate.component'
        ).then((m) => m.ResValidateComponent)
    },
    {
      nameComponent: 'cadCompleteDocsComponent',
      component: CompleteDocsComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/cadastral/res/complete/complete-docs.component'
        ).then((m) => m.CompleteDocsComponent)
    },
    {
      nameComponent: 'citationAndNoticeComponent',
      component: CitationAndNoticeComponent,
      loadComponent: () =>
        import(
          '@pages/bpm/core/citation-and-notice/citation-and-notice.component'
        ).then((m) => m.CitationAndNoticeComponent)
    }
  ];

  getDynamicComponents() {
    return this._listMap;
  }
}
