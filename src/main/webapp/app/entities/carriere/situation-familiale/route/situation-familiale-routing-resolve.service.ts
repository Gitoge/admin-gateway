import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISituationFamiliale, SituationFamiliale } from '../situation-familiale.model';
import { SituationFamilialeService } from '../service/situation-familiale.service';

@Injectable({ providedIn: 'root' })
export class SituationFamilialeRoutingResolveService implements Resolve<ISituationFamiliale> {
  constructor(protected service: SituationFamilialeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISituationFamiliale> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((situationFamiliale: HttpResponse<SituationFamiliale>) => {
          if (situationFamiliale.body) {
            return of(situationFamiliale.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SituationFamiliale());
  }
}
