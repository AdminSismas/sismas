import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ProFlow } from '@shared/interfaces';
import { catchError, EMPTY } from 'rxjs';
import { BpmCoreService } from '@shared/services';
import { environment } from '../../../../../environments/environments';
import { CONSTANT_NAME_ID } from '../../../../apps/constants/general/constantLabels';


export const proFlowDataResolver: ResolveFn<ProFlow> = (
  route: ActivatedRouteSnapshot,
) => {
  const router = inject(Router);
  return inject(BpmCoreService).getProFlowProExecution(route.paramMap.get(CONSTANT_NAME_ID)!)
    .pipe(
      catchError(() => {
        router.navigateByUrl(`${environment.notFound}`).then();
        return EMPTY;
      })
    );
};
