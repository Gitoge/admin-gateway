import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeReglement, TypeReglement } from '../type-reglement.model';
import { TypeReglementService } from '../service/type-reglement.service';

@Injectable({ providedIn: 'root' })
export class TypeReglementRoutingResolveService implements Resolve<ITypeReglement> {
  constructor(protected service: TypeReglementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeReglement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeReglement: HttpResponse<TypeReglement>) => {
          if (typeReglement.body) {
            return of(typeReglement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeReglement());
  }
}
