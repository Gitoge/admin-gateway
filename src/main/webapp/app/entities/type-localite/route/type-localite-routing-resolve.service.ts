import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeLocalite, TypeLocalite } from '../type-localite.model';
import { TypeLocaliteService } from '../service/type-localite.service';

@Injectable({ providedIn: 'root' })
export class TypeLocaliteRoutingResolveService implements Resolve<ITypeLocalite> {
  constructor(protected service: TypeLocaliteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeLocalite> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeLocalite: HttpResponse<TypeLocalite>) => {
          if (typeLocalite.body) {
            return of(typeLocalite.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeLocalite());
  }
}
