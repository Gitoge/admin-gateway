import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeActes, TypeActes } from '../type-actes.model';
import { TypeActesService } from '../service/type-actes.service';

@Injectable({ providedIn: 'root' })
export class TypeActesRoutingResolveService implements Resolve<ITypeActes> {
  constructor(protected service: TypeActesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeActes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeActes: HttpResponse<TypeActes>) => {
          if (typeActes.body) {
            return of(typeActes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeActes());
  }
}
