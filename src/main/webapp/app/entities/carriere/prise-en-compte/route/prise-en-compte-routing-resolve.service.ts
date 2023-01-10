import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPriseEnCompte, PriseEnCompte } from '../prise-en-compte.model';
import { PriseEnCompteService } from '../service/prise-en-compte.service';

@Injectable({ providedIn: 'root' })
export class PriseEnCompteRoutingResolveService implements Resolve<IPriseEnCompte> {
  constructor(protected service: PriseEnCompteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPriseEnCompte> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((priseEncompte: HttpResponse<PriseEnCompte>) => {
          if (priseEncompte.body) {
            return of(priseEncompte.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PriseEnCompte());
  }
}
