import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParamBaremeImposable, ParamBaremeImposable } from '../param-bareme-imposable.model';
import { ParamBaremeImposableService } from '../service/param-bareme-imposable.service';

@Injectable({ providedIn: 'root' })
export class ParamBaremeImposableRoutingResolveService implements Resolve<IParamBaremeImposable> {
  constructor(protected service: ParamBaremeImposableService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParamBaremeImposable> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paramBaremeImposable: HttpResponse<ParamBaremeImposable>) => {
          if (paramBaremeImposable.body) {
            return of(paramBaremeImposable.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParamBaremeImposable());
  }
}
