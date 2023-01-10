import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParamMatricules, ParamMatricules } from '../param-matricules.model';
import { ParamMatriculesService } from '../service/param-matricules.service';

@Injectable({ providedIn: 'root' })
export class ParamMatriculesRoutingResolveService implements Resolve<IParamMatricules> {
  constructor(protected service: ParamMatriculesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParamMatricules> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paramMatricules: HttpResponse<ParamMatricules>) => {
          if (paramMatricules.body) {
            return of(paramMatricules.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParamMatricules());
  }
}
