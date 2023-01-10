import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActes, Actes } from '../actes.model';
import { ActesService } from '../service/actes.service';

@Injectable({ providedIn: 'root' })
export class ActesRoutingResolveService implements Resolve<IActes> {
  constructor(protected service: ActesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((actes: HttpResponse<Actes>) => {
          if (actes.body) {
            return of(actes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Actes());
  }
}
