import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDirection, Direction } from '../direction.model';
import { DirectionService } from '../service/direction.service';

@Injectable({ providedIn: 'root' })
export class DirectionRoutingResolveService implements Resolve<IDirection> {
  constructor(protected service: DirectionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDirection> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((direction: HttpResponse<Direction>) => {
          if (direction.body) {
            return of(direction.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Direction());
  }
}
