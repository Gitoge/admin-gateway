import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypePosition, TypePosition } from '../type-position.model';
import { TypePositionService } from '../service/type-position.service';

@Injectable({ providedIn: 'root' })
export class TypePositionRoutingResolveService implements Resolve<ITypePosition> {
  constructor(protected service: TypePositionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypePosition> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typePosition: HttpResponse<TypePosition>) => {
          if (typePosition.body) {
            return of(typePosition.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypePosition());
  }
}
