import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHierarchieCategorie, HierarchieCategorie } from '../hierarchie-categorie.model';
import { HierarchieCategorieService } from '../service/hierarchie-categorie.service';

@Injectable({ providedIn: 'root' })
export class HierarchieCategorieRoutingResolveService implements Resolve<IHierarchieCategorie> {
  constructor(protected service: HierarchieCategorieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHierarchieCategorie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hierarchieCategorie: HttpResponse<HierarchieCategorie>) => {
          if (hierarchieCategorie.body) {
            return of(hierarchieCategorie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new HierarchieCategorie());
  }
}
