import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEchelon, Echelon } from '../echelon.model';
import { EchelonService } from '../service/echelon.service';

@Injectable({ providedIn: 'root' })
export class EchelonRoutingResolveService implements Resolve<IEchelon> {
  constructor(protected service: EchelonService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEchelon> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((echelon: HttpResponse<Echelon>) => {
          if (echelon.body) {
            return of(echelon.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Echelon());
  }
}
