import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExercice, Exercice } from '../exercice.model';
import { ExerciceService } from '../service/exercice.service';

@Injectable({ providedIn: 'root' })
export class ExerciceRoutingResolveService implements Resolve<IExercice> {
  constructor(protected service: ExerciceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExercice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exercice: HttpResponse<Exercice>) => {
          if (exercice.body) {
            return of(exercice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Exercice());
  }
}
