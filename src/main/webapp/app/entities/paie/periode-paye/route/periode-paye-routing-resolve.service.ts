import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPeriodePaye, PeriodePaye } from '../periode-paye.model';
import { PeriodePayeService } from '../service/periode-paye.service';

@Injectable({ providedIn: 'root' })
export class PeriodePayeRoutingResolveService implements Resolve<IPeriodePaye> {
  constructor(protected service: PeriodePayeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPeriodePaye> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((periodePaye: HttpResponse<PeriodePaye>) => {
          if (periodePaye.body) {
            return of(periodePaye.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PeriodePaye());
  }
}
