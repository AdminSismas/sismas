import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@shared/services/auth/user.service';

@Directive({
  selector: '[vexHasRole]',
  standalone: true
})
export class HasRoleDirective {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {}


  @Input() set appHasRole(roles: string[]) {
    const user = this.userService.getUser();

    // Si el usuario tiene un rol y ese rol está incluido en los roles permitidos
    if (user && roles.includes(user.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
