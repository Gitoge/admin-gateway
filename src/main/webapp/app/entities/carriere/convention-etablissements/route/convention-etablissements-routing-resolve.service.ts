import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConventionEtablissements, ConventionEtablissements } from '../convention-etablissements.model';
import { ConventionEtablissementsService } from '../service/convention-etablissements.service';

@Injectable({ providedIn: 'root' })
export class ConventionEtablissementsRoutingResolveService implements Resolve<IConventionEtablissements> {
  constructor(protected service: ConventionEtablissementsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConventionEtablissements> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((conventionEtablissements: HttpResponse<ConventionEtablissements>) => {
          if (conventionEtablissements.body) {
            return of(conventionEtablissements.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ConventionEtablissements());
  }
}
