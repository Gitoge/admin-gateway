import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPosteCompoGrade, PosteCompoGrade } from '../poste-compo-grade.model';
import { PosteCompoGradeService } from '../service/poste-compo-grade.service';

@Injectable({ providedIn: 'root' })
export class PosteCompoGradeRoutingResolveService implements Resolve<IPosteCompoGrade> {
  constructor(protected service: PosteCompoGradeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPosteCompoGrade> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((posteCompoGrade: HttpResponse<PosteCompoGrade>) => {
          if (posteCompoGrade.body) {
            return of(posteCompoGrade.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PosteCompoGrade());
  }
}
