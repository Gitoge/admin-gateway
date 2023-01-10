import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPostesNonCumulabe, PostesNonCumulabe } from '../postes-non-cumulabe.model';
import { PostesNonCumulabeService } from '../service/postes-non-cumulabe.service';

@Injectable({ providedIn: 'root' })
export class PostesNonCumulabeRoutingResolveService implements Resolve<IPostesNonCumulabe> {
  constructor(protected service: PostesNonCumulabeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPostesNonCumulabe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((postesNonCumulabe: HttpResponse<PostesNonCumulabe>) => {
          if (postesNonCumulabe.body) {
            return of(postesNonCumulabe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PostesNonCumulabe());
  }
}
