import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParamPartsFiscales, ParamPartsFiscales } from '../param-parts-fiscales.model';
import { ParamPartsFiscalesService } from '../service/param-parts-fiscales.service';

@Injectable({ providedIn: 'root' })
export class ParamPartsFiscalesRoutingResolveService implements Resolve<IParamPartsFiscales> {
  constructor(protected service: ParamPartsFiscalesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParamPartsFiscales> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paramPartsFiscales: HttpResponse<ParamPartsFiscales>) => {
          if (paramPartsFiscales.body) {
            return of(paramPartsFiscales.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParamPartsFiscales());
  }
}
