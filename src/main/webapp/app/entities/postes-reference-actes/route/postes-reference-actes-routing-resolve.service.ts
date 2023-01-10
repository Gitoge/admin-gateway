import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPostesReferenceActes, PostesReferenceActes } from '../postes-reference-actes.model';
import { PostesReferenceActesService } from '../service/postes-reference-actes.service';

@Injectable({ providedIn: 'root' })
export class PostesReferenceActesRoutingResolveService implements Resolve<IPostesReferenceActes> {
  constructor(protected service: PostesReferenceActesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPostesReferenceActes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((postesReferenceActes: HttpResponse<PostesReferenceActes>) => {
          if (postesReferenceActes.body) {
            return of(postesReferenceActes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PostesReferenceActes());
  }
}
