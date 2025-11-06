import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { environment } from '@environments/environments';
import { CONSTANT_NAME_ID } from '../../../../shared/constants/general/constantLabels';
import { TasksPanelService } from '@features/bpm-workflows/services/header-bpm-core/tasks-panel.service';


export const resourcesDataResolver: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot,
) => {
  const router = inject(Router);
  return inject(TasksPanelService).getResources(route.paramMap.get(CONSTANT_NAME_ID)!)
    .pipe(
      catchError(() => {
        router.navigateByUrl(`${environment.notFound}`).then();
        return EMPTY;
      })
    );
};
