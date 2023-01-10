import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPages, Pages } from '../pages.model';
import { PagesService } from '../service/pages.service';

@Injectable({ providedIn: 'root' })
export class PagesRoutingResolveService implements Resolve<IPages> {
  constructor(protected service: PagesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPages> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pages: HttpResponse<Pages>) => {
          if (pages.body) {
            return of(pages.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Pages());
  }
}
