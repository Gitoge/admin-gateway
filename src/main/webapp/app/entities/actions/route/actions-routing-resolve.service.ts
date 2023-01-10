import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActions, Actions } from '../actions.model';
import { ActionsService } from '../service/actions.service';

@Injectable({ providedIn: 'root' })
export class ActionsRoutingResolveService implements Resolve<IActions> {
  constructor(protected service: ActionsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActions> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((actions: HttpResponse<Actions>) => {
          if (actions.body) {
            return of(actions.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Actions());
  }
}
