import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISituationAdministrative, SituationAdministrative } from '../situation-administrative.model';
import { SituationAdministrativeService } from '../service/situation-administrative.service';

@Injectable({ providedIn: 'root' })
export class SituationAdministrativeRoutingResolveService implements Resolve<ISituationAdministrative> {
  constructor(protected service: SituationAdministrativeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISituationAdministrative> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((situationAdministrative: HttpResponse<SituationAdministrative>) => {
          if (situationAdministrative.body) {
            return of(situationAdministrative.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SituationAdministrative());
  }
}
