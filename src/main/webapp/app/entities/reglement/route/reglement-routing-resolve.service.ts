import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReglement, Reglement } from '../reglement.model';
import { ReglementService } from '../service/reglement.service';

@Injectable({ providedIn: 'root' })
export class ReglementRoutingResolveService implements Resolve<IReglement> {
  constructor(protected service: ReglementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReglement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((reglement: HttpResponse<Reglement>) => {
          if (reglement.body) {
            return of(reglement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Reglement());
  }
}
