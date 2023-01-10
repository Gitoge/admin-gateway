import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBilleteur, Billeteur } from '../billeteur.model';
import { BilleteurService } from '../service/billeteur.service';

@Injectable({ providedIn: 'root' })
export class BilleteurRoutingResolveService implements Resolve<IBilleteur> {
  constructor(protected service: BilleteurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBilleteur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billeteur: HttpResponse<Billeteur>) => {
          if (billeteur.body) {
            return of(billeteur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Billeteur());
  }
}
