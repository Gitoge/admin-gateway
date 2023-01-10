import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INationalite, Nationalite } from '../nationalite.model';
import { NationaliteService } from '../service/nationalite.service';

@Injectable({ providedIn: 'root' })
export class NationaliteRoutingResolveService implements Resolve<INationalite> {
  constructor(protected service: NationaliteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INationalite> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((nationalite: HttpResponse<Nationalite>) => {
          if (nationalite.body) {
            return of(nationalite.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Nationalite());
  }
}
