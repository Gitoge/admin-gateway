import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParametre, Parametre } from '../parametre.model';
import { ParametreService } from '../service/parametre.service';

@Injectable({ providedIn: 'root' })
export class ParametreRoutingResolveService implements Resolve<IParametre> {
  constructor(protected service: ParametreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParametre> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parametre: HttpResponse<Parametre>) => {
          if (parametre.body) {
            return of(parametre.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Parametre());
  }
}
