import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExclusionTaux, ExclusionTaux } from '../exclusion-taux.model';
import { ExclusionTauxService } from '../service/exclusion-taux.service';

@Injectable({ providedIn: 'root' })
export class ExclusionTauxRoutingResolveService implements Resolve<IExclusionTaux> {
  constructor(protected service: ExclusionTauxService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExclusionTaux> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exclusionTaux: HttpResponse<ExclusionTaux>) => {
          if (exclusionTaux.body) {
            return of(exclusionTaux.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExclusionTaux());
  }
}
