import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICadre, Cadre } from '../cadre.model';
import { CadreService } from '../service/cadre.service';

@Injectable({ providedIn: 'root' })
export class CadreRoutingResolveService implements Resolve<ICadre> {
  constructor(protected service: CadreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICadre> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cadre: HttpResponse<Cadre>) => {
          if (cadre.body) {
            return of(cadre.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cadre());
  }
}
