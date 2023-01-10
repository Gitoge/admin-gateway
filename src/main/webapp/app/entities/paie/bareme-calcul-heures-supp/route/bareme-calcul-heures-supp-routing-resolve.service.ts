import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBaremeCalculHeuresSupp, BaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';
import { BaremeCalculHeuresSuppService } from '../service/bareme-calcul-heures-supp.service';

@Injectable({ providedIn: 'root' })
export class BaremeCalculHeuresSuppRoutingResolveService implements Resolve<IBaremeCalculHeuresSupp> {
  constructor(protected service: BaremeCalculHeuresSuppService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBaremeCalculHeuresSupp> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((baremeCalculHeuresSupp: HttpResponse<BaremeCalculHeuresSupp>) => {
          if (baremeCalculHeuresSupp.body) {
            return of(baremeCalculHeuresSupp.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BaremeCalculHeuresSupp());
  }
}
