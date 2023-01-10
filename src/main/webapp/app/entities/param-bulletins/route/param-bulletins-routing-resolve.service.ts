import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParamBulletins, ParamBulletins } from '../param-bulletins.model';
import { ParamBulletinsService } from '../service/param-bulletins.service';

@Injectable({ providedIn: 'root' })
export class ParamBulletinsRoutingResolveService implements Resolve<IParamBulletins> {
  constructor(protected service: ParamBulletinsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParamBulletins> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paramBulletins: HttpResponse<ParamBulletins>) => {
          if (paramBulletins.body) {
            return of(paramBulletins.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParamBulletins());
  }
}
