import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiplomes, Diplomes } from '../diplomes.model';
import { DiplomesService } from '../service/diplomes.service';

@Injectable({ providedIn: 'root' })
export class DiplomesRoutingResolveService implements Resolve<IDiplomes> {
  constructor(protected service: DiplomesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDiplomes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((diplomes: HttpResponse<Diplomes>) => {
          if (diplomes.body) {
            return of(diplomes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Diplomes());
  }
}
