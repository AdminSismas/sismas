import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import {
  NavigationItem,
  NavigationLink,
  NavigationDropdown
} from './navigation-item.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  NAVIGATION_LOADER_AUDIT,
  NAVIGATION_LOADER_CONFIGURATION,
  NAVIGATION_LOADER_MY_WORK_1,
  NAVIGATION_LOADER_MY_WORK_3,
  NAVIGATION_LOADER_OPEN_DATA,
  NAVIGATION_LOADER_OPERATION_SUPPORT,
  NAVIGATION_LOADER_PUBLIC_SERVICE,
  NAVIGATION_THEMATIC_MAP
} from '../../layouts/constants/constant-loader';
import { TasksPanelService } from '@shared/services';
import { ProTaskE } from '@shared/interfaces';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import {
  ADMIN_ROLE_LIST,
  BASIC_USERS_ROLE_LIST,
  EXECUTIONERS_ROLE_LIST_WITH_USER_TRAM,
  MODIFY_PEOPLE,
  NOT_GUEST_USERS_ROLE_LIST
} from 'src/app/apps/constants/general/constants';
import { HttpErrorResponse } from '@angular/common/http';

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
            total:
              (result.asigned || 0) +
              (result.priority || 0) +
              (result.devolution || 0)
          };

          this.taskCounters.next(counters);
          this.loadInformationNavigation(this.user!.role);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.stopCountLoop();
          }
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

  private filterNavigationItemsByRole(
    items: (NavigationLink | NavigationDropdown)[],
    role: string
  ): (NavigationLink | NavigationDropdown)[] {
    return items.reduce((acc, item) => {
      if (item.roles && !item.roles.includes(role)) {
        return acc;
      }

      if (item.type === 'dropdown' && item.children) {
        const children = this.filterNavigationItemsByRole(item.children, role);
        if (children.length > 0) {
          acc.push({ ...item, children });
        }
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, [] as (NavigationLink | NavigationDropdown)[]);
  }

  loadInformationNavigation(role: string): void {
    const filteredPublicService = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_PUBLIC_SERVICE,
      role
    );
    const filteredThematicMapService = this.filterNavigationItemsByRole(
      NAVIGATION_THEMATIC_MAP,
      role
    );
    const filteredOperationSupport = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_OPERATION_SUPPORT,
      role
    );
    const filteredOpenData = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_OPEN_DATA,
      role
    );
    const filteredConfiguration = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_CONFIGURATION,
      role
    );
    const filteredAudit = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_AUDIT,
      role
    );
    const filteredMyWork1 = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_MY_WORK_1,
      role
    );
    const filteredMyWork3 = this.filterNavigationItemsByRole(
      NAVIGATION_LOADER_MY_WORK_3,
      role
    );

    const currentCounters = this.taskCounters.value;

    const listItem: NavigationItem[] = [
      {
        type: 'subheading',
        label: 'Mi trabajo',
        children: [
          ...filteredMyWork1,

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
            ],
            roles: EXECUTIONERS_ROLE_LIST_WITH_USER_TRAM
          },
          ...filteredMyWork3
        ],
        roles: NOT_GUEST_USERS_ROLE_LIST
      },
      {
        type: 'subheading',
        label: 'Apoyo operación',
        children: filteredOperationSupport,
        roles: EXECUTIONERS_ROLE_LIST_WITH_USER_TRAM
      },
      {
        type: 'subheading',
        label: 'Datos abiertos',
        children: filteredOpenData,
        roles: BASIC_USERS_ROLE_LIST
      },
      {
        type: 'subheading',
        label: 'Servicio público',
        children: filteredPublicService,
        roles: BASIC_USERS_ROLE_LIST
      },
      {
        type: 'subheading',
        label: 'Mapa temáticos',
        children: filteredThematicMapService,
        roles: BASIC_USERS_ROLE_LIST
      },
      {
        type: 'subheading',
        label: 'Configuración',
        children: filteredConfiguration,
        roles: MODIFY_PEOPLE
      },
      {
        type: 'subheading',
        label: 'Auditoría',
        children: filteredAudit,
        roles: ADMIN_ROLE_LIST
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
        roles: ADMIN_ROLE_LIST
      }
    ];

    const accessibleNavigation = listItem
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => {
        if (item.type === 'subheading' && item.children) {
          item.children = this.filterNavigationItemsByRole(item.children, role);
        }
        return item;
      })
      .filter((item) => {
        if (item.type === 'subheading') {
          return item.children.length > 0;
        }
        return true;
      });

    this.nextItems(accessibleNavigation);
  }

  nextItems(listItem: NavigationItem[]) {
    this._items.next(listItem);
  }

  refreshCounters(): void {
    this.updateTaskCounters();
  }

  refreshNavigation(): void {
    const user = this.userService.getUser();
    if (user) {
      this.loadInformationNavigation(user.role);
    } else {
      this.nextItems([]);
    }
  }
}
