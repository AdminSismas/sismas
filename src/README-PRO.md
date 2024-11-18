<div style="margin-bottom: 2rem;">
<img style="float: left; height: 80px; width: unset; margin: 0;" src="..\src\assets\img\illustrations\it_support.svg" alt="Vex Logo"/>
</div>
<div style="margin-bottom: 2rem;">
<h1 style="height: 80px; line-height: 80px; margin: 70px; font-weight: 800; border: none; font-size: 3rem; padding-left: 70px;">GEOGESTION</h1>
</div>

# Introduction

Sistema catastral llamado GeoGestion actualmente está creado con el framework angular 17+ y con el template siguiente:
https://vex.visurel.com/ui/components/overview, obtenido de la siguiente Url: https://themeforest.net/item/daxa-material-design-angular-admin-dashboard-template/50912112

# Getting Started

> Actualmente, el código del sistema se encuentra en el repositorio https://github.com/agency-cic/GeoGestion.git, el cual es privado y para poder trabajar sobre este mismo
> se debe solicitar permisos.
>
> En el momento de descarga del proyecto, se debe ejecutar el siguiente comando `npm install` dicho comando se encargará de instalar los paquetes necesarios para poder
> ejecutar el aplicativo.

## Folder Structure of Proyects APP and Test

Actualmente, esta es la estructura base del proyecto teniendo en cuenta que la configuración inicial del proyecto se encuentra en la carpeta
@vex, en la cual está todo el tema del Layout que componen en aplicativo

```
├───src/
│   ├───@vex/
│   ├───app/
│   │   ├───apps/
│   │   │   ├───components/
│   │   │   │   ├───in-construction/
│   │   │   │   │   ├───in-construction.component.html
│   │   │   │   │   ├───in-construction.component.scss
│   │   │   │   │   └───in-construction.component.ts
│   │   │   │   └───table-cadastral-search/
│   │   │   │       ├───filter-cadastral-search/
│   │   │   │       │   ├───filter-cadastral-search.component.html
│   │   │   │       │   ├───filter-cadastral-search.component.scss
│   │   │   │       │   └───filter-cadastral-search.component.ts
│   │   │   │       ├───interfaces/
│   │   │   │       │   ├───baunit-head.model.ts
│   │   │   │       │   ├───information-pegeable.model.ts
│   │   │   │       │   ├───page-search-data.model.ts
│   │   │   │       │   ├───pegeable.model.ts
│   │   │   │       │   └───search-data.model.ts
│   │   │   │       ├───table-cadastral-search.component.html
│   │   │   │       ├───table-cadastral-search.component.scss
│   │   │   │       └───table-cadastral-search.component.ts
│   │   │   ├───constants/
│   │   │   │   └───constant.ts
│   │   │   └───services/
│   │   │       ├───info-table.service.ts
│   │   │       └───send-general-requests.service.ts
│   │   ├───config/
│   │   │   └───interceptors/
│   │   │       └───token.interceptor.ts
│   │   ├───core/
│   │   │   ├───icons/
│   │   │   │   ├───icons.provider.ts
│   │   │   │   └───icons.service.ts
│   │   │   ├───luxon/
│   │   │   │   ├───luxon.provider.ts
│   │   │   │   └───luxon.service.ts
│   │   │   └───navigation/
│   │   │       ├───navigation-item.interface.ts
│   │   │       ├───navigation-loader.service.ts
│   │   │       ├───navigation.provider.ts
│   │   │       └───navigation.service.ts
│   │   ├───layouts/
│   │   │   ├───base-layout/
│   │   │   │   ├───base-layout.component.html
│   │   │   │   ├───base-layout.component.scss
│   │   │   │   └───base-layout.component.ts
│   │   │   ├───components/
│   │   │   │   ├───config-panel/
│   │   │   │   │   ├───config-panel-toggle/
│   │   │   │   │   │   ├───config-panel-toggle.component.html
│   │   │   │   │   │   ├───config-panel-toggle.component.scss
│   │   │   │   │   │   └───config-panel-toggle.component.ts
│   │   │   │   │   ├───config-panel.component.html
│   │   │   │   │   ├───config-panel.component.scss
│   │   │   │   │   └───config-panel.component.ts
│   │   │   │   ├───footer/
│   │   │   │   │   ├───footer.component.html
│   │   │   │   │   ├───footer.component.scss
│   │   │   │   │   └───footer.component.ts
│   │   │   │   ├───navigation/
│   │   │   │   │   ├───navigation-item/
│   │   │   │   │   │   ├───navigation-item.component.html
│   │   │   │   │   │   ├───navigation-item.component.scss
│   │   │   │   │   │   └───navigation-item.component.ts
│   │   │   │   │   ├───navigation.component.html
│   │   │   │   │   ├───navigation.component.scss
│   │   │   │   │   └───navigation.component.ts
│   │   │   │   ├───quickpanel/
│   │   │   │   │   ├───quickpanel.component.html
│   │   │   │   │   ├───quickpanel.component.scss
│   │   │   │   │   └───quickpanel.component.ts
│   │   │   │   ├───sidenav/
│   │   │   │   │   ├───search-modal/
│   │   │   │   │   │   └───search-modal.component.ts
│   │   │   │   │   ├───sidenav-item/
│   │   │   │   │   │   ├───sidenav-item.component.html
│   │   │   │   │   │   ├───sidenav-item.component.scss
│   │   │   │   │   │   └───sidenav-item.component.ts
│   │   │   │   │   ├───sidenav-user-menu/
│   │   │   │   │   │   ├───sidenav-user-menu.component.html
│   │   │   │   │   │   ├───sidenav-user-menu.component.scss
│   │   │   │   │   │   └───sidenav-user-menu.component.ts
│   │   │   │   │   ├───sidenav.component.html
│   │   │   │   │   ├───sidenav.component.scss
│   │   │   │   │   └───sidenav.component.ts
│   │   │   │   └───toolbar/
│   │   │   │       ├───mega-menu/
│   │   │   │       │   ├───mega-menu.component.html
│   │   │   │       │   └───mega-menu.component.ts
│   │   │   │       ├───search/
│   │   │   │       │   ├───search.component.html
│   │   │   │       │   ├───search.component.scss
│   │   │   │       │   ├───search.component.ts
│   │   │   │       │   └───search.service.ts
│   │   │   │       ├───toolbar-notifications/
│   │   │   │       │   ├───interfaces/
│   │   │   │       │   │   └───notification.interface.ts
│   │   │   │       │   ├───toolbar-notifications-dropdown/
│   │   │   │       │   │   ├───toolbar-notifications-dropdown.component.html
│   │   │   │       │   │   ├───toolbar-notifications-dropdown.component.scss
│   │   │   │       │   │   └───toolbar-notifications-dropdown.component.ts
│   │   │   │       │   ├───toolbar-notifications.component.html
│   │   │   │       │   ├───toolbar-notifications.component.scss
│   │   │   │       │   └───toolbar-notifications.component.ts
│   │   │   │       ├───toolbar-search/
│   │   │   │       │   ├───toolbar-search.component.html
│   │   │   │       │   ├───toolbar-search.component.scss
│   │   │   │       │   └───toolbar-search.component.ts
│   │   │   │       ├───toolbar-user/
│   │   │   │       │   ├───interfaces/
│   │   │   │       │   │   └───menu-item.interface.ts
│   │   │   │       │   ├───toolbar-user-dropdown/
│   │   │   │       │   │   ├───toolbar-user-dropdown.component.html
│   │   │   │       │   │   ├───toolbar-user-dropdown.component.scss
│   │   │   │       │   │   └───toolbar-user-dropdown.component.ts
│   │   │   │       │   ├───toolbar-user.component.html
│   │   │   │       │   └───toolbar-user.component.ts
│   │   │   │       ├───toolbar.component.html
│   │   │   │       ├───toolbar.component.scss
│   │   │   │       └───toolbar.component.ts
│   │   │   ├───constants/
│   │   │   │   └───constant-loader.ts
│   │   │   └───layout/
│   │   │       ├───layout.component.html
│   │   │       ├───layout.component.scss
│   │   │       └───layout.component.ts
│   │   ├───pages/
│   │   │   └───pages/
│   │   │       ├───audit/
│   │   │       │   ├───access-records/
│   │   │       │   │   ├───access-records.component.html
│   │   │       │   │   ├───access-records.component.scss
│   │   │       │   │   └───access-records.component.ts
│   │   │       │   ├───cadastral-management-records/
│   │   │       │   │   ├───cadastral-management-records.component.html
│   │   │       │   │   ├───cadastral-management-records.component.scss
│   │   │       │   │   └───cadastral-management-records.component.ts
│   │   │       │   ├───audit-routing.module.ts
│   │   │       │   └───audit.module.ts
│   │   │       ├───auth/
│   │   │       │   ├───forgot-password/
│   │   │       │   │   ├───forgot-password.component.html
│   │   │       │   │   ├───forgot-password.component.scss
│   │   │       │   │   └───forgot-password.component.ts
│   │   │       │   ├───login/
│   │   │       │   │   ├───services/
│   │   │       │   │   │   ├───auth.service.spec.ts
│   │   │       │   │   │   └───auth.service.ts
│   │   │       │   │   ├───login.component.html
│   │   │       │   │   ├───login.component.scss
│   │   │       │   │   └───login.component.ts
│   │   │       │   ├───register/
│   │   │       │   │   ├───register.component.html
│   │   │       │   │   ├───register.component.scss
│   │   │       │   │   └───register.component.ts
│   │   │       │   ├───auth-routing.module.ts
│   │   │       │   └───auth.module.ts
│   │   │       ├───coming-soon/
│   │   │       │   ├───coming-soon.component.html
│   │   │       │   ├───coming-soon.component.scss
│   │   │       │   └───coming-soon.component.ts
│   │   │       ├───configuration/
│   │   │       │   ├───cadastral/
│   │   │       │   │   ├───domain-ladm-col/
│   │   │       │   │   │   ├───domain-ladm-col.component.html
│   │   │       │   │   │   ├───domain-ladm-col.component.scss
│   │   │       │   │   │   └───domain-ladm-col.component.ts
│   │   │       │   │   ├───economic-mod-construction/
│   │   │       │   │   │   ├───economic-mod-construction.component.html
│   │   │       │   │   │   ├───economic-mod-construction.component.scss
│   │   │       │   │   │   └───economic-mod-construction.component.ts
│   │   │       │   │   ├───economic-mod-land/
│   │   │       │   │   │   ├───economic-mod-land.component.html
│   │   │       │   │   │   ├───economic-mod-land.component.scss
│   │   │       │   │   │   └───economic-mod-land.component.ts
│   │   │       │   │   ├───integral-economic-mod/
│   │   │       │   │   │   ├───integral-economic-mod.component.html
│   │   │       │   │   │   ├───integral-economic-mod.component.scss
│   │   │       │   │   │   └───integral-economic-mod.component.ts
│   │   │       │   │   ├───sequences/
│   │   │       │   │   │   ├───sequences.component.html
│   │   │       │   │   │   ├───sequences.component.scss
│   │   │       │   │   │   └───sequences.component.ts
│   │   │       │   │   └───services-rates/
│   │   │       │   │       ├───services-rates.component.html
│   │   │       │   │       ├───services-rates.component.scss
│   │   │       │   │       └───services-rates.component.ts
│   │   │       │   ├───cadastralProcedures/
│   │   │       │   │   ├───digitalized-signatures/
│   │   │       │   │   │   ├───digitalized-signatures.component.html
│   │   │       │   │   │   ├───digitalized-signatures.component.scss
│   │   │       │   │   │   └───digitalized-signatures.component.ts
│   │   │       │   │   ├───documents-associated-procedures/
│   │   │       │   │   │   ├───documents-associated-procedures.component.html
│   │   │       │   │   │   ├───documents-associated-procedures.component.scss
│   │   │       │   │   │   └───documents-associated-procedures.component.ts
│   │   │       │   │   ├───entry-documents/
│   │   │       │   │   │   ├───entry-documents.component.html
│   │   │       │   │   │   ├───entry-documents.component.scss
│   │   │       │   │   │   └───entry-documents.component.ts
│   │   │       │   │   ├───output-formats/
│   │   │       │   │   │   ├───output-formats.component.html
│   │   │       │   │   │   ├───output-formats.component.scss
│   │   │       │   │   │   └───output-formats.component.ts
│   │   │       │   │   ├───workflow-procedures/
│   │   │       │   │   │   ├───workflow-procedures.component.html
│   │   │       │   │   │   ├───workflow-procedures.component.scss
│   │   │       │   │   │   └───workflow-procedures.component.ts
│   │   │       │   │   └───workgroups/
│   │   │       │   │       ├───workgroups.component.html
│   │   │       │   │       ├───workgroups.component.scss
│   │   │       │   │       └───workgroups.component.ts
│   │   │       │   ├───general/
│   │   │       │   │   ├───calendar/
│   │   │       │   │   │   ├───calendar.component.html
│   │   │       │   │   │   ├───calendar.component.scss
│   │   │       │   │   │   └───calendar.component.ts
│   │   │       │   │   └───users/
│   │   │       │   │       ├───users.component.html
│   │   │       │   │       ├───users.component.scss
│   │   │       │   │       └───users.component.ts
│   │   │       │   ├───configuration-routing.module.ts
│   │   │       │   └───configuration.module.ts
│   │   │       ├───errors/
│   │   │       │   ├───error-404/
│   │   │       │   │   ├───error-404.component.html
│   │   │       │   │   ├───error-404.component.scss
│   │   │       │   │   └───error-404.component.ts
│   │   │       │   └───error-500/
│   │   │       │       ├───error-500.component.html
│   │   │       │       ├───error-500.component.scss
│   │   │       │       └───error-500.component.ts
│   │   │       ├───my-work/
│   │   │       │   ├───assigned-tasks/
│   │   │       │   │   ├───assigned-tasks.component.html
│   │   │       │   │   ├───assigned-tasks.component.scss
│   │   │       │   │   └───assigned-tasks.component.ts
│   │   │       │   ├───cadastral-search/
│   │   │       │   │   ├───cadastral-search.component.html
│   │   │       │   │   ├───cadastral-search.component.scss
│   │   │       │   │   └───cadastral-search.component.ts
│   │   │       │   ├───file-procedure/
│   │   │       │   │   ├───file-procedure.component.html
│   │   │       │   │   ├───file-procedure.component.scss
│   │   │       │   │   └───file-procedure.component.ts
│   │   │       │   ├───manage/
│   │   │       │   │   ├───analytics/
│   │   │       │   │   │   ├───analytics.component.html
│   │   │       │   │   │   ├───analytics.component.scss
│   │   │       │   │   │   └───analytics.component.ts
│   │   │       │   │   ├───calendar/
│   │   │       │   │   │   ├───calendar.component.html
│   │   │       │   │   │   ├───calendar.component.scss
│   │   │       │   │   │   └───calendar.component.ts
│   │   │       │   │   └───time-line/
│   │   │       │   │       ├───time-line.component.html
│   │   │       │   │       ├───time-line.component.scss
│   │   │       │   │       └───time-line.component.ts
│   │   │       │   ├───prioritized-tasks/
│   │   │       │   │   ├───prioritized-tasks.component.html
│   │   │       │   │   ├───prioritized-tasks.component.scss
│   │   │       │   │   └───prioritized-tasks.component.ts
│   │   │       │   ├───returned-tasks/
│   │   │       │   │   ├───returned-tasks.component.html
│   │   │       │   │   ├───returned-tasks.component.scss
│   │   │       │   │   └───returned-tasks.component.ts
│   │   │       │   ├───my-work.module.ts
│   │   │       │   └───my-work.routes.ts
│   │   │       ├───open-data/
│   │   │       │   ├───cadastral-search-da/
│   │   │       │   │   ├───cadastral-search-da.component.html
│   │   │       │   │   ├───cadastral-search-da.component.scss
│   │   │       │   │   └───cadastral-search-da.component.ts
│   │   │       │   ├───downloads/
│   │   │       │   │   ├───alphanumeric/
│   │   │       │   │   │   ├───alphanumeric.component.html
│   │   │       │   │   │   ├───alphanumeric.component.scss
│   │   │       │   │   │   └───alphanumeric.component.ts
│   │   │       │   │   └───geodatabase/
│   │   │       │   │       ├───geodatabase.component.html
│   │   │       │   │       ├───geodatabase.component.scss
│   │   │       │   │       └───geodatabase.component.ts
│   │   │       │   ├───general-maps/
│   │   │       │   │   ├───general-maps.component.html
│   │   │       │   │   ├───general-maps.component.scss
│   │   │       │   │   └───general-maps.component.ts
│   │   │       │   ├───open-data-routing.module.ts
│   │   │       │   └───open-data.module.ts
│   │   │       ├───operation-support/
│   │   │       │   ├───historical-information/
│   │   │       │   │   ├───historical-information.component.html
│   │   │       │   │   ├───historical-information.component.scss
│   │   │       │   │   └───historical-information.component.ts
│   │   │       │   ├───operational-analytics/
│   │   │       │   │   ├───operational-analytics.component.html
│   │   │       │   │   ├───operational-analytics.component.scss
│   │   │       │   │   └───operational-analytics.component.ts
│   │   │       │   ├───people/
│   │   │       │   │   ├───people.component.html
│   │   │       │   │   ├───people.component.scss
│   │   │       │   │   └───people.component.ts
│   │   │       │   ├───procedures/
│   │   │       │   │   ├───prioritize-work/
│   │   │       │   │   │   ├───prioritize-work.component.html
│   │   │       │   │   │   ├───prioritize-work.component.scss
│   │   │       │   │   │   └───prioritize-work.component.ts
│   │   │       │   │   ├───work-finished/
│   │   │       │   │   │   ├───work-finished.component.html
│   │   │       │   │   │   ├───work-finished.component.scss
│   │   │       │   │   │   └───work-finished.component.ts
│   │   │       │   │   └───work-progress/
│   │   │       │   │       ├───work-progress.component.html
│   │   │       │   │       ├───work-progress.component.scss
│   │   │       │   │       └───work-progress.component.ts
│   │   │       │   ├───work-assignment/
│   │   │       │   │   ├───work-assignment.component.html
│   │   │       │   │   ├───work-assignment.component.scss
│   │   │       │   │   └───work-assignment.component.ts
│   │   │       │   ├───operation-support-routing.module.ts
│   │   │       │   └───operation-support.module.ts
│   │   │       └───public-service/
│   │   │           ├───citizens/
│   │   │           │   ├───generate-services-citizens/
│   │   │           │   │   ├───generate-services-citizens.component.html
│   │   │           │   │   ├───generate-services-citizens.component.scss
│   │   │           │   │   └───generate-services-citizens.component.ts
│   │   │           │   ├───service-history-citizens/
│   │   │           │   │   ├───service-history-citizens.component.html
│   │   │           │   │   ├───service-history-citizens.component.scss
│   │   │           │   │   └───service-history-citizens.component.ts
│   │   │           │   ├───validate-administrative-acts/
│   │   │           │   │   ├───validate-administrative-acts.component.html
│   │   │           │   │   ├───validate-administrative-acts.component.scss
│   │   │           │   │   └───validate-administrative-acts.component.ts
│   │   │           │   └───validate-certificates/
│   │   │           │       ├───validate-certificates.component.html
│   │   │           │       ├───validate-certificates.component.scss
│   │   │           │       └───validate-certificates.component.ts
│   │   │           ├───ticketOffice/
│   │   │           │   ├───generate-services/
│   │   │           │   │   ├───generate-services.component.html
│   │   │           │   │   ├───generate-services.component.scss
│   │   │           │   │   └───generate-services.component.ts
│   │   │           │   └───service-history/
│   │   │           │       ├───service-history.component.html
│   │   │           │       ├───service-history.component.scss
│   │   │           │       └───service-history.component.ts
│   │   │           ├───public-service-routing.module.ts
│   │   │           └───public-service.module.ts
│   │   ├───user-interface/
│   │   ├───app.component.html
│   │   ├───app.component.ts
│   │   ├───app.config.ts
│   │   └───app.routes.ts
│   ├───environments/
│   │   ├───environments.development.ts
│   │   ├───environments.prod.ts
│   │   └───environments.ts
│   ├───static-data/
│   ├───CHANGELOG.md
│   ├───favicon.ico
│   ├───index.html
│   ├───main.ts
│   ├───polyfills.ts
│   ├───README-PRO.md
│   ├───README.md
│   ├───styles.scss
│   └───_redirects
├───test/
│   └───app/
│       ├───apps/
│       │   ├───components/
│       │   │   └───table-cadastral-search/
│       │   │       └───table-cadastral-search.component.spec.ts
│       │   └───services/
│       │       ├───info-table.service.spec.ts
│       │       └───send-general-requests.service.spec.ts
│       ├───config/
│       │   └───interceptors/
│       │       └───token.interceptor.spec.ts
│       ├───pages/
│       │   └───pages/
│       │       ├───audit/
│       │       │   ├───access-records/
│       │       │   │   └───access-records.component.spec.ts
│       │       │   └───cadastral-management-records/
│       │       │       └───cadastral-management-records.component.spec.ts
│       │       ├───configuration/
│       │       │   ├───cadastral/
│       │       │   │   ├───domain-ladm-col/
│       │       │   │   │   └───domain-ladm-col.component.spec.ts
│       │       │   │   ├───economic-mod-construction/
│       │       │   │   │   └───economic-mod-construction.component.spec.ts
│       │       │   │   ├───economic-mod-land/
│       │       │   │   │   └───economic-mod-land.component.spec.ts
│       │       │   │   ├───integral-economic-mod/
│       │       │   │   │   └───integral-economic-mod.component.spec.ts
│       │       │   │   ├───sequences/
│       │       │   │   │   └───sequences.component.spec.ts
│       │       │   │   └───services-rates/
│       │       │   │       └───services-rates.component.spec.ts
│       │       │   ├───cadastralProcedures/
│       │       │   │   ├───digitalized-signatures/
│       │       │   │   │   └───digitalized-signatures.component.spec.ts
│       │       │   │   ├───documents-associated-procedures/
│       │       │   │   │   └───documents-associated-procedures.component.spec.ts
│       │       │   │   ├───entry-documents/
│       │       │   │   │   └───entry-documents.component.spec.ts
│       │       │   │   ├───output-formats/
│       │       │   │   │   └───output-formats.component.spec.ts
│       │       │   │   ├───workflow-procedures/
│       │       │   │   │   └───workflow-procedures.component.spec.ts
│       │       │   │   └───workgroups/
│       │       │   │       └───workgroups.component.spec.ts
│       │       │   └───general/
│       │       │       ├───calendar/
│       │       │       │   └───calendar.component.spec.ts
│       │       │       └───users/
│       │       │           └───users.component.spec.ts
│       │       ├───my-work/
│       │       │   ├───assigned-tasks/
│       │       │   │   └───tasks-panel.component.spec.ts
│       │       │   ├───cadastral-search/
│       │       │   │   └───cadastral-search.component.spec.ts
│       │       │   ├───file-procedure/
│       │       │   │   └───file-procedure.component.spec.ts
│       │       │   ├───manage/
│       │       │   │   ├───analytics/
│       │       │   │   │   └───analytics.component.spec.ts
│       │       │   │   ├───calendar/
│       │       │   │   │   └───calendar.component.spec.ts
│       │       │   │   └───time-line/
│       │       │   │       └───time-line.component.spec.ts
│       │       │   ├───prioritized-tasks/
│       │       │   │   └───prioritized-tasks.component.spec.ts
│       │       │   └───returned-tasks/
│       │       │       └───returned-tasks.component.spec.ts
│       │       ├───open-data/
│       │       │   ├───cadastral-search-da/
│       │       │   │   └───cadastral-search-da.component.spec.ts
│       │       │   ├───downloads/
│       │       │   │   ├───alphanumeric/
│       │       │   │   │   └───alphanumeric.component.spec.ts
│       │       │   │   └───geodatabase/
│       │       │   │       └───geodatabase.component.spec.ts
│       │       │   └───general-maps/
│       │       │       └───general-maps.component.spec.ts
│       │       ├───operation-support/
│       │       │   ├───historical-information/
│       │       │   │   └───historical-information.component.spec.ts
│       │       │   ├───operational-analytics/
│       │       │   │   └───operational-analytics.component.spec.ts
│       │       │   ├───people/
│       │       │   │   └───people.component.spec.ts
│       │       │   ├───procedures/
│       │       │   │   ├───prioritize-work/
│       │       │   │   │   └───prioritize-work.component.spec.ts
│       │       │   │   ├───work-finished/
│       │       │   │   │   └───work-finished.component.spec.ts
│       │       │   │   └───work-progress/
│       │       │   │       └───work-progress.component.spec.ts
│       │       │   └───work-assignment/
│       │       │       └───work-assignment.component.spec.ts
│       │       └───public-service/
│       │           ├───citizens/
│       │           │   ├───generate-services-citizens/
│       │           │   │   └───generate-services-citizens.component.spec.ts
│       │           │   ├───service-history-citizens/
│       │           │   │   └───service-history-citizens.component.spec.ts
│       │           │   ├───validate-administrative-acts/
│       │           │   │   └───validate-administrative-acts.component.spec.ts
│       │           │   └───validate-certificates/
│       │           │       └───validate-certificates.component.spec.ts
│       │           └───ticketOffice/
│       │               ├───generate-services/
│       │               │   └───generate-services.component.spec.ts
│       │               └───service-history/
│       │                   └───service-history.component.spec.ts
│       └───app.component.spec.ts
├───.editorconfig
├───.gitignore
├───.npmrc
├───.nvmrc
├───.prettierrc
├───angular.json
├───babel.config.js
├───package-lock.json
├───package.json
├───proxy.conf.json
├───setup-jest.ts
├───tailwind.config.ts
├───tsconfig.app.json
├───tsconfig.json
└───tsconfig.spec.json
```

![img.png](img.png)

## Installation

> Se recomienda que se tenga instalado los siguientes programas:

- **npm** v9.9.3 o superior
- **Angular-CLI** v17.0.9
- **NodeJS** v18 o superior

[A detailed instruction on how to install NodeJS is available here.](//docs.npmjs.com/getting-started/installing-node)

### Instalaccion of Angular-CLI

Instalacción de Angular-CLI:

`npm install -g @angular/cli@latest` or `sudo npm install -g @angular/cli@latest`

### Install Vex Dependencies

Para poder correr el aplicativo se debe ejecutar el comando `npm install` para poder descargar los paquetes necesarios en el proyectos.

## Start Development Server

Actualmente en el proyecto se crearon varios script para poder correr el aplicativo, entre los cuales estan:

```json
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "start-p": "ng serve --proxy-config proxy.conf.json",
    "build": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "ng lint",
    "e2e": "ng e2e"
  }
```

Para poder correr el proyecto se debe ejecutar el comando `npm run start` para que el aplicativo se ejecute y
se debe colocar la siguiente url en el navegador, por defecto seria `http://localhost:4200/`

---

## Getting Started Login

Actualmente se encuentra un login en el momento de ingresar al aplicativo, dicho login actualmente no es necesario ingresar información
para acceder al aplicativo.

![img_1.png](img_1.png)

## Getting Started First Component

El primer componente en el cual se esta trabajando se llama búsqueda catastral

![img_2.png](img_2.png)

El formulario de búsqueda es el siguiente:

![img_3.png](img_3.png)

Actualmente dicho formulario está solo activo el taq de `Multiplex campos` en el cual se tiene 4 tipos de búsqueda.

Se agrega algunos ejemplos de búsqueda:

## Examples of test data

|                                                                      Name | Description                                   |
| ------------------------------------------------------------------------: | --------------------------------------------- |
|                                                               `matricula` | 420-116966                                    |
|                                              `tipo documento / documento` | NIT / 860003293                               |
| `nombre / otros nombres / apellidos / otros apellidos / nombre compania ` | JORGE / ENRIQUE / HINCAPIE / SALAZAR / MUNICI |
|                                                          `direccionTexto` | C 37 1 509 ESTE Ap 102 To A                   |
