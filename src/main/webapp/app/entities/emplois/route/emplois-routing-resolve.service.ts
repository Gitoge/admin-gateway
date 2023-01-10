import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmplois, Emplois } from '../emplois.model';
import { EmploisService } from '../service/emplois.service';

@Injectable({ providedIn: 'root' })
export class EmploisRoutingResolveService implements Resolve<IEmplois> {
  constructor(protected service: EmploisService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmplois> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emplois: HttpResponse<Emplois>) => {
          if (emplois.body) {
            return of(emplois.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Emplois());
  }
}
