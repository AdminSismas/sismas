import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { ProFlow } from '../../../../apps/interfaces/bpm/pro-flow';
import { catchError, EMPTY } from 'rxjs';
import { BpmCoreService } from '../../../../apps/services/bpm/bpm-core.service';
import { environment } from '../../../../../environments/environments';
import { CONSTANT_NAME_ID } from '../../../../apps/constants/general/constantLabels';
import { TasksPanelService } from '../../../../apps/services/bpm/tasks-panel.service';


export const resourcesDataResolver: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  return inject(TasksPanelService).getResources(route.paramMap.get(CONSTANT_NAME_ID)!)
    .pipe(
      catchError((err: any) => {
        router.navigateByUrl(`${environment.notFound}`).then(() => {});
        return EMPTY;
      })
    );
};
