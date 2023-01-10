import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPosteGrade, PosteGrade } from '../poste-grade.model';
import { PosteGradeService } from '../service/poste-grade.service';

@Injectable({ providedIn: 'root' })
export class PosteGradeRoutingResolveService implements Resolve<IPosteGrade> {
  constructor(protected service: PosteGradeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPosteGrade> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((posteGrade: HttpResponse<PosteGrade>) => {
          if (posteGrade.body) {
            return of(posteGrade.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PosteGrade());
  }
}
