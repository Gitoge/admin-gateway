import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnfant, Enfant } from '../enfant.model';
import { EnfantService } from '../service/enfant.service';

@Injectable({ providedIn: 'root' })
export class EnfantRoutingResolveService implements Resolve<IEnfant> {
  constructor(protected service: EnfantService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEnfant> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((enfant: HttpResponse<Enfant>) => {
          if (enfant.body) {
            return of(enfant.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Enfant());
  }
}
