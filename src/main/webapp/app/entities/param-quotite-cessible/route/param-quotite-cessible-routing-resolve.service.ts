import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParamQuotiteCessible, ParamQuotiteCessible } from '../param-quotite-cessible.model';
import { ParamQuotiteCessibleService } from '../service/param-quotite-cessible.service';

@Injectable({ providedIn: 'root' })
export class ParamQuotiteCessibleRoutingResolveService implements Resolve<IParamQuotiteCessible> {
  constructor(protected service: ParamQuotiteCessibleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParamQuotiteCessible> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paramQuotiteCessible: HttpResponse<ParamQuotiteCessible>) => {
          if (paramQuotiteCessible.body) {
            return of(paramQuotiteCessible.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParamQuotiteCessible());
  }
}
