import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPositionsAgent, PositionsAgent } from '../positions-agent.model';
import { PositionsAgentService } from '../service/positions-agent.service';

@Injectable({ providedIn: 'root' })
export class PositionsAgentRoutingResolveService implements Resolve<IPositionsAgent> {
  constructor(protected service: PositionsAgentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPositionsAgent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((positionsAgent: HttpResponse<PositionsAgent>) => {
          if (positionsAgent.body) {
            return of(positionsAgent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PositionsAgent());
  }
}
