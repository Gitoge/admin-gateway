import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIndices, Indices } from '../indices.model';
import { IndicesService } from '../service/indices.service';

@Injectable({ providedIn: 'root' })
export class IndicesRoutingResolveService implements Resolve<IIndices> {
  constructor(protected service: IndicesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIndices> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((indices: HttpResponse<Indices>) => {
          if (indices.body) {
            return of(indices.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Indices());
  }
}
