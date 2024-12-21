import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { VexConfigService } from '@vex/config/vex-config.service';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { NavigationItem } from '../../../core/navigation/navigation-item.interface';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { Observable, of } from 'rxjs';
import { SidenavUserMenuComponent } from './sidenav-user-menu/sidenav-user-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';
import { Router } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { STRING_INFORMATION_NOT_FOUND } from 'src/app/apps/constants/constant';
import { NavigationLoaderService } from 'src/app/core/navigation/navigation-loader.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    VexScrollbarComponent,
    NgFor,
    SidenavItemComponent,
    AsyncPipe,
    MatAutocompleteModule,
    MatFormFieldModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
  ]
  
})
export class SidenavComponent implements OnInit {
  public validationField = STRING_INFORMATION_NOT_FOUND;
  filteredRouteList$: Observable<NavigationItem[]> | undefined;
  public listRouteItem:NavigationItem[] = []

  form: FormGroup;

  user: UserDetails | null = null;

  @Input() collapsed: boolean = false;
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

  userName$?: string
  userPerfil$?: string

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private layoutService: VexLayoutService,
    private configService: VexConfigService,
    private readonly popoverService: VexPopoverService,
    private readonly dialog: MatDialog,
    private userService: UserService,
  ) {

    this.form = this.fb.group({
      searchRuote: [''],
    });
  }

  ngOnInit(): void {
    this.user = this.userService.getUser(); 
    this.navigationService._navigationMenuSubject$.subscribe((items) => {
      this.listRouteItem.push(items[0]);
      // console.log('items lista optenida del menu', items);
    });


    this.filteredRouteList$ = this.form.get('searchRuote')?.valueChanges.pipe(
        debounceTime(100),  // Espera 500 ms después del último cambio
        distinctUntilChanged(),
      map((value): any[] => this.listRouteItem.filter(
        (option: any) => option.label?.toLowerCase().includes(value.toLowerCase() || ''))
      ));

      this.serachRouteTouch();
   
  }


  serachRouteTouch(){
    this.form.get('searchRuote')?.valueChanges.pipe(
      debounceTime(100),  // Espera 500 ms después del último cambio
      distinctUntilChanged(),
    map((value): any[] => this.listRouteItem.filter(
      (option: any) => option.label?.toLowerCase().includes(value.toLowerCase() || ''))
    )).subscribe((result) => {
      console.log('result', result);
    });
  }
  navigateToCadastralSearch() {
    this.router.navigate(['/myWork/cadastralSearch']);
  }

  changeRole(role: string): void {
    this.userService.changeRole(role);  
  }

  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed
      ? this.layoutService.expandSidenav()
      :( this.layoutService.collapseSidenav(),this.collapseCloseSidenav());
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

  loadBlocksRouteList(label: string, status: boolean | null): void {
    if (label?.length <= 0) {
      return;
    }

    this.navigationService._navigationMenuSubject$
            .subscribe({
             next: (result: NavigationItem[]) => {
              this.listRouteItem = result;

              if (this.listRouteItem[0] === undefined) {
                this.listRouteItem.splice(0, 1);
              }
          
              this.captureRuteInformation(this.listRouteItem, label)
            }
           }
         );
 
  
    
    console.log('this.listRouteItem', this.listRouteItem );
  }


  captureRuteInformation(result: NavigationItem[], label: string | null) {
      result = result;
       this.listRouteItem = result;
   
    
        let listOptions: NavigationItem[] =  this.listRouteItem.filter(
          (option: NavigationItem): boolean => option.label === label);
        if (listOptions?.length > 0) {
          this.form.get('searchRuote')?.patchValue(listOptions[0].label);
          this.loadBlocksRouteList(listOptions[0].label, false);
        }
     
  
      this.form.get('searchRuote')?.valueChanges.pipe(
        startWith(''),
        map((value): any[] => this.listRouteItem.filter(
          (option: any) => option.codeName?.toLowerCase().includes(value.toLowerCase() || ''))
        ));
    }

    public seeRutList(): void {
      if (this.listRouteItem[0] === undefined) {
        this.listRouteItem.splice(0, 1);
      }
      console.log('this.listRouteItem', this.listRouteItem );
    }
}
