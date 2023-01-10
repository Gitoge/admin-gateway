import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArrondissement, Arrondissement } from '../arrondissement.model';
import { ArrondissementService } from '../service/arrondissement.service';

@Injectable({ providedIn: 'root' })
export class ArrondissementRoutingResolveService implements Resolve<IArrondissement> {
  constructor(protected service: ArrondissementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArrondissement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((arrondissement: HttpResponse<Arrondissement>) => {
          if (arrondissement.body) {
            return of(arrondissement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Arrondissement());
  }
}
