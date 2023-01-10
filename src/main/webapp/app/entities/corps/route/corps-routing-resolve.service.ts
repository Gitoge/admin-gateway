import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICorps, Corps } from '../corps.model';
import { CorpsService } from '../service/corps.service';

@Injectable({ providedIn: 'root' })
export class CorpsRoutingResolveService implements Resolve<ICorps> {
  constructor(protected service: CorpsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICorps> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((corps: HttpResponse<Corps>) => {
          if (corps.body) {
            return of(corps.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Corps());
  }
}
