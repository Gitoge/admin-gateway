import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPostes, Postes } from '../postes.model';
import { PostesService } from '../service/postes.service';

@Injectable({ providedIn: 'root' })
export class PostesRoutingResolveService implements Resolve<IPostes> {
  constructor(protected service: PostesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPostes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((postes: HttpResponse<Postes>) => {
          if (postes.body) {
            return of(postes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Postes());
  }
}
