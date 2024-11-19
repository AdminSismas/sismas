import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  NAVIGATION_LOADER_AUDIT,
  NAVIGATION_LOADER_CONFIGURATION,
  NAVIGATION_LOADER_MY_WORK_1,
  NAVIGATION_LOADER_MY_WORK_3,
  NAVIGATION_LOADER_OPEN_DATA,
  NAVIGATION_LOADER_OPERATION_SUPPORT,
  NAVIGATION_LOADER_PUBLIC_SERVICE
} from '../../layouts/constants/constant-loader';
import { TasksPanelService } from '../../apps/services/bpm/tasks-panel.service';
import { ProTaskE } from '../../apps/interfaces/pro-task-e';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  listProTasksE: ProTaskE[] = [];
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  _contentInformationProTaskE$ = new Subject<ProTaskE>();
  dataContentInformationProTaskE$: Observable<ProTaskE> = this._contentInformationProTaskE$.asObservable();

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(
    private readonly layoutService: VexLayoutService,
    private protasksService: TasksPanelService
  ) {
    this.loadInformationProTaskE();

    this.dataContentInformationProTaskE$.pipe(filter<ProTaskE>(Boolean))
      .subscribe((result) => {
        this.listProTasksE = [];
        this.listProTasksE.push(result);
        this.loadInformationNavigation();
      });
  }

  loadInformationProTaskE(): void {
    this.protasksService.listProtaskE$
      .subscribe((result: ProTaskE) => {
        if (result?.asigned) {
          this._contentInformationProTaskE$.next(result);
        }
      });
  }

  loadInformationNavigation() {
    let countProTaskAssigned = 0;
    let countProTaskPriority = 0;
    let countProTaskDevolution = 0;
    let countTotalProTask = 0;

    let proTaskE: ProTaskE | null = null;
    if (this.listProTasksE?.length > 0) {
      proTaskE = this.listProTasksE[0];
    }

    if (proTaskE !== null) {
      countProTaskAssigned = proTaskE.asigned ? proTaskE.asigned : 0;
      countProTaskPriority = proTaskE.priority ? proTaskE.priority : 0;
      countProTaskDevolution = proTaskE.devolution ? proTaskE.devolution : 0;
      countTotalProTask = countProTaskAssigned + countProTaskPriority + countProTaskDevolution;
    }

    let listItem: NavigationItem[] = [
      {
        type: 'subheading',
        label: 'Mi Trabajo',
        children: [
          ...NAVIGATION_LOADER_MY_WORK_1,
          {
            type: 'dropdown',
            label: 'Tareas',
            icon: 'mat:task_alt',
            badge: {
              value: countTotalProTask.toString(),
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
                  value: countProTaskAssigned.toString(),
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
                  value: countProTaskPriority.toString(),
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
                  value: countProTaskDevolution.toString(),
                  bgClass: 'bg-cyan-600',
                  textClass: 'text-white'
                }
              }
            ]
          },
          ...NAVIGATION_LOADER_MY_WORK_3
        ]
      },
      {
        type: 'subheading',
        label: 'Apoyo Operación',
        children: NAVIGATION_LOADER_OPERATION_SUPPORT
      },
      {
        type: 'subheading',
        label: 'Datos Abiertos',
        children: NAVIGATION_LOADER_OPEN_DATA
      },
      {
        type: 'subheading',
        label: 'Servicio Público',
        children: NAVIGATION_LOADER_PUBLIC_SERVICE
      },
      {
        type: 'subheading',
        label: 'Configuración',
        children: NAVIGATION_LOADER_CONFIGURATION
      },
      {
        type: 'subheading',
        label: 'Auditoría',
        children: NAVIGATION_LOADER_AUDIT
      },
      {
        type: 'subheading',
        label: 'Customize Apps',
        children: [
          {
            type: 'link',
            label: 'Configuration',
            route: () => this.layoutService.openConfigpanel(),
            icon: 'mat:settings'
          }
        ]
      }
    ];
    this.nextItems(listItem);
  }

  nextItems(listItem: NavigationItem[]) {
    this._items.next(listItem);
  }
}
