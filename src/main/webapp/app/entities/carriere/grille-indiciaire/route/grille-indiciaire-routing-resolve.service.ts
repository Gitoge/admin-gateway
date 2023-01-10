import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrilleIndiciaire, GrilleIndiciaire } from '../grille-indiciaire.model';
import { GrilleIndiciaireService } from '../service/grille-indiciaire.service';

@Injectable({ providedIn: 'root' })
export class GrilleIndiciaireRoutingResolveService implements Resolve<IGrilleIndiciaire> {
  constructor(protected service: GrilleIndiciaireService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrilleIndiciaire> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grilleIndiciaire: HttpResponse<GrilleIndiciaire>) => {
          if (grilleIndiciaire.body) {
            return of(grilleIndiciaire.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new GrilleIndiciaire());
  }
}
