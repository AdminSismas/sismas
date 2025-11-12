import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ProFlow } from '@features/bpm-workflows/models/pro-flow';
import { catchError, EMPTY } from 'rxjs';
import { BpmCoreService } from '@features/bpm-workflows/services/core/bpm-core.service';
import { environment } from '@environments/environments';
import { CONSTANT_NAME_ID } from '@shared/constants/constantLabels';


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
