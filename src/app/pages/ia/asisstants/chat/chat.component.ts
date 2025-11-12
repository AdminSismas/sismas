import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { Observable } from 'rxjs';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { trackById } from '@vex/utils/track-by';
import { stagger80ms } from '@vex/animations/stagger.animation';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { ChatService } from './chat.service';
import { MatRippleModule } from '@angular/material/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ActivatedRoute } from '@angular/router';

export interface Chat {
  id: string;
  id_asistente: string;
  imageUrl: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  timestamp: string;
  instrucciones: string;  // Nuevo campo
  asistente_id: string;   // Nuevo campo
  empresa_modelo: string; // Nuevo campo
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'partner';
  message: string;
}

@Component({
  selector: 'vex-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger80ms],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    NgClass,
    MatRippleModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    MatButtonModule,
    MatDividerModule,
    MatInputModule
  ]
})
export class ChatComponent implements OnInit {
  chats$: Observable<Chat[]> = this.chatService.chats$;

  mobileQuery$ = this.layoutService.ltMd$;
  drawerOpen$ = this.chatService.drawerOpen$;

  trackById = trackById;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router,
    private layoutService: VexLayoutService,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.mobileQuery$),
        filter((isMobile) => isMobile),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.closeDrawer());

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(null),
        switchMap(() => this.mobileQuery$),
        filter((isMobile) => !isMobile),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.openDrawer());

    // Llama a fetchChats() al iniciar el componente
    this.route.paramMap.subscribe(params => {
      const assistantId = params.get('id');
      if (assistantId) {
        this.chatService.fetchChats(assistantId); // Llama al servicio con el ID del asistente
      }
    });
  }

  drawerChange(drawerOpen: boolean) {
    this.chatService.drawerOpen.next(drawerOpen);
  }

  openDrawer() {
    this.chatService.drawerOpen.next(true);
    this.cd.markForCheck();
  }

  closeDrawer() {
    this.chatService.drawerOpen.next(false);
    this.cd.markForCheck();
  }
}
