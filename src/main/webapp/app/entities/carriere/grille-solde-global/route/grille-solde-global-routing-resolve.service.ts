import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrilleSoldeGlobal, GrilleSoldeGlobal } from '../grille-solde-global.model';
import { GrilleSoldeGlobalService } from '../service/grille-solde-global.service';

@Injectable({ providedIn: 'root' })
export class GrilleSoldeGlobalRoutingResolveService implements Resolve<IGrilleSoldeGlobal> {
  constructor(protected service: GrilleSoldeGlobalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrilleSoldeGlobal> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grilleSoldeGlobal: HttpResponse<GrilleSoldeGlobal>) => {
          if (grilleSoldeGlobal.body) {
            return of(grilleSoldeGlobal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new GrilleSoldeGlobal());
  }
}
