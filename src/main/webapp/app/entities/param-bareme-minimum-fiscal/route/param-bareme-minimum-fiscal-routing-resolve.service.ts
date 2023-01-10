import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParamBaremeMinimumFiscal, ParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';
import { ParamBaremeMinimumFiscalService } from '../service/param-bareme-minimum-fiscal.service';

@Injectable({ providedIn: 'root' })
export class ParamBaremeMinimumFiscalRoutingResolveService implements Resolve<IParamBaremeMinimumFiscal> {
  constructor(protected service: ParamBaremeMinimumFiscalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParamBaremeMinimumFiscal> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paramBaremeMinimumFiscal: HttpResponse<ParamBaremeMinimumFiscal>) => {
          if (paramBaremeMinimumFiscal.body) {
            return of(paramBaremeMinimumFiscal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParamBaremeMinimumFiscal());
  }
}
