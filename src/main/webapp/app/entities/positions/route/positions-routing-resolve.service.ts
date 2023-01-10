import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPositions, Positions } from '../positions.model';
import { PositionsService } from '../service/positions.service';

@Injectable({ providedIn: 'root' })
export class PositionsRoutingResolveService implements Resolve<IPositions> {
  constructor(protected service: PositionsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPositions> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((positions: HttpResponse<Positions>) => {
          if (positions.body) {
            return of(positions.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Positions());
  }
}
