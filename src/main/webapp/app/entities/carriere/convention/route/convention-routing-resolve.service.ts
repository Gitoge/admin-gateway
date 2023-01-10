import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConvention, Convention } from '../convention.model';
import { ConventionService } from '../service/convention.service';

@Injectable({ providedIn: 'root' })
export class ConventionRoutingResolveService implements Resolve<IConvention> {
  constructor(protected service: ConventionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConvention> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((convention: HttpResponse<Convention>) => {
          if (convention.body) {
            return of(convention.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Convention());
  }
}
