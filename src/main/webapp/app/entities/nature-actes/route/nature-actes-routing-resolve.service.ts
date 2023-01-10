import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INatureActes, NatureActes } from '../nature-actes.model';
import { NatureActesService } from '../service/nature-actes.service';

@Injectable({ providedIn: 'root' })
export class NatureActesRoutingResolveService implements Resolve<INatureActes> {
  constructor(protected service: NatureActesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INatureActes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((natureActes: HttpResponse<NatureActes>) => {
          if (natureActes.body) {
            return of(natureActes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NatureActes());
  }
}
