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
import { ProTaskE } from '../../apps/interfaces/bpm/pro-task-e';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  listProTasksE: ProTaskE[] = [];
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

   private taskCounters = new BehaviorSubject<{
    assigned: number;
    priority: number;
    devolution: number;
    total: number;
  }>({
    assigned: 0,
    priority: 0,
    devolution: 0,
    total: 0
  });
  taskCounters$ = this.taskCounters.asObservable();
  _contentInformationProTaskE$ = new Subject<ProTaskE>();
  dataContentInformationProTaskE$: Observable<ProTaskE> =
    this._contentInformationProTaskE$.asObservable();
  user: DecodeJwt | null = null;

  private _countLoop?: NodeJS.Timeout | null;

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(
    private readonly layoutService: VexLayoutService,
    private proTasksService: TasksPanelService,
    private userService: UserService
  ) {
    const currentUser = this.userService.getUser();
    if (currentUser) {
      this.user = currentUser;
      this.loadInformationNavigation(currentUser.role);
    }
    this.userService.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loadInformationNavigation(user.role);
      }
    });
    this.loadInformationProTaskE();

    this.dataContentInformationProTaskE$
      .pipe(filter<ProTaskE>(Boolean))
      .subscribe((result) => {
        this.listProTasksE = [];
        this.listProTasksE.push(result);
        this.userService.currentUser.subscribe((user) => {
          if (user) {
            this.loadInformationNavigation(user.role);
          }
        });
      });
  }

  startCountLoop(): void {
    if (!this._countLoop) {
      this._countLoop = setInterval(() => this.updateTaskCounters(), 60000);
    }
  }

  stopCountLoop(): void {
    if (this._countLoop) {
      clearInterval(this._countLoop);
      this._countLoop = null;
    }
  }

  private updateTaskCounters(): void {
    if (this.user) {
      this.proTasksService.getProTaskCount().subscribe({
        next: (result: ProTaskE) => {
          const counters = {
            assigned: result.asigned || 0,
            priority: result.priority || 0,
            devolution: result.devolution || 0,
            total: (result.asigned || 0) + (result.priority || 0) + (result.devolution || 0)
          };

          this.taskCounters.next(counters);
          this.loadInformationNavigation(this.user!.role);
        }
      });
    }
  }

  loadInformationProTaskE(): void {
    this.proTasksService.listProtaskE$.subscribe((result: ProTaskE) => {
      if (result?.asigned) {
        this._contentInformationProTaskE$.next(result);
      }
    });
  }

  getUser(): void {
    const user = this.userService.getUser();

    if (user) {
      this.user = user as DecodeJwt;

      this.loadInformationNavigation(user.role);
    } else {
      console.error('El usuario no está disponible');
    }
  }

  loadInformationNavigation(role: string): void {
    const filteredPublicService = NAVIGATION_LOADER_PUBLIC_SERVICE.filter(
      (item) => {
        return !item.roles || item.roles.includes(role);
      }
    );

    const currentCounters = this.taskCounters.value;

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
              value: currentCounters.total.toString(),
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
                  value: currentCounters.assigned.toString(),
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
                  value: currentCounters.priority.toString(),
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
                  value: currentCounters.devolution.toString(),
                  bgClass: 'bg-cyan-600',
                  textClass: 'text-white'
                }
              }
            ]
          },
          ...NAVIGATION_LOADER_MY_WORK_3
        ],
        roles: ['ADMIN', 'USER', 'USER_READ', 'USER_SERV']
      },
      {
        type: 'subheading',
        label: 'Apoyo operación',
        children: NAVIGATION_LOADER_OPERATION_SUPPORT,
        roles: ['ADMIN', 'USER', 'USER_READ', 'USER_SERV']
      },
      {
        type: 'subheading',
        label: 'Datos abiertos',
        children: NAVIGATION_LOADER_OPEN_DATA,
        roles: ['ADMIN', 'USER', 'GUEST', 'USER_READ', 'USER_SERV']
      },
      {
        type: 'subheading',
        label: 'Servicio público',
        children: filteredPublicService,
        roles: ['ADMIN', 'USER', 'GUEST', 'USER_READ','USER_SERV']

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
        ],
        roles: ['ADMIN']
      }
    ];
    const accessibleNavigation = listItem.filter(
      (item) => !item.roles || item.roles.includes(role)
    );

    this.nextItems(accessibleNavigation);
  }

  nextItems(listItem: NavigationItem[]) {
    this._items.next(listItem);
  }

  refreshCounters(): void {
    this.updateTaskCounters();
  }
}
