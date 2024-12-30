import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem,  } from './navigation-item.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  NAVIGATION_LOADER_AUDIT,
  NAVIGATION_LOADER_CONFIGURATION,
  NAVIGATION_LOADER_MY_WORK_1,
  NAVIGATION_LOADER_MY_WORK_3,
  NAVIGATION_LOADER_OPEN_DATA,
  NAVIGATION_LOADER_OPERATION_SUPPORT,
  NAVIGATION_LOADER_PUBLIC_SERVICE,
} from '../../layouts/constants/constant-loader';
import { TasksPanelService } from '../../apps/services/bpm/tasks-panel.service';
import { ProTaskE } from '../../apps/interfaces/pro-task-e';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  listProTasksE: ProTaskE[] = [];
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  _contentInformationProTaskE$ = new Subject<ProTaskE>();
  dataContentInformationProTaskE$: Observable<ProTaskE> = this._contentInformationProTaskE$.asObservable();
  user: UserDetails | null = null;
  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(
    private readonly layoutService: VexLayoutService,
    private protasksService: TasksPanelService,
    private userService: UserService
  ) {
    this.loadInformationProTaskE();

 


    this.dataContentInformationProTaskE$.pipe(filter<ProTaskE>(Boolean))
      .subscribe((result) => {
        this.listProTasksE = [];
        this.listProTasksE.push(result);
        this.userService.currentUser.subscribe(user => {
          if (user) {
            this.loadInformationNavigation(user.authorities[0].authority); 
          }
        });
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

  getUser(): void {
    const user = this.userService.getUser(); 
    
    if (user) {
      this.user = user;
      if (user.authorities && user.authorities[0]) {
        this.loadInformationNavigation(user.authorities[0].authority);
      }
    } else {
      console.error('El usuario no está disponible');
    }
  }

  loadInformationNavigation(role: string): void {


    const filteredPublicService = NAVIGATION_LOADER_PUBLIC_SERVICE.filter(item => {
      return !item.roles || item.roles.includes(role);
    });

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

    const listItem: NavigationItem[] = [
      {
        type: 'subheading',
        label: 'Mi trabajo',
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
        ],
        roles: ['ADMIN', 'USER']
      },
      {
        type: 'subheading',
        label: 'Apoyo operación',
        children: NAVIGATION_LOADER_OPERATION_SUPPORT,
        roles: ['ADMIN', 'USER']
      },
      {
        type: 'subheading',
        label: 'Datos abiertos',
        children: NAVIGATION_LOADER_OPEN_DATA,
        roles: ['ADMIN', 'USER', 'GUEST']
      },
      {
        type: 'subheading',
        label: 'Servicio público',
        children: filteredPublicService,
        roles: ['ADMIN', 'USER', 'GUEST']
      },
      {
        type: 'subheading',
        label: 'Configuración',
        children: NAVIGATION_LOADER_CONFIGURATION,
        roles: ['ADMIN']
      },
      {
        type: 'subheading',
        label: 'Auditoría',
        children: NAVIGATION_LOADER_AUDIT,
        roles: ['ADMIN']
      },
      {
        type: 'subheading',
        label: 'Customize apps',
        children: [
          {
            type: 'link',
            label: 'Configuration',
            route: () => this.layoutService.openConfigpanel(),
            icon: 'mat:settings'
          }
        ]
      },
    ];
    const accessibleNavigation = listItem.filter(item =>
      !item.roles || item.roles.includes(role) 
    );
  
    this.nextItems(accessibleNavigation);
  }

  nextItems(listItem: NavigationItem[]) {
    this._items.next(listItem);
  }
}
