import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { NavigationItem } from '../../../core/navigation/navigation-item.interface';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { Observable, of, Subject } from 'rxjs';
import { SidenavUserMenuComponent } from './sidenav-user-menu/sidenav-user-menu.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { STRING_INFORMATION_NOT_FOUND } from '../../../apps/constants/general/constants';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NavigationLoaderService } from 'src/app/core/navigation/navigation-loader.service';
import type { UserRole } from 'src/app/apps/interfaces/user-details/user.model';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    VexScrollbarComponent,
    SidenavItemComponent,
    AsyncPipe,
    MatAutocompleteModule,
    MatFormFieldModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ]
})
export class SidenavComponent implements OnInit, OnDestroy {
  public validationField = STRING_INFORMATION_NOT_FOUND;
  filteredRouteList$: Observable<NavigationItem[]> | undefined;
  public listRouteItem: NavigationItem[] = [];
  public listRouteItemNew: NavigationItem[] = [];

  form: FormGroup;

  user: DecodeJwt | null = null;

  @Input() collapsed = false;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(
    map((config) => config.sidenav.title)
  );
  imageUrl$ = this.configService.config$.pipe(
    map((config) => config.sidenav.imageUrl)
  );
  showCollapsePin$ = this.configService.config$.pipe(
    map((config) => config.sidenav.showCollapsePin)
  );
  userVisible$ = this.configService.config$.pipe(
    map((config) => config.sidenav.user.visible)
  );
  searchVisible$ = this.configService.config$.pipe(
    map((config) => config.sidenav.search.visible)
  );

  userMenuOpen$: Observable<boolean> = of(false);

  items$: Observable<NavigationItem[]> = this.navigationService.items$;

  userName$?: string;
  userPerfil$?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private layoutService: VexLayoutService,
    private configService: VexConfigService,
    private readonly popoverService: VexPopoverService,
    private userService: UserService,
    private navigationLoaderService: NavigationLoaderService
  ) {
    this.form = this.fb.group({
      searchRoute: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.navigationService._navigationMenuSubject$.subscribe((items) => {
      this.listRouteItem.push(items[0]);
    });

    this.filteredRouteList$ = this.form.get('searchRoute')?.valueChanges.pipe(
      debounceTime(100), // Espera 500 ms después del último cambio
      distinctUntilChanged(),
      map((value) =>
        this.listRouteItem.filter((option) =>
          option.label?.toLowerCase().includes(value.toLowerCase() || '')
        )
      )
    );

    this.searchRouteTouch();

    this.navigationLoaderService.refreshCounters();
    this.navigationLoaderService.startCountLoop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchRouteTouch() {
    this.form
      .get('searchRoute')
      ?.valueChanges.pipe(
        debounceTime(100), // Espera 500 ms después del último cambio
        distinctUntilChanged(),
        map((value) =>
          this.listRouteItem.filter((option) =>
            option.label?.toLowerCase().includes(value.toLowerCase() || '')
          )
        )
      )
      .subscribe();
  }
  navigateToCadastralSearch() {
    this.router.navigate(['/myWork/cadastralSearch']);
  }

  changeRole(role: UserRole): void {
    this.userService.changeRole(role);
  }

  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    if (this.collapsed) {
      this.layoutService.expandSidenav();
    } else {
      this.layoutService.collapseSidenav();
      this.collapseCloseSidenav();
    }
  }

  trackByRoute(index: number, item: NavigationItem): string {
    if (item.type === 'link') {
      return item.route;
    }

    return item.label;
  }

  openProfileMenu(origin: HTMLDivElement): void {
    this.userMenuOpen$ = of(
      this.popoverService.open({
        content: SidenavUserMenuComponent,
        origin,
        offsetY: -8,
        width: origin.clientWidth,
        position: [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          }
        ]
      })
    ).pipe(
      switchMap((popoverRef) => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true)
    );
  }

  loadBlocksRouteList(label: string): void {
    if (label?.length <= 0) {
      return;
    }
    this.router.navigate([label]);
    this.form.get('searchRoute')?.reset();
  }

  captureRuteInformation(result: NavigationItem[], label: string | null) {
    this.listRouteItem = result;

    const listOptions: NavigationItem[] = this.listRouteItem.filter(
      (option: NavigationItem): boolean => option.label === label
    );
    if (listOptions?.length > 0) {
      this.form.get('searchRoute')?.patchValue(listOptions[0].label);
      this.loadBlocksRouteList(listOptions[0].label);
    }

    this.form.get('searchRoute')?.valueChanges.pipe(
      startWith(''),
      map((value) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.listRouteItem.filter((option: any) =>
          option.codeName?.toLowerCase().includes(value.toLowerCase() || '')
        )
      )
    );
  }

  public seeRutList(): void {
    if (this.listRouteItem[0] === undefined) {
      this.listRouteItem.splice(0, 1);
    }
  }
}
