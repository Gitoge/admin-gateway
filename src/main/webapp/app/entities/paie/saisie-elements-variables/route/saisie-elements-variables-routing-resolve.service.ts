import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISaisieElementsVariables, SaisieElementsVariables } from '../saisie-elements-variables.model';
import { SaisieElementsVariablesService } from '../service/saisie-elements-variables.service';

@Injectable({ providedIn: 'root' })
export class SaisieElementsVariablesRoutingResolveService implements Resolve<ISaisieElementsVariables> {
  constructor(protected service: SaisieElementsVariablesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISaisieElementsVariables> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((saisieElementsVariables: HttpResponse<SaisieElementsVariables>) => {
          if (saisieElementsVariables.body) {
            return of(saisieElementsVariables.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SaisieElementsVariables());
  }
}
